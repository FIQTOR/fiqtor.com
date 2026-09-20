// Import required dependencies
import { SocialLink } from "@/data/social";
import { ContainerContext } from "@/context/ContainerProvider";
import { useContext } from "react";
import {
  SiGithub,
  SiInstagram,
  SiThreads,
  SiTiktok,
  SiYoutube,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { TbAffiliate, TbLayoutCollage } from "react-icons/tb";
import { Link as Link } from "react-router-dom";
import { BRAND_NAME, OWNER_ALIAS, SOCIAL_LINKS, COMPANY } from "@/config/Identity";

// Define the type for social link items
type SocialLinkType = {
  name: string; // Display name for the link
  href: string; // URL or path for the link
  icon?: React.ReactNode; // Optional icon component
  image?: string; // Optional image path
};

// Array of social media links and other important links
const socialLinks: SocialLinkType[] = [
  {
    name: "Portfolio Website",
    href: "/",
    icon: (
      <TbLayoutCollage className="h-6 w-6 transform transition-transform group-hover:scale-125" />
    ),
  },
  {
    name: "Contact Me",
    href: "/talk",
    icon: (
      <TbAffiliate className="h-6 w-6 transform transition-transform group-hover:scale-125" />
    ),
  },
  {
    name: `${COMPANY.name} - Business Solutions`,
    href: COMPANY.url,
    image: COMPANY.image,
  },
  {
    name: `${COMPANY.name} AI - Make PRD Now`,
    href: COMPANY.aiUrl,
    image: COMPANY.image,
  },
  {
    name: `TikTok (1900+ Followers) • @${OWNER_ALIAS}`,
    href: SocialLink.tiktok,
    icon: (
      <SiTiktok className="h-6 w-6 transform transition-transform group-hover:scale-125" />
    ),
  },
  {
    name: `Instagram • @${OWNER_ALIAS}`,
    href: SocialLink.instagram,
    icon: (
      <SiInstagram className="h-6 w-6 transform transition-transform group-hover:scale-125 fill-[#E4405F]" />
    ),
  },
  {
    name: `Threads • @${OWNER_ALIAS}`,
    href: SOCIAL_LINKS.threads,
    icon: (
      <SiThreads className="h-6 w-6 transform transition-transform group-hover:scale-125" />
    ),
  },
  {
    name: `Linkedin • ${OWNER_ALIAS}`,
    href: SocialLink.linkedin,
    icon: (
      <FaLinkedin className="h-6 w-6 transform transition-transform group-hover:scale-125 fill-blue-500" />
    ),
  },
  {
    name: `Github • ${BRAND_NAME}`,
    href: SocialLink.github,
    icon: (
      <SiGithub className="h-6 w-6 transform transition-transform group-hover:scale-125" />
    ),
  },
  {
    name: `Youtube • @${OWNER_ALIAS}`,
    href: SocialLink.youtube,
    icon: (
      <SiYoutube className="h-6 w-6 transform transition-transform group-hover:scale-125 fill-red-600" />
    ),
  },
];

export default function LinktreeBox() {
  const { setFullPathName } = useContext(ContainerContext);

  return (
    <div className="relative flex h-full w-full flex-col gap-2 mb-14 rounded-xl shadow-xl backdrop-blur-md dark:border-t dark:border-neutral-800 dark:bg-neutral-900/50">
      {/* Background header image section */}
      <div className="absolute h-28 w-full overflow-hidden rounded-t-xl bg-neutral-400">
        <img
          src="/img/projects/personal-website.webp"
          alt="project"
          className="absolute"
        />
        <div className="h-full w-full backdrop-blur-sm"></div>
      </div>

      {/* Profile information section */}
      <div className="z-10 flex flex-col items-center gap-4 px-10 pb-10 pt-16">
        {/* Profile picture with decorative star */}
        <div className="relative">
          <img
            src="/icon.webp"
            alt="icon"
            width="100"
            height="100"
            className="rounded-full border-2 border-white"
          />
          <img
            src="/img/star.webp"
            alt="star"
            className="absolute w-15  -top-4 -right-4 animate-bounce"
          />
        </div>

        {/* Profile details and bio */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold bg-linear-to-r from-black dark:from-white to-transparent bg-clip-text text-transparent">
            {BRAND_NAME}
          </h1>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            📍 Indonesian • 👨‍💻 he/him
          </span>
          <p className="text-center text-gray-700 dark:text-gray-300 font-medium max-w-md">
            Hello there! I'm a software engineer who builds digital experiences
            with code, creativity, and AI ✨
          </p>
        </div>
      </div>

      {/* Social links list */}
      <ul className="flex flex-col gap-4 px-7 pb-7">
        {socialLinks.map(
          ({ name, href, icon, image }) =>
            href && (
              <li className="flex w-full" key={name}>
                <Link
                  to={href}
                  target={href.startsWith("https") ? "_blank" : undefined}
                  className="flex w-full items-center justify-center group gap-2 hover:gap-4 rounded-md border-b border-b-black py-2 shadow-xl duration-200 hover:scale-105 hover:border-b-8 hover:opacity-70 dark:border-x-0 dark:border-t-0 dark:border-b-white"
                  onClick={() => setFullPathName(href)}
                >
                  {icon ||
                    (image && (
                      <img
                        src={image}
                        alt={name}
                        className="h-6 w-6 transform transition-transform group-hover:scale-125"
                      />
                    ))}
                  {name}
                </Link>
              </li>
            ),
        )}
      </ul>
    </div>
  );
}
