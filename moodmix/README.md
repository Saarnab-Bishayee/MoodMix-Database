# MoodMix — Music Database

A self-contained **PostgreSQL music database** that fetches song metadata from YouTube
and stores it, tagged by **mood, genre, and audio attributes**.
No frontend. No server. Data only.

---

## What it stores

| Table | What it holds |
|---|---|
| `songs` | Title, duration, YouTube URL/ID, language, popularity |
| `artists` | Artist name, YouTube channel ID |
| `albums` | Album/single title, cover image |
| `genres` | Genre reference list (23 genres) |
| `moods` | Mood reference list (15 moods) |
| `song_artists` | Many-to-many: song ↔ artist |
| `song_genres` | Many-to-many: song ↔ genre |
| `song_moods` | Many-to-many: song ↔ mood, with confidence score |
| `song_attributes` | energy, valence, danceability, tempo, etc. |

---

## Setup (one time only)

### 1. Prerequisites

- **PostgreSQL 18** already installed at `C:\Program Files\PostgreSQL\18`
- **Node.js 18+** installed
- A **YouTube Data API v3 key**

### 2. Configure environment

Edit `moodmix/.env`:

```env
DATABASE_URL=postgresql://postgres:password@127.0.0.1:5433/moodmix
YOUTUBE_API_KEY=your_key_here
SONG_LIMIT=5000
BATCH_SIZE=50
REQUEST_DELAY_MS=200
LOG_LEVEL=info
```

### 3. Install dependencies

```
cd moodmix
npm install
```

### 4. Start PostgreSQL

Double-click `start_db.bat` in the project root **OR** run from terminal:

```
start_db.bat
```

> PostgreSQL runs on port **5433**. Leave the terminal open (or it runs in background).

### 5. Create the schema

```
cd moodmix
npm run migrate
```

### 6. Seed genres & moods

```
npm run seed
```

---

## Daily usage — Populating the database

### Ingest songs (all queries, up to SONG_LIMIT)

```
cd moodmix
npm run ingest
```

### Ingest a custom amount

```
npm run ingest -- --limit=500
```

### Ingest for a specific mood/genre/language

```
npm run ingest -- --query="Hindi workout"
npm run ingest -- --query="lofi study"
npm run ingest -- --query="Punjabi party"
npm run ingest -- --query="English sad"
```

> You can run this repeatedly. It is fully **idempotent** — running it again only
> updates existing songs and adds new ones. No duplicates.

### Check what's in the database

```
npm run verify
```

---

## How mood & genre tagging works

Each search query in `src/config/queries.js` is pre-labelled with a genre and mood list.
When a song is fetched from YouTube:

1. **Genre** is taken from the query label → stored in `song_genres`.
2. **Moods** are assigned by a rule engine (`src/mood/classifier.js`) that looks at:
   - Query labels (e.g., the query says `workout`)
   - Song title keywords (e.g., "sad", "party", "gym")
   - Energy level from the query (`high` / `medium` / `low`)
3. **Attributes** (energy score) are stored in `song_attributes`.

---

## Growing the database

To add more songs, open `moodmix/src/config/queries.js` and add entries:

```js
{
  query: 'Tamil workout songs 2023',  // YouTube search term
  language: 'Tamil',
  genre: 'Folk',
  moods: ['workout', 'energetic'],
  energy: 'high',
},
```

Then run `npm run ingest` again.

---

## Project layout

```
moodmix/                       ← THE only folder that matters
├── database/
│   ├── schema.sql             ← All table definitions
│   └── seeds/
│       ├── genres.sql         ← 23 genre rows
│       └── moods.sql          ← 15 mood rows
├── src/
│   ├── api/youtube.js         ← YouTube Data API calls
│   ├── config/
│   │   ├── database.js        ← PostgreSQL connection pool
│   │   └── queries.js         ← 100+ search queries (add more here)
│   ├── db/repositories.js     ← All database insert/upsert logic
│   ├── ingestion/pipeline.js  ← Main ingestion loop
│   ├── mood/classifier.js     ← Mood tagging rules
│   ├── normalization/
│   │   ├── duration.js        ← Parse ISO 8601 duration
│   │   └── track.js           ← Normalize raw YouTube data
│   └── utils/
│       ├── logger.js
│       └── rateLimiter.js     ← Delay + retry logic
├── scripts/
│   ├── migrate.js             ← npm run migrate
│   ├── seed.js                ← npm run seed
│   ├── ingest.js              ← npm run ingest
│   └── verify.js              ← npm run verify
└── .env                       ← Your API keys and DB URL
```

---

## Commands at a glance

| Command | What it does |
|---|---|
| `npm run migrate` | Create all tables in PostgreSQL |
| `npm run seed` | Insert the 23 genres and 15 moods |
| `npm run ingest` | Fetch & store songs (uses SONG_LIMIT from .env) |
| `npm run ingest -- --limit=200` | Fetch up to 200 songs |
| `npm run ingest -- --query="lofi"` | Only run queries matching "lofi" |
| `npm run verify` | Print table counts and integrity checks |

