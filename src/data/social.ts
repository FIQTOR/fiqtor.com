import { SOCIAL_LINKS } from '../config/Identity';

/**
 * Social profile links, resolved from the central identity configuration so
 * the whole site can be rebranded from one file.
 */
export const SocialLink = {
  instagram: SOCIAL_LINKS.instagram,
  tiktok: SOCIAL_LINKS.tiktok,
  youtube: SOCIAL_LINKS.youtube,
  linkedin: SOCIAL_LINKS.linkedin,
  github: SOCIAL_LINKS.github,
  threads: SOCIAL_LINKS.threads,
} as const;

export type SocialLinkKey = keyof typeof SocialLink;
