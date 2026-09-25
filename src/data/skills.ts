// Import SVG icons from the icons file
import {
  Html5,
  Css3,
  Javascript,
  Typescript,
  Php,
  Tailwindcss,
  Bootstrap,
  Framer,
  Redux,
  Laravel,
  Amazonaws,
  Amazonrds,
  Githubpages,
  Cplusplus,
  JQuery,
  NextJS,
  CSharp,
  Mysql,
  Postgresql,
  Git,
  ReactJS,
  Vercel,
  Unity,
  Cpanel,
  Mariadb,
  Python,
  Express,
  Jsonwebtokens,
  Axios,
  Swiper,
  Docker,
  Blockchain,
  Solidity,
  Openai,
  N8N,
  Node,
  Lua,
} from "./icons";
import type { IconComponent } from "./icons";

// Interface for basic skill items with icon and tooltip
export type Item = {
  SvgIcon: IconComponent; // SVG component for the skill icon
  tooltip: string; // Tooltip text to display on hover
};

// Interface for API-related skill items with additional fields
export type APIItem = {
  SvgIcon: IconComponent; // SVG component for the API icon
  title: string; // Title of the API
  description: string; // Detailed description of the API
};

// Main Skills type definition containing different skill categories
type Skills = {
  language?: Array<Item>; // Programming languages
  frontend?: Array<Item>; // Frontend technologies and frameworks
  backend?: Array<Item>; // Backend technologies and databases
  other?: Array<Item>; // Other tools and platforms
  API?: Array<APIItem>; // API-related skills
};

// Export the Skills object with type checking
export const Skills: Skills = {
  language: [
    { SvgIcon: Html5, tooltip: "HTML5" },
    { SvgIcon: Css3, tooltip: "CSS3" },
    { SvgIcon: Javascript, tooltip: "Javascript" },
    { SvgIcon: Typescript, tooltip: "Typescript" },
    { SvgIcon: Php, tooltip: "PHP" },
    { SvgIcon: Cplusplus, tooltip: "C++" },
    { SvgIcon: CSharp, tooltip: "CSharp" },
    { SvgIcon: Python, tooltip: "Python" },
    { SvgIcon: Solidity, tooltip: "Solidity" },
    { SvgIcon: Lua, tooltip: "Lua" },
  ],
  frontend: [
    { SvgIcon: ReactJS, tooltip: "ReactJS" },
    { SvgIcon: NextJS, tooltip: "NextJS" },
    { SvgIcon: Tailwindcss, tooltip: "TailwindCSS" },
    { SvgIcon: Bootstrap, tooltip: "Bootstrap" },
    { SvgIcon: JQuery, tooltip: "JQuery" },
    { SvgIcon: Framer, tooltip: "FramerMotion" },
    { SvgIcon: Redux, tooltip: "ReduxToolkit" },
    { SvgIcon: Swiper, tooltip: "Swiper" },
  ],
  backend: [
    { SvgIcon: Laravel, tooltip: "Laravel" },
    { SvgIcon: Mysql, tooltip: "MySQL" },
    { SvgIcon: Postgresql, tooltip: "PostgreSQL" },
    { SvgIcon: Amazonrds, tooltip: "AmazonRDS" },
    { SvgIcon: Mariadb, tooltip: "Mariadb" },
    { SvgIcon: Express, tooltip: "ExpressJS" },
    { SvgIcon: Jsonwebtokens, tooltip: "JWT" },
    { SvgIcon: Axios, tooltip: "Axios" },
  ],
  other: [
    { SvgIcon: Amazonaws, tooltip: "AWS" },
    { SvgIcon: Git, tooltip: "Git" },
    { SvgIcon: Vercel, tooltip: "Vercel" },
    { SvgIcon: Unity, tooltip: "Unity" },
    { SvgIcon: Githubpages, tooltip: "GithubPages" },
    { SvgIcon: Cpanel, tooltip: "cPanel" },
    { SvgIcon: Docker, tooltip: "Docker" },
    { SvgIcon: Openai, tooltip: "OpenaiAPI" },
    { SvgIcon: Blockchain, tooltip: "Blockchain" },
    { SvgIcon: N8N, tooltip: "N8N" },
    { SvgIcon: Node, tooltip: "NodeJS" },
  ],
};
