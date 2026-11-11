const db = require('../config/database');
const logger = require('../utils/logger');

// Cache genre and mood lookups to minimize DB roundtrips
let genresCache = null;
let moodsCache = null;

async function loadGenresAndMoods(client) {
  if (!genresCache) {
    const res = await client.query('SELECT genre_id, name, slug FROM genres;');
    genresCache = new Map(res.rows.map((r) => [r.slug, r.genre_id]));
  }
  if (!moodsCache) {
    const res = await client.query('SELECT mood_id, name, slug FROM moods;');
    moodsCache = new Map(res.rows.map((r) => [r.slug, r.mood_id]));
  }
}

async function findOrCreateArtist(client, artistData) {
  const { name, youtubeChannelId } = artistData;
  const cleanName = (name || 'Unknown Artist').trim().slice(0, 255);

  // If a channel ID is provided, check if it already exists under ANY artist name.
  // This prevents the unique constraint violation on youtube_channel_id.
  if (youtubeChannelId) {
    const existing = await client.query(
      'SELECT artist_id FROM artists WHERE youtube_channel_id = $1 LIMIT 1;',
      [youtubeChannelId]
    );
    if (existing.rows.length > 0) {
      return existing.rows[0].artist_id;
    }
  }

  // Insert by name; if name already exists, preserve the existing channel ID.
  const sql = `
    INSERT INTO artists (artist_id, name, youtube_channel_id)
    VALUES (gen_random_uuid(), $1, $2)
    ON CONFLICT (name) DO UPDATE SET
      youtube_channel_id = COALESCE(artists.youtube_channel_id, EXCLUDED.youtube_channel_id),
      updated_at = NOW()
    RETURNING artist_id;
  `;
  const res = await client.query(sql, [cleanName, youtubeChannelId || null]);
  return res.rows[0].artist_id;
}

async function findOrCreateAlbum(client, albumData, artistId = null) {
  const { title, releaseDate, coverImageUrl, albumType } = albumData;
  const cleanTitle = (title || 'Single').trim().slice(0, 255);

  // Check if album exists with exact title
  const findRes = await client.query('SELECT album_id FROM albums WHERE title = $1 LIMIT 1;', [cleanTitle]);
  if (findRes.rows.length > 0) {
    const albumId = findRes.rows[0].album_id;
    if (artistId) {
      await client.query(
        'INSERT INTO artist_albums (artist_id, album_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;',
        [artistId, albumId]
      );
    }
    return albumId;
  }

  const insertSql = `
    INSERT INTO albums (album_id, title, release_date, cover_image_url, album_type)
    VALUES (gen_random_uuid(), $1, $2, $3, $4)
    RETURNING album_id;
  `;
  const insertRes = await client.query(insertSql, [
    cleanTitle,
    releaseDate || null,
    coverImageUrl || null,
    albumType || 'single',
  ]);
  const newAlbumId = insertRes.rows[0].album_id;

  if (artistId) {
    await client.query(
      'INSERT INTO artist_albums (artist_id, album_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;',
      [artistId, newAlbumId]
    );
  }

  return newAlbumId;
}

async function findOrCreateGenre(client, genreName) {
  await loadGenresAndMoods(client);
  const slug = genreName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  if (genresCache.has(slug)) {
    return genresCache.get(slug);
  }

  const sql = `
    INSERT INTO genres (genre_id, name, slug)
    VALUES (gen_random_uuid(), $1, $2)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING genre_id;
  `;
  const res = await client.query(sql, [genreName, slug]);
  const id = res.rows[0].genre_id;
  genresCache.set(slug, id);
  return id;
}

async function getMoodIdBySlug(client, moodSlug) {
  await loadGenresAndMoods(client);
  const cleanSlug = moodSlug.toLowerCase().trim();
  if (moodsCache.has(cleanSlug)) {
    return moodsCache.get(cleanSlug);
  }
  // If not found in cache, fallback to DB query
  const res = await client.query('SELECT mood_id FROM moods WHERE slug = $1 LIMIT 1;', [cleanSlug]);
  if (res.rows.length > 0) {
    const id = res.rows[0].mood_id;
    moodsCache.set(cleanSlug, id);
    return id;
  }
  return null;
}

