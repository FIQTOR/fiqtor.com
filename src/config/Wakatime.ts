/**
 * Configuration for the WakaTime integration.
 *
 * Only PUBLIC, non-secret values live here (the username shown in links).
 * The WakaTime API key is a SECRET and lives on the backend
 * (`backend/.env` → `WAKATIME_APP_SECRET`). The frontend fetches stats from
 * our own backend endpoint (`/api/v1/wakatime`) — never directly from WakaTime.
 */
const WakatimeConfig = {
  username: "FIQTOR",
};

export default WakatimeConfig;
