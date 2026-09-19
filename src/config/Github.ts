/**
 * Configuration for the GitHub integration.
 *
 * Only the PUBLIC username is needed on the client (used to build profile
 * links). Access tokens are SECRETS and must live on the backend
 * (`backend/.env` → `GITHUB_TOKEN`). The contribution graph is fetched from
 * our own backend endpoint (`/api/v1/github/contributions`).
 */
const GithubConfig = {
  username: "FIQTOR",
};

export default GithubConfig;
