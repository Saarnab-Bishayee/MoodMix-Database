/**
 * MUSIC_QUERIES — Large search query bank for populating the MoodMix database.
 * Each entry defines one YouTube search + the genre/mood/language labels to attach.
 * Add more entries here to grow the database further.
 */

const MUSIC_QUERIES = [

  // ─── BOLLYWOOD / HINDI ───────────────────────────────────────────────────
  { query: 'Hindi romantic songs 2023 official audio',       language: 'Hindi', genre: 'Bollywood',  moods: ['romantic', 'chill'],               energy: 'medium' },
  { query: 'Hindi romantic songs 2022 official video',       language: 'Hindi', genre: 'Bollywood',  moods: ['romantic', 'chill'],               energy: 'medium' },
  { query: 'Hindi sad heartbreak songs official audio',      language: 'Hindi', genre: 'Bollywood',  moods: ['sad', 'melancholic'],              energy: 'low'    },
  { query: 'Hindi sad songs 2023 acoustic cover',            language: 'Hindi', genre: 'Bollywood',  moods: ['sad', 'melancholic'],              energy: 'low'    },
  { query: 'Bollywood party songs 2023',                     language: 'Hindi', genre: 'Bollywood',  moods: ['party', 'energetic', 'happy'],     energy: 'high'   },
  { query: 'Hindi dance number item songs',                  language: 'Hindi', genre: 'Bollywood',  moods: ['party', 'energetic'],              energy: 'high'   },
  { query: 'Hindi workout gym motivation songs',             language: 'Hindi', genre: 'Bollywood',  moods: ['workout', 'energetic', 'motivational'], energy: 'high' },
  { query: 'Bollywood motivational songs Hindi',             language: 'Hindi', genre: 'Bollywood',  moods: ['motivational', 'energetic'],       energy: 'high'   },
  { query: 'Hindi peppy upbeat songs 2023',                  language: 'Hindi', genre: 'Bollywood',  moods: ['happy', 'energetic'],              energy: 'high'   },
  { query: 'Hindi devotional bhakti songs',                  language: 'Hindi', genre: 'Devotional', moods: ['calm', 'peaceful'],               energy: 'low'    },
  { query: 'Bollywood classic 90s hits',                     language: 'Hindi', genre: 'Bollywood',  moods: ['nostalgic', 'happy'],              energy: 'medium' },
  { query: 'Bollywood 80s retro songs',                      language: 'Hindi', genre: 'Bollywood',  moods: ['nostalgic', 'romantic'],           energy: 'medium' },
  { query: 'Hindi indie singer songwriter songs',            language: 'Hindi', genre: 'Indie',      moods: ['chill', 'relaxed'],               energy: 'low'    },
  { query: 'Hindi acoustic unplugged songs 2023',            language: 'Hindi', genre: 'Indie',      moods: ['calm', 'relaxed', 'chill'],       energy: 'low'    },
  { query: 'Bollywood wedding songs 2023',                   language: 'Hindi', genre: 'Bollywood',  moods: ['happy', 'romantic', 'party'],      energy: 'high'   },
  { query: 'Hindi night drive chill songs',                  language: 'Hindi', genre: 'Bollywood',  moods: ['chill', 'relaxed', 'nostalgic'],  energy: 'low'    },
  { query: 'Hindi monsoon rainy day songs',                  language: 'Hindi', genre: 'Bollywood',  moods: ['calm', 'nostalgic', 'sad'],        energy: 'low'    },

  // ─── SUFI / GHAZAL ───────────────────────────────────────────────────────
  { query: 'Sufi songs Hindi spiritual',                     language: 'Hindi', genre: 'Sufi',   moods: ['calm', 'peaceful', 'nostalgic'],  energy: 'medium' },
  { query: 'Best Sufi Qawwali songs Pakistani Indian',       language: 'Hindi', genre: 'Sufi',   moods: ['peaceful', 'nostalgic', 'sad'],   energy: 'medium' },
  { query: 'Sufi love songs Punjabi Hindi',                  language: 'Hindi', genre: 'Sufi',   moods: ['romantic', 'calm', 'nostalgic'],  energy: 'medium' },
  { query: 'Hindi Urdu ghazal songs classic',                language: 'Hindi', genre: 'Ghazal', moods: ['melancholic', 'nostalgic', 'calm'], energy: 'low'  },
  { query: 'Best ghazals Jagjit Singh',                      language: 'Hindi', genre: 'Ghazal', moods: ['nostalgic', 'sad', 'melancholic'], energy: 'low'  },

  // ─── PUNJABI ─────────────────────────────────────────────────────────────
  { query: 'Punjabi bhangra party songs 2023',               language: 'Punjabi', genre: 'Bhangra', moods: ['party', 'energetic', 'happy'],  energy: 'high'   },
  { query: 'Punjabi bhangra dance hits',                     language: 'Punjabi', genre: 'Bhangra', moods: ['party', 'energetic'],           energy: 'high'   },
  { query: 'Punjabi romantic songs 2023',                    language: 'Punjabi', genre: 'Folk',    moods: ['romantic', 'chill'],            energy: 'medium' },
  { query: 'Punjabi sad songs 2023',                         language: 'Punjabi', genre: 'Folk',    moods: ['sad', 'melancholic'],           energy: 'low'    },
  { query: 'Punjabi workout motivation songs',               language: 'Punjabi', genre: 'Bhangra', moods: ['workout', 'energetic'],         energy: 'high'   },
  { query: 'New Punjabi songs 2023 latest hits',             language: 'Punjabi', genre: 'Folk',    moods: ['happy', 'chill'],              energy: 'medium' },
  { query: 'Sidhu Moosewala Punjabi songs',                  language: 'Punjabi', genre: 'Folk',    moods: ['energetic', 'sad', 'motivational'], energy: 'high' },
  { query: 'AP Dhillon Punjabi English songs',               language: 'Punjabi', genre: 'Folk',    moods: ['romantic', 'chill'],            energy: 'medium' },

  // ─── TAMIL ───────────────────────────────────────────────────────────────
  { query: 'Tamil romantic songs official audio',            language: 'Tamil', genre: 'Folk',      moods: ['romantic', 'calm'],             energy: 'medium' },
  { query: 'Tamil sad songs 2023',                           language: 'Tamil', genre: 'Folk',      moods: ['sad', 'melancholic'],           energy: 'low'    },
  { query: 'Tamil party peppy songs',                        language: 'Tamil', genre: 'Folk',      moods: ['party', 'energetic', 'happy'],  energy: 'high'   },
  { query: 'Tamil workout gym motivation songs',             language: 'Tamil', genre: 'Folk',      moods: ['workout', 'motivational'],      energy: 'high'   },
  { query: 'AR Rahman Tamil songs',                          language: 'Tamil', genre: 'Folk',      moods: ['calm', 'romantic', 'nostalgic'], energy: 'medium' },
  { query: 'Tamil indie acoustic songs',                     language: 'Tamil', genre: 'Indie',     moods: ['chill', 'relaxed'],             energy: 'low'    },
  { query: 'Tamil classic old songs',                        language: 'Tamil', genre: 'Folk',      moods: ['nostalgic', 'romantic'],        energy: 'medium' },

  // ─── TELUGU ──────────────────────────────────────────────────────────────
  { query: 'Telugu romantic songs official audio',           language: 'Telugu', genre: 'Folk',     moods: ['romantic', 'chill'],            energy: 'medium' },
  { query: 'Telugu party dance songs 2023',                  language: 'Telugu', genre: 'Folk',     moods: ['party', 'energetic'],           energy: 'high'   },
  { query: 'Telugu sad songs heartbreak',                    language: 'Telugu', genre: 'Folk',     moods: ['sad', 'melancholic'],           energy: 'low'    },
  { query: 'Telugu mass action motivational songs',          language: 'Telugu', genre: 'Folk',     moods: ['motivational', 'energetic'],    energy: 'high'   },

  // ─── BENGALI / MARATHI / KANNADA ─────────────────────────────────────────
  { query: 'Bengali modern romantic songs 2023',             language: 'Bengali',  genre: 'Folk',   moods: ['romantic', 'nostalgic', 'calm'], energy: 'low'   },
  { query: 'Bengali Rabindra sangeet acoustic',              language: 'Bengali',  genre: 'Classical', moods: ['calm', 'peaceful', 'nostalgic'], energy: 'low' },
  { query: 'Marathi romantic songs 2023',                    language: 'Marathi',  genre: 'Folk',   moods: ['romantic', 'chill'],            energy: 'medium' },
  { query: 'Marathi party songs latest',                     language: 'Marathi',  genre: 'Folk',   moods: ['party', 'energetic', 'happy'],  energy: 'high'   },
  { query: 'Kannada romantic songs official',                language: 'Kannada',  genre: 'Folk',   moods: ['romantic', 'chill'],            energy: 'medium' },

  // ─── ENGLISH POP ─────────────────────────────────────────────────────────
  { query: 'English pop hits 2023 official audio',           language: 'English', genre: 'Pop',     moods: ['happy', 'energetic'],           energy: 'high'   },
  { query: 'English pop hits 2022 official audio',           language: 'English', genre: 'Pop',     moods: ['happy', 'chill'],              energy: 'medium' },
  { query: 'Billboard hot 100 songs 2023',                   language: 'English', genre: 'Pop',     moods: ['happy', 'energetic'],           energy: 'high'   },
  { query: 'Top 40 pop songs 2022',                          language: 'English', genre: 'Pop',     moods: ['happy', 'energetic'],           energy: 'high'   },
  { query: 'Ed Sheeran best songs',                          language: 'English', genre: 'Pop',     moods: ['romantic', 'chill', 'happy'],  energy: 'medium' },
  { query: 'Taylor Swift popular songs',                     language: 'English', genre: 'Pop',     moods: ['happy', 'sad', 'romantic'],    energy: 'medium' },
  { query: 'Dua Lipa songs official audio',                  language: 'English', genre: 'Pop',     moods: ['energetic', 'party', 'happy'], energy: 'high'   },
  { query: 'The Weeknd official songs',                      language: 'English', genre: 'R&B',     moods: ['chill', 'romantic', 'party'],  energy: 'medium' },
  { query: 'Billie Eilish sad chill songs',                  language: 'English', genre: 'Indie',   moods: ['sad', 'chill', 'melancholic'], energy: 'low'    },
  { query: 'Harry Styles official songs 2023',               language: 'English', genre: 'Pop',     moods: ['happy', 'chill', 'romantic'],  energy: 'medium' },

  // ─── ENGLISH ROCK ─────────────────────────────────────────────────────────
  { query: 'Classic rock hits 70s 80s',                      language: 'English', genre: 'Rock',    moods: ['energetic', 'nostalgic'],       energy: 'high'   },
  { query: 'Alternative rock songs indie',                   language: 'English', genre: 'Rock',    moods: ['energetic', 'chill'],           energy: 'medium' },
  { query: 'Heavy metal rock anthems',                       language: 'English', genre: 'Metal',   moods: ['angry', 'energetic', 'workout'], energy: 'high'  },
  { query: 'Linkin Park best songs',                         language: 'English', genre: 'Rock',    moods: ['angry', 'energetic', 'sad'],    energy: 'high'   },
  { query: 'Coldplay best songs official audio',             language: 'English', genre: 'Rock',    moods: ['calm', 'nostalgic', 'sad'],    energy: 'low'    },
  { query: 'Queen best songs rock classics',                 language: 'English', genre: 'Rock',    moods: ['energetic', 'nostalgic', 'happy'], energy: 'high' },
  { query: 'Imagine Dragons songs',                          language: 'English', genre: 'Rock',    moods: ['motivational', 'energetic', 'sad'], energy: 'high' },
  { query: 'Arctic Monkeys indie rock songs',                language: 'English', genre: 'Rock',    moods: ['chill', 'energetic', 'nostalgic'], energy: 'medium' },

  // ─── HIP HOP / RAP ───────────────────────────────────────────────────────
  { query: 'Hip hop rap hits 2023 official audio',           language: 'English', genre: 'Hip-Hop', moods: ['energetic', 'motivational'],    energy: 'high'   },
  { query: 'Hip hop rap playlist 2022',                      language: 'English', genre: 'Hip-Hop', moods: ['energetic', 'party'],           energy: 'high'   },
  { query: 'Drake best songs official',                      language: 'English', genre: 'Hip-Hop', moods: ['chill', 'party', 'romantic'],  energy: 'medium' },
  { query: 'Kendrick Lamar songs official',                  language: 'English', genre: 'Hip-Hop', moods: ['angry', 'motivational'],        energy: 'high'   },
  { query: 'Eminem motivational rap songs',                  language: 'English', genre: 'Hip-Hop', moods: ['motivational', 'angry', 'energetic'], energy: 'high' },
  { query: 'Chill rap trap songs 2023',                      language: 'English', genre: 'Hip-Hop', moods: ['chill', 'relaxed'],             energy: 'low'    },
  { query: 'Indian Hindi rap gully boy',                     language: 'Hindi',   genre: 'Hip-Hop', moods: ['energetic', 'motivational'],    energy: 'high'   },

  // ─── R&B / SOUL ──────────────────────────────────────────────────────────
  { query: 'Soulful R&B love songs 2023',                    language: 'English', genre: 'R&B',     moods: ['romantic', 'chill'],            energy: 'medium' },
  { query: 'Neo soul R&B chill tracks',                      language: 'English', genre: 'R&B',     moods: ['chill', 'romantic'],            energy: 'low'    },
  { query: 'Beyonce official songs R&B',                     language: 'English', genre: 'R&B',     moods: ['energetic', 'romantic', 'party'], energy: 'high'  },
  { query: 'Frank Ocean chill R&B songs',                    language: 'English', genre: 'R&B',     moods: ['chill', 'sad', 'romantic'],    energy: 'low'    },

  // ─── ELECTRONIC / EDM ────────────────────────────────────────────────────
  { query: 'EDM electronic dance music hits 2023',           language: 'English', genre: 'Electronic', moods: ['party', 'energetic'],        energy: 'high'   },
  { query: 'House music deep house tracks',                  language: 'Instrumental', genre: 'Electronic', moods: ['party', 'energetic', 'chill'], energy: 'high' },
  { query: 'David Guetta EDM songs',                         language: 'English', genre: 'Electronic', moods: ['party', 'energetic'],        energy: 'high'   },
  { query: 'Martin Garrix electronic songs',                 language: 'English', genre: 'Electronic', moods: ['energetic', 'workout'],      energy: 'high'   },
  { query: 'Workout EDM electronic gym motivation',          language: 'English', genre: 'Electronic', moods: ['workout', 'energetic', 'motivational'], energy: 'high' },
  { query: 'Tropical house chill electronic songs',          language: 'Instrumental', genre: 'Electronic', moods: ['chill', 'happy', 'relaxed'], energy: 'medium' },
  { query: 'Trance music energetic songs',                   language: 'Instrumental', genre: 'Electronic', moods: ['energetic', 'focus'],   energy: 'high'   },
  { query: 'Synthwave retrowave electronic',                 language: 'Instrumental', genre: 'Electronic', moods: ['nostalgic', 'chill'],   energy: 'medium' },

  // ─── LO-FI / AMBIENT / FOCUS ─────────────────────────────────────────────
  { query: 'Lofi hip hop beats to study relax to',           language: 'Instrumental', genre: 'Lo-fi',   moods: ['focus', 'calm', 'relaxed'],  energy: 'low'   },
  { query: 'Lofi chill beats 2023',                          language: 'Instrumental', genre: 'Lo-fi',   moods: ['focus', 'chill'],            energy: 'low'   },
  { query: 'Lofi hip hop sleep music',                       language: 'Instrumental', genre: 'Lo-fi',   moods: ['sleep', 'calm'],             energy: 'low'   },
  { query: 'Lofi jazz coffee shop music',                    language: 'Instrumental', genre: 'Lo-fi',   moods: ['chill', 'focus', 'calm'],    energy: 'low'   },
  { query: 'Ambient study focus music instrumental',         language: 'Instrumental', genre: 'Ambient', moods: ['focus', 'calm'],             energy: 'low'   },
  { query: 'Deep focus work concentration music',            language: 'Instrumental', genre: 'Ambient', moods: ['focus', 'calm'],             energy: 'low'   },
  { query: 'Sleep music relaxing ambient sounds',            language: 'Instrumental', genre: 'Ambient', moods: ['sleep', 'calm', 'relaxed'],  energy: 'low'   },
  { query: 'Meditation music peaceful zen',                  language: 'Instrumental', genre: 'Ambient', moods: ['calm', 'peaceful'],          energy: 'low'   },
  { query: 'Nature sounds rain white noise sleep',           language: 'Instrumental', genre: 'Ambient', moods: ['sleep', 'calm', 'relaxed'],  energy: 'low'   },

  // ─── CLASSICAL / JAZZ / INSTRUMENTAL ─────────────────────────────────────
  { query: 'Peaceful classical piano music',                 language: 'Instrumental', genre: 'Classical', moods: ['calm', 'relaxed', 'focus'], energy: 'low' },
  { query: 'Classical music relaxation Beethoven Bach',      language: 'Instrumental', genre: 'Classical', moods: ['calm', 'focus', 'peaceful'], energy: 'low' },
  { query: 'Classical violin music beautiful',               language: 'Instrumental', genre: 'Classical', moods: ['calm', 'nostalgic', 'sad'], energy: 'low' },
  { query: 'Jazz music smooth late night',                   language: 'Instrumental', genre: 'Jazz',      moods: ['chill', 'relaxed'],         energy: 'low' },
  { query: 'Smooth jazz coffee house music',                 language: 'Instrumental', genre: 'Jazz',      moods: ['chill', 'focus'],           energy: 'low' },
  { query: 'Instrumental guitar music acoustic',             language: 'Instrumental', genre: 'Indie',     moods: ['calm', 'chill', 'relaxed'], energy: 'low' },

  // ─── INDIE / ALTERNATIVE ─────────────────────────────────────────────────
  { query: 'Indie pop songs 2023 official',                  language: 'English', genre: 'Indie',   moods: ['chill', 'happy', 'relaxed'],    energy: 'medium' },
  { query: 'Indie folk acoustic songs',                      language: 'English', genre: 'Indie',   moods: ['calm', 'nostalgic', 'relaxed'], energy: 'low'    },
  { query: 'Hindi indie singer songwriter songs 2023',       language: 'Hindi',   genre: 'Indie',   moods: ['chill', 'romantic', 'sad'],     energy: 'low'    },
  { query: 'Indie sad songs heartbreak',                     language: 'English', genre: 'Indie',   moods: ['sad', 'melancholic'],           energy: 'low'    },

  // ─── COUNTRY / REGGAE ────────────────────────────────────────────────────
  { query: 'Country music songs 2023 hits',                  language: 'English', genre: 'Country', moods: ['happy', 'nostalgic', 'relaxed'], energy: 'medium' },
  { query: 'Reggae songs Bob Marley chill',                  language: 'English', genre: 'Reggae',  moods: ['chill', 'happy', 'relaxed'],    energy: 'low'    },

  // ─── WORKOUT / MOTIVATIONAL ───────────────────────────────────────────────
  { query: 'Best workout songs gym motivation 2023',         language: 'English', genre: 'Pop',      moods: ['workout', 'energetic', 'motivational'], energy: 'high' },
  { query: 'Running songs high energy workout',              language: 'English', genre: 'Electronic', moods: ['workout', 'energetic'],      energy: 'high'   },
  { query: 'Motivational songs life inspiration',            language: 'English', genre: 'Pop',      moods: ['motivational', 'energetic'],    energy: 'high'   },
  { query: 'Hindi Punjabi workout gym songs',                language: 'Hindi',   genre: 'Bollywood', moods: ['workout', 'energetic'],        energy: 'high'   },

  // ─── PARTY / DANCE ────────────────────────────────────────────────────────
  { query: 'Party songs dance hits 2023',                    language: 'English', genre: 'Pop',      moods: ['party', 'energetic', 'happy'], energy: 'high'   },
  { query: 'Club dance songs 2023 DJ mix',                   language: 'English', genre: 'Electronic', moods: ['party', 'energetic'],        energy: 'high'   },
  { query: 'Bollywood party songs DJ remix',                 language: 'Hindi',   genre: 'Bollywood', moods: ['party', 'energetic'],         energy: 'high'   },

  // ─── SLEEP / CALM ─────────────────────────────────────────────────────────
  { query: 'Calm relaxing songs before sleep',               language: 'Instrumental', genre: 'Ambient', moods: ['sleep', 'calm', 'relaxed'], energy: 'low'  },
  { query: 'Soft Hindi songs for night sleep',               language: 'Hindi',   genre: 'Bollywood', moods: ['sleep', 'calm', 'sad'],       energy: 'low'   },
  { query: 'Lullaby soft music baby sleep',                  language: 'Instrumental', genre: 'Classical', moods: ['sleep', 'calm'],          energy: 'low'  },

  // ─── NOSTALGIC / RETRO ───────────────────────────────────────────────────
  { query: 'Nostalgic 90s English pop songs',                language: 'English', genre: 'Pop',      moods: ['nostalgic', 'happy'],           energy: 'medium' },
  { query: '90s Bollywood hit songs',                        language: 'Hindi',   genre: 'Bollywood', moods: ['nostalgic', 'romantic', 'happy'], energy: 'medium' },
  { query: '80s retro pop hit songs',                        language: 'English', genre: 'Pop',      moods: ['nostalgic', 'energetic'],       energy: 'high'   },
  { query: 'Old Hindi classic film songs',                   language: 'Hindi',   genre: 'Bollywood', moods: ['nostalgic', 'romantic', 'sad'], energy: 'low'   },
];

module.exports = { MUSIC_QUERIES };
