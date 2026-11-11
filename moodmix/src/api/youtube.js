const axios = require('axios');
const logger = require('../utils/logger');
const { sleep, retryWithBackoff } = require('../utils/rateLimiter');

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';

class YouTubeAPI {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.YOUTUBE_API_KEY;
    if (!this.apiKey || this.apiKey === 'your_youtube_api_key_here') {
      throw new Error('YOUTUBE_API_KEY is not configured in .env file.');
    }
  }

  /**
   * Search YouTube for videos with pagination support.
   */
  async searchVideos({ query, maxResults = 50, pageToken = null }) {
    return retryWithBackoff(async () => {
      const params = {
        key: this.apiKey,
        q: query,
        part: 'id',
        type: 'video',
        videoCategoryId: '10', // Music Category
        videoEmbeddable: 'true',
        videoSyndicated: 'true',
        maxResults: Math.min(maxResults, 50),
      };

      if (pageToken) {
        params.pageToken = pageToken;
      }

      const response = await axios.get(YOUTUBE_SEARCH_URL, { params });
      const videoIds = (response.data.items || [])
        .map((item) => item.id?.videoId)
        .filter(Boolean);

      return {
        videoIds,
        nextPageToken: response.data.nextPageToken || null,
        totalResults: response.data.pageInfo?.totalResults || 0,
      };
    });
  }

  /**
   * Fetch detailed metadata (snippet, contentDetails, statistics) for video IDs in batches of 50.
   */
  async getVideoDetails(videoIds) {
    if (!videoIds || videoIds.length === 0) return [];

    const items = [];
    const batchSize = 50;

    for (let i = 0; i < videoIds.length; i += batchSize) {
      const batch = videoIds.slice(i, i + batchSize);

      const batchItems = await retryWithBackoff(async () => {
        const response = await axios.get(YOUTUBE_VIDEOS_URL, {
          params: {
            key: this.apiKey,
            id: batch.join(','),
            part: 'snippet,contentDetails,statistics',
          },
        });
        return response.data.items || [];
      });

      items.push(...batchItems);

      // Throttling delay between batches
      const delay = Number(process.env.REQUEST_DELAY_MS) || 150;
      await sleep(delay);
    }

    return items;
  }
}

module.exports = YouTubeAPI;