async function upsertSong(client, songData) {
  const sql = `
    INSERT INTO songs (
      song_id, album_id, title, artist, album, language, genre,
      mood_tags, energy, tempo_bpm, duration_seconds, release_date,
      explicit, popularity, youtube_video_id, youtube_url,
      thumbnail_url, source, metadata, raw_metadata
    ) VALUES (
      gen_random_uuid(), $1, $2, $3, $4, $5, $6,
      $7::jsonb, $8, $9, $10, $11,
      $12, $13, $14, $15,
      $16, $17, $18::jsonb, $19::jsonb
    )
    ON CONFLICT (youtube_video_id) DO UPDATE SET
      title = EXCLUDED.title,
      artist = COALESCE(EXCLUDED.artist, songs.artist),
      album = COALESCE(EXCLUDED.album, songs.album),
      album_id = COALESCE(EXCLUDED.album_id, songs.album_id),
      language = COALESCE(EXCLUDED.language, songs.language),
      genre = COALESCE(EXCLUDED.genre, songs.genre),
      mood_tags = COALESCE(EXCLUDED.mood_tags, songs.mood_tags),
      energy = COALESCE(EXCLUDED.energy, songs.energy),
      tempo_bpm = COALESCE(EXCLUDED.tempo_bpm, songs.tempo_bpm),
      duration_seconds = COALESCE(EXCLUDED.duration_seconds, songs.duration_seconds),
      release_date = COALESCE(EXCLUDED.release_date, songs.release_date),
      popularity = EXCLUDED.popularity,
      thumbnail_url = COALESCE(EXCLUDED.thumbnail_url, songs.thumbnail_url),
      metadata = COALESCE(EXCLUDED.metadata, songs.metadata),
      raw_metadata = songs.raw_metadata || EXCLUDED.raw_metadata,
      updated_at = NOW()
    RETURNING song_id, (xmax = 0) AS is_inserted;
  `;

  const values = [
    songData.albumId || null,
    songData.title,
    songData.artist || null,
    songData.album || null,
    songData.language || null,
    songData.genre || null,
    JSON.stringify(songData.moodTags || []),
    songData.energy || null,
    songData.tempoBpm || null,
    songData.durationSeconds || null,
    songData.releaseDate || null,
    songData.explicit || false,
    songData.popularity || 0,
    songData.youtubeVideoId,
    songData.youtubeUrl,
    songData.thumbnailUrl || null,
    songData.source || 'youtube',
    JSON.stringify(songData.metadata || songData.rawMetadata || {}),
    JSON.stringify(songData.rawMetadata || {}),
  ];

  const res = await client.query(sql, values);
  return res.rows[0];
}

async function linkSongArtist(client, songId, artistId, role = 'primary', position = 1) {
  const sql = `
    INSERT INTO song_artists (song_id, artist_id, role, position)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (song_id, artist_id) DO UPDATE SET
      role = EXCLUDED.role,
      position = EXCLUDED.position;
  `;
  await client.query(sql, [songId, artistId, role, position]);
}

async function linkSongGenre(client, songId, genreId, isPrimary = false) {
  const sql = `
    INSERT INTO song_genres (song_id, genre_id, is_primary)
    VALUES ($1, $2, $3)
    ON CONFLICT (song_id, genre_id) DO UPDATE SET
      is_primary = EXCLUDED.is_primary;
  `;
  await client.query(sql, [songId, genreId, isPrimary]);
}

async function linkSongMood(client, songId, moodId, confidence = 1.0, source = 'rule') {
  const sql = `
    INSERT INTO song_moods (song_id, mood_id, confidence, source)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (song_id, mood_id) DO UPDATE SET
      confidence = GREATEST(song_moods.confidence, EXCLUDED.confidence);
  `;
  await client.query(sql, [songId, moodId, confidence, source]);
}

async function upsertSongAttributes(client, songId, attributes = {}) {
  const sql = `
    INSERT INTO song_attributes (
      song_id, energy, valence, danceability, acousticness,
      instrumentalness, speechiness, loudness, tempo, key, mode, time_signature
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10, $11, $12
    )
    ON CONFLICT (song_id) DO UPDATE SET
      energy = COALESCE(EXCLUDED.energy, song_attributes.energy),
      valence = COALESCE(EXCLUDED.valence, song_attributes.valence),
      danceability = COALESCE(EXCLUDED.danceability, song_attributes.danceability),
      acousticness = COALESCE(EXCLUDED.acousticness, song_attributes.acousticness),
      instrumentalness = COALESCE(EXCLUDED.instrumentalness, song_attributes.instrumentalness),
      speechiness = COALESCE(EXCLUDED.speechiness, song_attributes.speechiness),
      loudness = COALESCE(EXCLUDED.loudness, song_attributes.loudness),
      tempo = COALESCE(EXCLUDED.tempo, song_attributes.tempo),
      updated_at = NOW();
  `;

  // Explicit NULLs when attributes not provided by API (Quality over fake data!)
  const values = [
    songId,
    attributes.energy ?? null,
    attributes.valence ?? null,
    attributes.danceability ?? null,
    attributes.acousticness ?? null,
    attributes.instrumentalness ?? null,
    attributes.speechiness ?? null,
    attributes.loudness ?? null,
    attributes.tempo ?? null,
    attributes.key ?? null,
    attributes.mode ?? null,
    attributes.time_signature ?? null,
  ];

  await client.query(sql, values);
}

module.exports = {
  loadGenresAndMoods,
  findOrCreateArtist,
  findOrCreateAlbum,
  findOrCreateGenre,
  getMoodIdBySlug,
  upsertSong,
  linkSongArtist,
  linkSongGenre,
  linkSongMood,
  upsertSongAttributes,
};

