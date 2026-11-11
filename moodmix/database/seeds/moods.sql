-- Seed Standard Music Moods

INSERT INTO moods (name, slug, category, description) VALUES
    ('Happy', 'happy', 'emotion', 'Cheerful, joyful, upbeat, and smiling feelings'),
    ('Sad', 'sad', 'emotion', 'Heartbroken, somber, tearful, and blue feelings'),
    ('Calm', 'calm', 'energy', 'Peaceful, gentle, serene, and undisturbed sounds'),
    ('Relaxed', 'relaxed', 'energy', 'Laid-back, easygoing, and tension-releasing music'),
    ('Energetic', 'energetic', 'energy', 'High-tempo, driving, pumped up, and stimulating beats'),
    ('Romantic', 'romantic', 'emotion', 'Love songs, warmth, intimacy, and heartfelt melodies'),
    ('Angry', 'angry', 'emotion', 'Aggressive, intense, rebellious, and heavy distortion'),
    ('Motivational', 'motivational', 'activity', 'Empowering, inspiring, triumph, and gym-ready focus'),
    ('Melancholic', 'melancholic', 'emotion', 'Pensive sadness with nostalgic or philosophical depth'),
    ('Focus', 'focus', 'activity', 'Background concentration, flow state, and study music'),
    ('Sleep', 'sleep', 'activity', 'Drifting, dreamlike, ambient sounds for rest'),
    ('Party', 'party', 'activity', 'Celebratory, dancing, clubbing, and social vibe'),
    ('Workout', 'workout', 'activity', 'Repetitive heavy bass and high BPM for athletic training'),
    ('Chill', 'chill', 'energy', 'Mellow lounging, weekend afternoon, and coffee shop vibe'),
    ('Nostalgic', 'nostalgic', 'emotion', 'Fond memories, golden era classics, and retro sentiment')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description;

