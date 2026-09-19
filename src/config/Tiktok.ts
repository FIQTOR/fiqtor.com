/**
 * Configuration for the TikTok integration.
 *
 * ⚠️ SECURITY: any TikTok/RapidAPI key is a SECRET and must NEVER be shipped
 * in the frontend bundle. This project fetches follower stats from our own
 * backend (`/api/v1/social/stats`) which serves hand-maintained static data —
 * no third-party API key on the client.
 *
 * Only the PUBLIC username is kept here (for profile links).
 */
const TiktokConfig = {
  username: "fiqtor",
};

export default TiktokConfig;
