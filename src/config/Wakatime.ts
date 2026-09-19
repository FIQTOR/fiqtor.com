/**
 * Configuration object for WakaTime API integration
 * @typedef {Object} WakatimeConfig
 * @property {string} username - The WakaTime username from environment variables
 */
const WakatimeConfig = {
  username: import.meta.env.VITE_WAKATIME_USERNAME,
};

export default WakatimeConfig;
