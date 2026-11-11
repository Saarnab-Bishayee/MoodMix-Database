# MoodMix Project Root

The complete MoodMix PostgreSQL database and YouTube API implementation is located in [`moodmix-backend/`](moodmix-backend/):

```bash
cd moodmix-backend
```

### Quick Commands:
```bash
# 1. Verify Database
python moodmix-backend/scripts/verify_database.py

# 2. Run API Server
cd moodmix-backend
uvicorn app.main:app --reload

# 3. Populate YouTube Songs (Requires YOUTUBE_API_KEY in .env)
python moodmix-backend/scripts/populate_youtube.py
```

For full architecture details, table schemas, and deployment instructions, see [moodmix-backend/README.md](moodmix-backend/README.md).

