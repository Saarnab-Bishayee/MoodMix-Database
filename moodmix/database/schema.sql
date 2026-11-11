-- ============================================================================
-- MoodMix Normalized Music Database Schema
-- Version: 2.0.0 (Relational Normalized Music Architecture)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. ARTISTS
CREATE TABLE IF NOT EXISTS artists (
    artist_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    image_url TEXT,
    spotify_id VARCHAR(100) UNIQUE,
    youtube_channel_id VARCHAR(100) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_artist_name UNIQUE (name)
);

-- 2. ALBUMS
CREATE TABLE IF NOT EXISTS albums (
    album_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    release_date DATE,
    cover_image_url TEXT,
    album_type VARCHAR(50) DEFAULT 'single',
    total_tracks INTEGER DEFAULT 1,
    spotify_id VARCHAR(100) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ARTIST_ALBUMS (Many-to-Many: Multiple artists per album)
CREATE TABLE IF NOT EXISTS artist_albums (
    artist_id UUID REFERENCES artists(artist_id) ON DELETE CASCADE,
    album_id UUID REFERENCES albums(album_id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'primary',
    PRIMARY KEY (artist_id, album_id)
);

-- 4. GENRES
CREATE TABLE IF NOT EXISTS genres (
    genre_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MOODS
CREATE TABLE IF NOT EXISTS moods (
    mood_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SONGS (Core Music Records)
CREATE TABLE IF NOT EXISTS songs (
    song_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID REFERENCES albums(album_id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    duration_seconds INTEGER,
    release_date DATE,
    language VARCHAR(80),
    explicit BOOLEAN DEFAULT FALSE,
    popularity INTEGER DEFAULT 0,
    youtube_video_id VARCHAR(100) UNIQUE,
    youtube_url TEXT,
    spotify_id VARCHAR(100) UNIQUE,
    spotify_url TEXT,
    thumbnail_url TEXT,
    source VARCHAR(50) DEFAULT 'youtube',
    raw_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely add newly required columns if songs table pre-existed
ALTER TABLE songs ADD COLUMN IF NOT EXISTS album_id UUID REFERENCES albums(album_id) ON DELETE SET NULL;
ALTER TABLE songs ADD COLUMN IF NOT EXISTS release_date DATE;
ALTER TABLE songs ADD COLUMN IF NOT EXISTS explicit BOOLEAN DEFAULT FALSE;
ALTER TABLE songs ADD COLUMN IF NOT EXISTS popularity INTEGER DEFAULT 0;
ALTER TABLE songs ADD COLUMN IF NOT EXISTS spotify_id VARCHAR(100) UNIQUE;
ALTER TABLE songs ADD COLUMN IF NOT EXISTS spotify_url TEXT;
ALTER TABLE songs ADD COLUMN IF NOT EXISTS raw_metadata JSONB DEFAULT '{}'::jsonb;
ALTER TABLE songs ADD COLUMN IF NOT EXISTS is_ml_processed BOOLEAN DEFAULT FALSE;
ALTER TABLE songs ADD COLUMN IF NOT EXISTS ml_processed_at TIMESTAMPTZ;

-- 7. SONG_ARTISTS (Many-to-Many: Collaborations & Primary/Featured Artists)
CREATE TABLE IF NOT EXISTS song_artists (
    song_id UUID REFERENCES songs(song_id) ON DELETE CASCADE,
    artist_id UUID REFERENCES artists(artist_id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'primary',
    position INTEGER DEFAULT 1,
    PRIMARY KEY (song_id, artist_id)
);

-- 8. SONG_GENRES (Many-to-Many: Multiple genres per song)
CREATE TABLE IF NOT EXISTS song_genres (
    song_id UUID REFERENCES songs(song_id) ON DELETE CASCADE,
    genre_id UUID REFERENCES genres(genre_id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (song_id, genre_id)
);

-- 9. SONG_MOODS (Many-to-Many: Multi-mood assignment)
CREATE TABLE IF NOT EXISTS song_moods (
    song_id UUID REFERENCES songs(song_id) ON DELETE CASCADE,
    mood_id UUID REFERENCES moods(mood_id) ON DELETE CASCADE,
    confidence REAL DEFAULT 1.0,
    source VARCHAR(50) DEFAULT 'rule',
    PRIMARY KEY (song_id, mood_id)
);

-- 10. SONG_ATTRIBUTES (Audio characteristics & signals)
CREATE TABLE IF NOT EXISTS song_attributes (
    song_id UUID PRIMARY KEY REFERENCES songs(song_id) ON DELETE CASCADE,
    energy REAL,
    valence REAL,
    danceability REAL,
    acousticness REAL,
    instrumentalness REAL,
    speechiness REAL,
    loudness REAL,
    tempo REAL,
    key INTEGER,
    mode INTEGER,
    time_signature INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR FAST QUERYING
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_songs_title ON songs(title);
CREATE INDEX IF NOT EXISTS idx_songs_youtube_video_id ON songs(youtube_video_id);
CREATE INDEX IF NOT EXISTS idx_songs_language ON songs(language);
CREATE INDEX IF NOT EXISTS idx_songs_popularity ON songs(popularity DESC);
CREATE INDEX IF NOT EXISTS idx_songs_release_date ON songs(release_date);

CREATE INDEX IF NOT EXISTS idx_artists_name ON artists(name);
CREATE INDEX IF NOT EXISTS idx_albums_title ON albums(title);

CREATE INDEX IF NOT EXISTS idx_song_artists_artist ON song_artists(artist_id);
CREATE INDEX IF NOT EXISTS idx_song_genres_genre ON song_genres(genre_id);
CREATE INDEX IF NOT EXISTS idx_song_moods_mood ON song_moods(mood_id);

CREATE INDEX IF NOT EXISTS idx_song_attributes_energy ON song_attributes(energy);
CREATE INDEX IF NOT EXISTS idx_song_attributes_valence ON song_attributes(valence);
CREATE INDEX IF NOT EXISTS idx_song_attributes_tempo ON song_attributes(tempo);
CREATE INDEX IF NOT EXISTS idx_songs_ml_processed ON songs(is_ml_processed);

-- 11. RECOMMENDATION LOGS (Phase 2 & 3 ML Performance Tracking)
CREATE TABLE IF NOT EXISTS recommendation_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES search_sessions(session_id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    recommended_songs JSONB NOT NULL DEFAULT '[]'::jsonb,
    input_moods JSONB DEFAULT '[]'::jsonb,
    input_genres JSONB DEFAULT '[]'::jsonb,
    model_version VARCHAR(100),
    user_feedback VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
