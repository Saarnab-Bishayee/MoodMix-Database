-- Seed Standard Music Genres

INSERT INTO genres (name, slug, description) VALUES
    ('Pop', 'pop', 'Popular commercial mainstream music with catchy melodies and hooks'),
    ('Bollywood', 'bollywood', 'Indian film soundtrack music spanning varied styles'),
    ('Rock', 'rock', 'Guitar-driven rock music from classic to alternative'),
    ('Hip-Hop', 'hip-hop', 'Rhythmic stylized music with rhyming speech and beats'),
    ('Rap', 'rap', 'Vocal delivery emphasizing rhyme, wordplay, and flow'),
    ('R&B', 'r-and-b', 'Rhythm and Blues with soulful vocals and smooth production'),
    ('Jazz', 'jazz', 'Complex harmony, syncopated rhythms, and improvisation'),
    ('Classical', 'classical', 'Western and Indian classical art music traditions'),
    ('Electronic', 'electronic', 'Music produced primarily with electronic equipment and synthesizers'),
    ('EDM', 'edm', 'High-energy electronic dance music for clubs and festivals'),
    ('Lo-fi', 'lo-fi', 'Low-fidelity aesthetic beats for relaxation and studying'),
    ('Indie', 'indie', 'Independent and non-mainstream creative music'),
    ('Metal', 'metal', 'Heavy metal with distorted guitars and aggressive rhythms'),
    ('Country', 'country', 'Folk and roots music originating from American traditions'),
    ('Reggae', 'reggae', 'Jamaican music style with offbeat rhythm accents'),
    ('Bhangra', 'bhangra', 'High-energy Punjabi folk and dance music with dhol beats'),
    ('Sufi', 'sufi', 'Mystical, soulful devotional poetry and spiritual music'),
    ('Ghazal', 'ghazal', 'Poetic musical form expressing love, beauty, and loss'),
    ('Devotional', 'devotional', 'Sacred and spiritual hymns and bhajans'),
    ('Instrumental', 'instrumental', 'Music performed purely by instruments without vocal tracks'),
    ('Ambient', 'ambient', 'Atmospheric and textural soundscapes designed for focus and calm'),
    ('Folk', 'folk', 'Traditional regional acoustic cultural music'),
    ('Synthpop', 'synthpop', 'Electronic pop dominated by synthesizers and retro beats')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description;

