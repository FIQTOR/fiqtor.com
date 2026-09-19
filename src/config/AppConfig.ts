/**
 * Application configuration object
 * @property {string} exTitle - Title suffix that will be appended to page titles
 */
import { BRAND_NAME } from "@/config/Identity";

const AppConfig = {
  exTitle: `| 👋${BRAND_NAME}`,
  env: location.hostname === "localhost" ? "development" : "production",
};

export default AppConfig;
