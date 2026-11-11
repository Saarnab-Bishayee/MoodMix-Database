/**
 * Mood Classification Engine.
 *
 * Infers and classifies multiple moods for a song based on:
 * 1. Explicit query/source context (confidence: 1.0, source: 'source_tag')
 * 2. Keyword signals in song title / description (confidence: 0.85, source: 'keyword_signal')
 * 3. Audio characteristics (energy, valence, tempo) when available (confidence: 0.90, source: 'audio_feature')
 */

const KEYWORD_RULES = [
  { mood: 'happy', keywords: ['happy', 'khushi', 'joy', 'smile', 'celebrate', 'cheerful'] },
  { mood: 'sad', keywords: ['sad', 'dard', 'alone', 'broken', 'cry', 'tears', 'heartbreak'] },
  { mood: 'romantic', keywords: ['love', 'romantic', 'ishq', 'pyar', 'mohabbat', 'dil', 'heart', 'baby'] },
  { mood: 'workout', keywords: ['workout', 'gym', 'fitness', 'training', 'power', 'pump', 'beast'] },
  { mood: 'party', keywords: ['party', 'dance', 'club', 'dj', 'nach', 'bhangra', 'sharab'] },
  { mood: 'chill', keywords: ['chill', 'relax', 'evening', 'acoustic', 'unplugged', 'mellow'] },
  { mood: 'focus', keywords: ['study', 'focus', 'lofi', 'lo-fi', 'reading', 'instrumental', 'work', 'peaceful'] },
  { mood: 'melancholic', keywords: ['melancholy', 'judai', 'tanhai', 'yaad', 'miss you', 'nostalgia'] },
  { mood: 'motivational', keywords: ['motivation', 'win', 'unstoppable', 'hustle', 'fateh', 'champion', 'rise'] },
  { mood: 'sleep', keywords: ['sleep', 'deep sleep', 'lullaby', 'slumber', 'night sleep'] },
  { mood: 'calm', keywords: ['calm', 'soothing', 'breeze', 'serene', 'tranquil', 'meditation'] },
];

function classifyMoods(trackData, audioAttributes = null) {
  const detectedMoods = new Map();

  // 1. Direct mood tags from search query context
  if (Array.isArray(trackData.moods)) {
    trackData.moods.forEach((m) => {
      const slug = m.toLowerCase().trim();
      detectedMoods.set(slug, {
        slug,
        confidence: 1.0,
        source: 'source_tag',
      });
    });
  }

  // 2. Keyword classification from title
  const textToScan = `${trackData.title} ${trackData.rawMetadata?.query || ''}`.toLowerCase();
  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((kw) => textToScan.includes(kw))) {
      if (!detectedMoods.has(rule.mood)) {
        detectedMoods.set(rule.mood, {
          slug: rule.mood,
          confidence: 0.85,
          source: 'keyword_signal',
        });
      }
    }
  }

  // 3. Audio attribute-based inference (when available)
  if (audioAttributes) {
    const { energy, valence, acousticness, danceability } = audioAttributes;

    if (energy !== null && valence !== null) {
      if (energy > 0.7 && valence > 0.6) {
        detectedMoods.set('happy', { slug: 'happy', confidence: 0.90, source: 'audio_feature' });
        detectedMoods.set('energetic', { slug: 'energetic', confidence: 0.95, source: 'audio_feature' });
      }
      if (energy < 0.4 && valence < 0.4) {
        detectedMoods.set('sad', { slug: 'sad', confidence: 0.90, source: 'audio_feature' });
        detectedMoods.set('melancholic', { slug: 'melancholic', confidence: 0.85, source: 'audio_feature' });
      }
    }

    if (energy !== null && energy < 0.4 && acousticness !== null && acousticness > 0.6) {
      detectedMoods.set('calm', { slug: 'calm', confidence: 0.90, source: 'audio_feature' });
      detectedMoods.set('relaxed', { slug: 'relaxed', confidence: 0.85, source: 'audio_feature' });
    }

    if (danceability !== null && danceability > 0.75 && energy !== null && energy > 0.7) {
      detectedMoods.set('party', { slug: 'party', confidence: 0.92, source: 'audio_feature' });
    }
  }

  // Energy tier fallback
  if (trackData.energy === 'high') {
    if (!detectedMoods.has('energetic')) {
      detectedMoods.set('energetic', { slug: 'energetic', confidence: 0.80, source: 'energy_tier' });
    }
  } else if (trackData.energy === 'low') {
    if (!detectedMoods.has('chill') && !detectedMoods.has('calm')) {
      detectedMoods.set('chill', { slug: 'chill', confidence: 0.80, source: 'energy_tier' });
    }
  }

  return Array.from(detectedMoods.values());
}

module.exports = {
  classifyMoods,
};

