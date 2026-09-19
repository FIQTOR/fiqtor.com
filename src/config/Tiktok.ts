/**
 * Configuration object for TikTok API integration
 * @property {string} username - TikTok account username from environment variables
 * @property {string} apiKey - TikTok API key from environment variables
 */
const TiktokConfig = {
  username: import.meta.env.VITE_TIKTOK_USERNAME,
  apiKey: import.meta.env.VITE_TIKTOK_API_KEY,
};

export default TiktokConfig;
