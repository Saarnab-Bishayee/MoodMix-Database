# 🎵 Mgithub
oodMix Music Database — Complete Walkthrough & Guide

This walkthrough covers everything you need to run, populate, browse, and manage the **MoodMix PostgreSQL Music Database**.

> **Project Goal**: Build and maintain a large, normalized PostgreSQL database populated with as many real songs as possible, tagged by **Moods**, **Genres**, and **Audio Attributes**. No frontend or recommendation UI is required at this stage.

---

## ⚡ Quick Command Reference

All commands can be run directly from the project root (`C:\Users\KIIT0001\OneDrive\Desktop\projects\Mooddatabase`):

| Action | CLI Command (`moodmix`) | NPM Alternative (`npm run`) |
|---|---|---|
| **Start Database** | `moodmix start` *(or double-click `start_db.bat`)* | `npm run start-db` |
| **Stop Database** | `moodmix stop` *(or `stop_db.bat`)* | `npm run stop-db` |
| **Setup Tables** | `moodmix migrate` | `npm run migrate` |
| **Seed Genres & Moods** | `moodmix seed` | `npm run seed` |
| **Ingest Songs (Default Limit)** | `moodmix ingest` | `npm run ingest` |
| **Ingest Custom Quantity** | `moodmix ingest 500` | `npm run ingest -- --limit=500` |
| **Ingest Specific Query** | `moodmix ingest 30 "Hindi workout"` | `npm run ingest -- --limit=30 --query="Hindi workout"` |
| **Ingest Specific Genre/Mood** | `moodmix ingest 50 lofi` | `npm run ingest -- --limit=50 --query="lofi"` |
| **Check / Verify Health** | `moodmix check` *(or `moodmix verify`)* | `npm run verify` |
| **Open SQL Terminal** | `moodmix psql` | *(opens psql on port 5433)* |
| **Browse in Web UI** | `moodmix prisma` | `npm run prisma` *(http://localhost:5555)* |
| **Help Menu** | `moodmix help` | — |

*(In PowerShell, prefix with `.\` if needed: `.\moodmix check`)*

---

## 📂 The 39 Categories (23 Genres + 16 Moods)

Every song is normalized and categorized across **two relational taxonomies**:

### 🎸 23 Music Genres (Stored in `genres`)
1. **Pop** – Mainstream hooks and vocals
2. **Bollywood** – Indian film soundtrack music
3. **Rock** – Classic, alternative, and hard rock
4. **Hip-Hop** – Rhythmic speech and beats
5. **Rap** – Wordplay, flow, and delivery
6. **R&B** – Soulful vocals and smooth rhythm
7. **Jazz** – Improvisation and complex harmony
8. **Classical** – Western & Indian classical art music
9. **Electronic** – Synthesizers and digital production
10. **EDM** – High-energy festival & club dance beats
11. **Lo-fi** – Chill, aesthetic beats for studying & relaxing
12. **Indie** – Independent acoustic & alternative
13. **Metal** – Heavy distorted guitars and drums
14. **Country** – Acoustic folk & American roots
15. **Reggae** – Jamaican offbeat rhythm grooves
16. **Bhangra** – Energetic Punjabi dhol-based dance tracks
17. **Sufi** – Spiritual devotional poetry & mystical songs
18. **Ghazal** – Poetic expressions of romance and longing
19. **Devotional** – Sacred hymns, chants, and bhajans
20. **Instrumental** – Non-vocal music compositions
21. **Ambient** – Atmospheric soundscapes for sleep & focus
22. **Folk** – Traditional regional and cultural songs
23. **Synthpop** – Retro 80s-inspired synthesizer pop

### 😊 16 Mood Classifications (Stored in `moods`)
1. **Happy** – Upbeat, bright, positive vibes
2. **Sad** – Heartbreak, sorrow, emotional depth
3. **Calm** – Peaceful background, unwinding
4. **Relaxed** – Slow-paced, stress-relieving
5. **Energetic** – High-octane, upbeat energy
6. **Romantic** – Love songs, intimacy, affection
7. **Angry** – Aggressive, intense, rebellious
8. **Motivational** – Inspiring, triumphant, confidence
9. **Melancholic** – Reflective sadness, nostalgia
10. **Focus** – Instrumental, concentration, study
11. **Sleep** – Soft, ambient, drift off
12. **Party** – Club, celebration, dancing
13. **Workout** – Gym motivation, running, power
14. **Chill** – Laid-back, easy-listening
15. **Nostalgic** – Retro memories, golden eras
16. **Peaceful** – Meditation, serenity, spiritual zen

---

## 🚀 Step-by-Step Walkthrough

### Step 1: Start the PostgreSQL Database
Before running any script, ensure PostgreSQL is started on port `5433`:

```cmd
moodmix start
```
*Or double-click `start_db.bat` in File Explorer.*

> **Note**: If you see `ECONNREFUSED 127.0.0.1:5433`, it means PostgreSQL is not yet running. Simply run `moodmix start`.

---

### Step 2: Initialize Database Schema (One-Time)
Creates all 10 normalized tables with primary keys, foreign keys, unique constraints, and indexes:

```cmd
moodmix migrate
```

---

### Step 3: Seed Genres & Moods (One-Time)
Inserts the standard 23 genres and 16 moods:

```cmd
moodmix seed
```

---

### Step 4: Ingest Music from YouTube
The ingestion pipeline fetches YouTube video metadata, normalizes it, eliminates duplicates, tags genres and moods, and populates the database.

#### Ingest a batch of 500 songs:
```cmd
moodmix ingest 500
```
*(Or via npm: `npm run ingest -- --limit=500`)*

#### Ingest a specific query / mood:
```cmd
moodmix ingest 30 "Hindi workout"
```

#### Ingest Lo-fi study songs:
```cmd
moodmix ingest 50 lofi
```

#### Ingest Punjabi Party songs:
```cmd
moodmix ingest 50 "Punjabi party"
```

> **Idempotent & Duplicate-Safe**: You can run ingestion as many times as you like. Existing songs are automatically updated without creating duplicate entries (`ON CONFLICT (youtube_video_id) DO UPDATE`).

---

### Step 5: Verify Database Statistics & Health
Prints table row counts, duplicate checks, and sample relational queries:

```cmd
moodmix check
```
*(Or `moodmix verify` / `npm run verify`)*

You will see:
- Total count of songs, artists, albums, genres, moods
- Many-to-many relationship links (`song_artists`, `song_genres`, `song_moods`, `song_attributes`)
- Sample join showing songs with their associated artists and mood tags

---

### Step 6: Query & Browse Data

#### Option A: Interactive SQL Terminal (`psql`)
```cmd
moodmix psql
```
*(Password: `password`)*

Helpful SQL queries:
```sql
-- Count total songs:
SELECT count(*) FROM songs;

-- View songs with their assigned moods:
SELECT s.title, a.name AS artist, array_agg(m.name) AS moods
FROM songs s
LEFT JOIN song_artists sa ON s.song_id = sa.song_id AND sa.position = 1
LEFT JOIN artists a ON sa.artist_id = a.artist_id
JOIN song_moods sm ON s.song_id = sm.song_id
JOIN moods m ON sm.mood_id = m.mood_id
GROUP BY s.id, s.title, a.name
LIMIT 10;

-- Exit psql:
\q
```

#### Option B: Web UI (Prisma Studio)
```cmd
moodmix prisma
```
👉 Opens **[http://localhost:5555](http://localhost:5555)** in your browser where you can click through every table, edit rows, and view YouTube links visually.

---

## 🗄️ Database Architecture

The normalized schema lives in [`moodmix/database/schema.sql`](file:///c:/Users/KIIT0001/OneDrive/Desktop/projects/Mooddatabase/moodmix/database/schema.sql):

```text
artists ──< artist_albums >── albums
   │                            │
   │                            └── songs (unique youtube_video_id)
   │                                  │
   └──< song_artists >────────────────┤
                                      ├──< song_genres >──── genres (23)
                                      ├──< song_moods >───── moods (16)
                                      └──  song_attributes (energy, valence, tempo, etc.)
```

---

## 🔧 Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `connect ECONNREFUSED 127.0.0.1:5433` | PostgreSQL server is stopped. | Run `moodmix start` or double-click `start_db.bat`. |
| `npm error Missing script: "ingest"` | Command run without specifying script in root. | Run `npm run ingest` or use `moodmix ingest`. |
| `duplicate key value violates unique constraint` | Resolved in pipeline update. | Already patched with `ON CONFLICT` and duplicate channel lookup. |

