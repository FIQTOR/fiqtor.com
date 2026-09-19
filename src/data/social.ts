import { SOCIAL_LINKS } from "@/config/Identity";

/**
 * Object containing social media profile links.
 * Values come from the central identity configuration (environment driven),
 * so this project can be rebranded without editing source code.
 *
 * @property {string} instagram - Instagram profile URL
 * @property {string} tiktok    - TikTok profile URL
 * @property {string} youtube   - YouTube channel URL
 * @property {string} linkedin  - LinkedIn profile URL
 * @property {string} github    - GitHub profile URL
 */
export const SocialLink = {
  instagram: SOCIAL_LINKS.instagram,
  tiktok: SOCIAL_LINKS.tiktok,
  youtube: SOCIAL_LINKS.youtube,
  linkedin: SOCIAL_LINKS.linkedin,
  github: SOCIAL_LINKS.github,
};
