// Import required dependencies
import { useRef } from "react";
import { SocialLink } from "@/data/social";
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
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { BRAND_NAME, OWNER_ALIAS, SOCIAL_LINKS, COMPANY } from "@/config/Identity";
import { useTranslation } from "@/i18n";
import { useLowPower, usePrefersReducedMotion } from "@/hooks/useDeviceCapabilities";

// Define the type for social link items
type SocialLinkType = {
  /** Static display name. Ignored when `nameKey` is present. */
  name: string;
  /** i18n key used to resolve the display name at render time. */
  nameKey?: "linktree.portfolio" | "linktree.contact" | "linktree.business" | "linktree.aiPrd";
  /** Variables fed to the translation (e.g. {company}). */
  nameVars?: Record<string, string>;
  href: string; // URL or path for the link
  icon?: React.ReactNode; // Optional icon component
  image?: string; // Optional image path
};

// Array of social media links and other important links
const socialLinks: SocialLinkType[] = [
  {
    name: "Portfolio Website",
    nameKey: "linktree.portfolio",
    href: "/",
    icon: (
      <TbLayoutCollage className="h-6 w-6 transform transition-transform group-hover:scale-125" />
    ),
  },
  {
    name: "Contact Me",
    nameKey: "linktree.contact",
    href: "/talk",
    icon: (
      <TbAffiliate className="h-6 w-6 transform transition-transform group-hover:scale-125" />
    ),
  },
  {
    name: `${COMPANY.name} - Business Solutions`,
    nameKey: "linktree.business",
    nameVars: { company: COMPANY.name },
    href: COMPANY.url,
    image: COMPANY.image,
  },
  {
    name: `${COMPANY.name} AI - Make PRD Now`,
    nameKey: "linktree.aiPrd",
    nameVars: { company: COMPANY.name },
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

/** Container variant that staggers the entrance of each link row. */
const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

/** Per-item entrance variant: each row fades + slides up in turn. */
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

/** Single link row with a cursor-following spotlight and a shine sweep. */
function LinkRow({
  href,
  label,
  icon,
  image,
  disabled,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
  image?: string;
  disabled?: boolean;
}) {
  const rowRef = useRef<HTMLLIElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    if (disabled || !rowRef.current) return;
    const rect = rowRef.current.getBoundingClientRect();
    rowRef.current.style.setProperty("--x", `${e.clientX - rect.left}px`);
    rowRef.current.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.li
      ref={rowRef}
      variants={itemVariants}
      onMouseMove={handleMove}
      className="group/row relative flex w-full"
    >
      <Link
        to={href}
        target={href.startsWith("https") ? "_blank" : undefined}
        className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-md border-b border-b-black py-2 shadow-xl duration-200 hover:gap-4 hover:scale-105 hover:border-b-8 dark:border-x-0 dark:border-t-0 dark:border-b-white"
      >
        {/* Cursor-following spotlight (monochrome) */}
        {!disabled && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-0 opacity-0 transition-opacity duration-300 group-hover/row:opacity-100"
            style={{
              background:
                "radial-gradient(120px circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.35), transparent 65%)",
            }}
          />
        )}
        {/* Shine sweep on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 -left-full -z-0 h-full w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/row:translate-x-[300%]"
        />
        <span className="relative z-10 flex items-center gap-2">
          {icon ||
            (image && (
              <img
                src={image}
                alt={label}
                className="h-6 w-6 transform transition-transform group-hover:scale-125"
              />
            ))}
          {label}
        </span>
      </Link>
    </motion.li>
  );
}

export default function LinktreeBox() {
  const { t } = useTranslation();
  const lowPower = useLowPower();
  const reducedMotion = usePrefersReducedMotion();
  const effectsDisabled = lowPower || reducedMotion;

  // --- 3D tilt (desktop, pointer only) ---
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 150, damping: 20 });
  const springY = useSpring(tiltY, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (effectsDisabled || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    tiltX.set((e.clientX - rect.left) / rect.width - 0.5);
    tiltY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleCardMove}
      onMouseLeave={resetTilt}
      style={
        effectsDisabled
          ? undefined
          : { rotateX, rotateY, transformPerspective: 900 }
      }
      className="relative flex h-full w-full flex-col gap-2 mb-14 rounded-xl shadow-xl backdrop-blur-md dark:border-t dark:border-neutral-800 dark:bg-neutral-900/50"
    >
      {/* Background header image section */}
      <div className="absolute h-28 w-full overflow-hidden rounded-t-xl bg-neutral-400">
        <img
          src="/img/projects/personal-website.webp"
          alt="project"
          className="absolute transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="h-full w-full backdrop-blur-sm"></div>
      </div>

      {/* Profile information section */}
      <div className="z-10 flex flex-col items-center gap-4 px-10 pb-10 pt-16">
        {/* Profile picture with animated ring + decorative star */}
        <div className="relative">
          {/* Rotating monochrome conic ring */}
          <motion.span
            aria-hidden
            className="absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.9),transparent_50%)]"
            animate={effectsDisabled ? undefined : { rotate: 360 }}
            transition={{ duration: 8, ease: "linear", repeat: Infinity }}
            style={{ filter: "blur(2px)" }}
          />
          <img
            src="/icon.webp"
            alt="icon"
            width="100"
            height="100"
            className="relative rounded-full border-2 border-white"
          />
          <img
            src="/img/star.webp"
            alt="star"
            className="absolute w-15 -top-4 -right-4 animate-bounce"
          />
        </div>

        {/* Profile details and bio */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="flex items-center gap-2 text-2xl font-bold bg-linear-to-r from-black dark:from-white to-transparent bg-clip-text text-transparent">
            {BRAND_NAME}
            <span className="relative flex h-2.5 w-2.5" aria-hidden>
              {!effectsDisabled && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              )}
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
          </h1>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {t("linktree.pronouns")}
          </span>
          <p className="text-center text-gray-700 dark:text-gray-300 font-medium max-w-md">
            {t("linktree.bio")}
          </p>
        </div>
      </div>

      {/* Social links list (staggered entrance) */}
      <motion.ul
        className="flex flex-col gap-4 px-7 pb-7"
        variants={listVariants}
        initial="hidden"
        animate="show"
      >
        {socialLinks.map(({ name, nameKey, nameVars, href, icon, image }) => {
          const label = nameKey ? t(nameKey, nameVars) : name;
          return (
            href && (
              <LinkRow
                key={label}
                href={href}
                label={label}
                icon={icon}
                image={image}
                disabled={effectsDisabled}
              />
            )
          );
        })}
      </motion.ul>
    </motion.div>
  );
}
