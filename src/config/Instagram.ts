/**
 * Configuration for the Instagram integration.
 *
 * ⚠️ SECURITY: Instagram long-lived access tokens are SECRETS. They must NEVER
 * live in the frontend bundle (`VITE_*` vars are public). This project fetches
 * follower stats from our own backend (`/api/v1/social/stats`) which serves
 * hand-maintained static data — no Instagram API key on the client.
 *
 * Only the PUBLIC username is kept here (for profile links).
 */
const InstagramConfig = {
  username: "fiqtorr",
};

export default InstagramConfig;
