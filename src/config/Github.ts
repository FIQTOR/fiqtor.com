/**
 * Configuration object for GitHub API integration
 * @property {string} username - GitHub username from environment variables
 */
const GithubConfig = {
  username: import.meta.env.VITE_GITHUB_USERNAME,
};

export default GithubConfig;
