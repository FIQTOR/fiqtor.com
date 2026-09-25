import type { ComponentType } from "react";
import { FcGoogle } from "react-icons/fc";
import * as Icons from "react-icons/si";
import { FaAmazon, FaAws, FaCss3Alt } from "react-icons/fa";

export interface iconProps {
  className?: string;
  strokeWidth?: string | number;
}

/** Any icon component (react-icons or a local SVG) rendered with a className. */
export type IconComponent = ComponentType<iconProps>;

// Language
export const Html5 = ({ className }: iconProps) => (
  <Icons.SiHtml5 className={`fill-orange-600 ${className}`} />
);
export const Css3 = ({ className }: iconProps) => (
  <FaCss3Alt className={`fill-blue-400 ${className}`} />
);
export const Javascript = ({ className }: iconProps) => (
  <Icons.SiJavascript className={`rounded fill-yellow-400 ${className}`} />
);
export const Php = ({ className }: iconProps) => (
  <Icons.SiPhp className={`fill-purple-500 ${className}`} />
);
export const Typescript = ({ className }: iconProps) => (
  <Icons.SiTypescript className={`rounded fill-blue-800 ${className}`} />
);
export const CSharp = ({ className }: iconProps) => (
  <Icons.SiC className={`rounded fill-purple-600 ${className}`} />
);
export const Cplusplus = ({ className }: iconProps) => (
  <Icons.SiCplusplus className={`rounded fill-green-600 ${className}`} />
);
export const Python = ({ className }: iconProps) => (
  <Icons.SiPython className={`rounded fill-yellow-500 ${className}`} />
);
export const Lua = ({ className }: iconProps) => (
  <Icons.SiLua className={`rounded fill-blue-600 ${className}`} />
);

// Technology stack
export const ReactJS = ({ className }: iconProps) => (
  <Icons.SiReact className={`fill-blue-500 ${className}`} />
);
export const NextJS = ({ className }: iconProps) => (
  <Icons.SiNextdotjs
    className={`fill-stone-950 dark:fill-white ${className}`}
  />
);
export const Tailwindcss = ({ className }: iconProps) => (
  <Icons.SiTailwindcss className={`fill-blue-400 ${className}`} />
);
export const Bootstrap = ({ className }: iconProps) => (
  <Icons.SiBootstrap className={`fill-purple-500 ${className}`} />
);
export const JQuery = ({ className }: iconProps) => (
  <Icons.SiJquery className={`fill-blue-600 ${className}`} />
);
export const Sass = ({ className }: iconProps) => (
  <Icons.SiSass className={`fill-pink-600 ${className}`} />
);
export const Framer = ({ className }: iconProps) => (
  <Icons.SiFramer className={`fill-stone-950 dark:fill-white ${className}`} />
);
export const Redux = ({ className }: iconProps) => (
  <Icons.SiRedux className={`fill-purple-800 ${className}`} />
);
export const Laravel = ({ className }: iconProps) => (
  <Icons.SiLaravel className={`fill-red-600 ${className}`} />
);
export const Codeigniter = ({ className }: iconProps) => (
  <Icons.SiCodeigniter className={`fill-red-700 ${className}`} />
);
export const Mysql = ({ className }: iconProps) => (
  <Icons.SiMysql className={`fill-orange-500 ${className}`} />
);
export const Postgresql = ({ className }: iconProps) => (
  <Icons.SiPostgresql className={`fill-blue-700 ${className}`} />
);
export const Amazonrds = ({ className }: iconProps) => (
  <FaAmazon className={`fill-blue-700 ${className}`} />
);
export const Mariadb = ({ className }: iconProps) => (
  <Icons.SiMariadb className={`fill-stone-950 dark:fill-white ${className}`} />
);
export const Express = ({ className }: iconProps) => (
  <Icons.SiExpress className={`fill-stone-950 dark:fill-white ${className}`} />
);
export const Axios = ({ className }: iconProps) => (
  <Icons.SiAxios className={`fill-stone-950 dark:fill-white ${className}`} />
);
export const Jsonwebtokens = ({ className }: iconProps) => (
  <Icons.SiJsonwebtokens
    className={`fill-stone-950 dark:fill-white ${className}`}
  />
);
export const Swiper = ({ className }: iconProps) => (
  <Icons.SiSwiper className={`fill-blue-700 ${className}`} />
);

// Other
export const Amazonaws = ({ className }: iconProps) => (
  <FaAws className={`fill-orange-500 ${className}`} />
);
export const Google = ({ className }: iconProps) => (
  <FcGoogle className={`${className}`} />
);
export const Facebook = ({ className }: iconProps) => (
  <Icons.SiFacebook className={`fill-blue-700 ${className}`} />
);
export const Meta = ({ className }: iconProps) => (
  <Icons.SiMeta className={`fill-blue-700 ${className}`} />
);
export const Git = ({ className }: iconProps) => (
  <Icons.SiGit className={`fill-red-600 ${className}`} />
);
export const Github = ({ className }: iconProps) => (
  <Icons.SiGithub className={`fill-stone-900 dark:fill-white ${className}`} />
);
export const Vercel = ({ className }: iconProps) => (
  <Icons.SiVercel className={`fill-neutral-900 dark:fill-white ${className}`} />
);
export const Unity = ({ className }: iconProps) => (
  <Icons.SiUnity className={`fill-neutral-900 dark:fill-white ${className}`} />
);
export const Cpanel = ({ className }: iconProps) => (
  <Icons.SiCpanel className={`fill-blue-700 ${className}`} />
);
export const Githubpages = ({ className }: iconProps) => (
  <Icons.SiGithubpages
    className={`fill-neutral-900 dark:fill-white ${className}`}
  />
);
export const Docker = ({ className }: iconProps) => (
  <Icons.SiDocker className={`fill-blue-700 ${className}`} />
);
export const Blockchain = ({ className }: iconProps) => (
  <Icons.SiBlockchaindotcom className={`fill-neutral-900 dark:fill-white ${className}`} />
);
export const Solidity = ({ className }: iconProps) => (
  <Icons.SiSolidity className={`fill-neutral-900 dark:fill-white ${className}`} />
);
export const Openai = ({ className }: iconProps) => (
  <Icons.SiOpenai className={`fill-neutral-900 dark:fill-white ${className}`} />
);
export const N8N = ({ className }: iconProps) => (
  <Icons.SiN8N className={`fill-[#ea4b71] ${className}`} />
);
export const Node = ({ className }: iconProps) => (
  <Icons.SiNodedotjs className={`fill-green-600 ${className}`} />
);
export const Whatsapp = ({ className }: iconProps) => (
  <Icons.SiWhatsapp className={`fill-green-600 ${className}`} />
);