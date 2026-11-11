const db = require('../src/config/database');

const TABLES = [
  'songs',
  'artists',
  'albums',
  'genres',
  'moods',
  'song_artists',
  'song_genres',
  'song_moods',
  'song_attributes',
  'artist_albums',
];

async function verify() {
  console.log('========================================================');
  console.log('       MoodMix Normalized Database Verification');
  console.log('========================================================\n');

  const client = await db.getClient();
  try {
    console.log('PostgreSQL: CONNECTED\n');

    // 1. Table Counts
    console.log('--- Table Statistics ---');
    for (const table of TABLES) {
      try {
        const res = await client.query(`SELECT COUNT(*) AS total FROM ${table};`);
        console.log(`${table.padEnd(20)} ${res.rows[0].total}`);
      } catch (err) {
        console.log(`${table.padEnd(20)} ERROR (${err.message})`);
      }
    }

    console.log();

    // 2. Data Integrity Checks
    console.log('--- Data Integrity Checks ---');

    // Duplicate YouTube IDs
    const dupRes = await client.query(`
      SELECT COUNT(*) AS dupes FROM (
        SELECT youtube_video_id, COUNT(*) 
        FROM songs 
        WHERE youtube_video_id IS NOT NULL 
        GROUP BY youtube_video_id 
        HAVING COUNT(*) > 1
      ) d;
    `);
    const duplicateCount = parseInt(dupRes.rows[0].dupes, 10);
    console.log(`Duplicate YouTube IDs:  ${duplicateCount} ${duplicateCount === 0 ? '✓' : '✗'}`);

    // Missing Titles
    const titleRes = await client.query(`
      SELECT COUNT(*) AS cnt FROM songs WHERE title IS NULL OR TRIM(title) = '';
    `);
    const missingTitles = parseInt(titleRes.rows[0].cnt, 10);
    console.log(`Missing Song Titles:    ${missingTitles} ${missingTitles === 0 ? '✓' : '✗'}`);

    // Songs with zero artists
    const orphanSongsRes = await client.query(`
      SELECT COUNT(*) AS cnt FROM songs s
      LEFT JOIN song_artists sa ON sa.song_id = s.song_id
      WHERE sa.song_id IS NULL;
    `);
    const unlinkedArtists = parseInt(orphanSongsRes.rows[0].cnt, 10);
    console.log(`Songs Without Artists:  ${unlinkedArtists} ${unlinkedArtists === 0 ? '✓' : '✗'}`);

    // Songs with zero genres
    const orphanGenreRes = await client.query(`
      SELECT COUNT(*) AS cnt FROM songs s
      LEFT JOIN song_genres sg ON sg.song_id = s.song_id
      WHERE sg.song_id IS NULL;
    `);
    const unlinkedGenres = parseInt(orphanGenreRes.rows[0].cnt, 10);
    console.log(`Songs Without Genres:   ${unlinkedGenres}`);

    // Songs with zero moods
    const orphanMoodRes = await client.query(`
      SELECT COUNT(*) AS cnt FROM songs s
      LEFT JOIN song_moods sm ON sm.song_id = s.song_id
      WHERE sm.song_id IS NULL;
    `);
    const unlinkedMoods = parseInt(orphanMoodRes.rows[0].cnt, 10);
    console.log(`Songs Without Moods:    ${unlinkedMoods}`);

    console.log();

    // 3. Sample Joined Query: Proof of relational integrity
    console.log('--- Sample Relational Query: Top 3 Songs with Moods & Artists ---');
    const sampleQuery = `
      SELECT 
        s.title,
        STRING_AGG(DISTINCT a.name, ', ') AS artists,
        COALESCE(al.title, 'Single') AS album,
        s.language,
        STRING_AGG(DISTINCT g.name, ', ') AS genres,
        STRING_AGG(DISTINCT m.name, ', ') AS moods,
        s.youtube_url
      FROM songs s
      LEFT JOIN song_artists sa ON sa.song_id = s.song_id
      LEFT JOIN artists a ON a.artist_id = sa.artist_id
      LEFT JOIN albums al ON al.album_id = s.album_id
      LEFT JOIN song_genres sg ON sg.song_id = s.song_id
      LEFT JOIN genres g ON g.genre_id = sg.genre_id
      LEFT JOIN song_moods sm ON sm.song_id = s.song_id
      LEFT JOIN moods m ON m.mood_id = sm.mood_id
      GROUP BY s.song_id, s.title, al.title, s.language, s.youtube_url, s.updated_at
      ORDER BY s.updated_at DESC
      LIMIT 3;
    `;
    const sampleRes = await client.query(sampleQuery);
    sampleRes.rows.forEach((r, idx) => {
      console.log(`[${idx + 1}] "${r.title}" by ${r.artists}`);
      console.log(`    Album: ${r.album} | Language: ${r.language}`);
      console.log(`    Genres: ${r.genres || 'None'} | Moods: ${r.moods || 'None'}`);
      console.log(`    URL: ${r.youtube_url}\n`);
    });

    console.log('========================================================');
    console.log('Database Status: READY FOR MUSIC RECOMMENDATION');
    console.log('========================================================');
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    client.release();
    await db.pool.end();
  }
}

verify();

