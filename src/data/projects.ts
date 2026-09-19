// Import icons from the icons directory
import type { ComponentType } from "react";
import {
  Axios,
  Cpanel,
  Css3,
  Express,
  Framer,
  Git,
  Html5,
  Javascript,
  JQuery,
  Jsonwebtokens,
  Laravel,
  Mysql,
  N8N,
  NextJS,
  Node,
  Openai,
  Postgresql,
  ReactJS,
  Swiper,
  Tailwindcss,
  Typescript,
  Vercel,
  Whatsapp,
} from "./icons";

// Define the Icon type interface
// SvgIcon: SVG component for the technology icon
// title: Display name of the technology
export type Icon = {
  SvgIcon: ComponentType<{ className?: string }>;
  title: string;
};

// Available project categories used for filtering
export type ProjectCategory =
  | "AI & Automation"
  | "Web App"
  | "Business System"
  | "E-Commerce"
  | "Landing Page"
  | "Template"
  | "Creative";

// Ordered list of categories for filter controls
export const ProjectCategories: Array<ProjectCategory> = [
  "AI & Automation",
  "Web App",
  "Business System",
  "E-Commerce",
  "Landing Page",
  "Template",
  "Creative",
];

// Define the Project type interface
// title: Name of the project
// category: Main category of the project
// description: Brief explanation of the project
// urlDirect: Optional live demo URL
// srcImage: Path to project screenshot/image
// tags: Optional array of project categories/keywords
// icons: Array of technology icons used in the project
export type Project = {
  title: string;
  category: ProjectCategory;
  description: string;
  urlDirect?: string;
  srcImage: string;
  tags?: Array<string>;
  icons: Array<Icon>;
};

// Export array of projects data
export const Projects: Array<Project> = [
  {
    title: "IARTY Ecosystem - Business Core",
    category: "Business System",
    description:
      "Discover a seamless digital experience with Iarty, an innovative tech powerhouse. We bridge the gap between complex technology and practical solutions by providing specialized Education, AI-driven Investment tools, and a curated Marketplace. Beyond products, we empower B2B and B2C sectors through custom Web and Mobile application development, seamless AI integration, and strategic growth consulting to scale client businesses to the next level.",
    urlDirect: "https://iarty.biz.id",
    srcImage: "img/projects/iarty.webp",
    tags: ["Ecosystem", "AI Integration", "Business Growth", "EdTech"],
    icons: [
      {
        SvgIcon: NextJS,
        title: "Next.js",
      },
      {
        SvgIcon: Git,
        title: "Git",
      },
      {
        SvgIcon: Vercel,
        title: "Vercel",
      },
      {
        SvgIcon: Express,
        title: "Express",
      },
      {
        SvgIcon: Postgresql,
        title: "PostgreSQL",
      },
      {
        SvgIcon: Framer,
        title: "Framer Motion",
      },
      {
        SvgIcon: Axios,
        title: "Axios",
      },
      {
        SvgIcon: Typescript,
        title: "TypeScript",
      },
      {
        SvgIcon: Openai,
        title: "OpenAI",
      },
    ],
  },

  {
    title: "WhatsApp Automation - AI Chatbot",
    category: "AI & Automation",
    description:
      "WhatsApp Automation AI is a smart solution designed to help businesses automatically respond to customer messages, effectively replacing manual WhatsApp admins. With seamless integration into any business process, it enables 24/7 support, faster response times, improved customer satisfaction, and optimized operations.",
    srcImage: "img/projects/whatsapp-automation.webp",
    tags: ["AI Chatbot", "Customer Support", "Business Automation"],
    icons: [
      {
        SvgIcon: Whatsapp,
        title: "WhatsApp",
      },
      {
        SvgIcon: Node,
        title: "NodeJS",
      },
      {
        SvgIcon: Javascript,
        title: "JavaScript",
      },
      {
        SvgIcon: Openai,
        title: "OpenAI",
      },
      {
        SvgIcon: N8N,
        title: "N8N",
      },
    ],
  },
  {
    title: "IARTY AI (Third Party) - Multiple AI Models",
    category: "AI & Automation",
    description:
      "IARTY AI is a portable AI chat platform designed for maximum flexibility and efficiency, allowing users to seamlessly import and export conversations while switching between multiple models—including GPT, DeepSeek AI, and over 50+ supported models—within a single chat session. Users can bring their own API keys to utilize custom models or access integrated IARTY AI models for free using built-in credits. Engineered with an advanced feature suite, it supports long and short context processing, a specialized PRD builder, Thinking Mode, Caveman mode, and tailored AI roles. Additionally, IARTY AI provides powerful AI-driven analytics for US stock and crypto markets, delivering a comprehensive toolset for power users and market analysts alike.",
    urlDirect: "https://ai.iarty.biz.id",
    srcImage: "img/projects/iarty-ai.webp",
    tags: ["AI Chat", "Multi-AI", "Productivity Tool"],
    icons: [
      {
        SvgIcon: NextJS,
        title: "Next.js",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS",
      },
      {
        SvgIcon: Vercel,
        title: "Vercel",
      },
      {
        SvgIcon: Express,
        title: "Express.js",
      },
      {
        SvgIcon: Openai,
        title: "OpenAI",
      },
      {
        SvgIcon: Axios,
        title: "Axios",
      },
      {
        SvgIcon: Typescript,
        title: "TypeScript",
      },
    ],
  },
  {
    title: "AI Marketplace - Find the best prompts for your project",
    category: "E-Commerce",
    description:
      "A marketplace for AI-powered tools and services. Built with modern technologies for maximum flexibility and efficiency.",
    urlDirect: "https://marketplace.iarty.biz.id",
    srcImage: "img/projects/iarty-ai-marketplace.webp",
    tags: ["AI Marketplace", "Business", "AI Tools"],
    icons: [
      {
        SvgIcon: NextJS,
        title: "Next.js",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS",
      },
      {
        SvgIcon: Vercel,
        title: "Vercel",
      },
      {
        SvgIcon: Express,
        title: "Express.js",
      },
      {
        SvgIcon: Axios,
        title: "Axios",
      },
      {
        SvgIcon: Typescript,
        title: "TypeScript",
      },
    ],
  },
  {
    title: "Zantova App - UI Marketplace",
    category: "E-Commerce",
    description:
      "Zantova App is an Website UI Marketplace where find the best UI or component for your project.",
    urlDirect: "https://zantova.my.id",
    srcImage: "img/projects/zantova.webp",
    tags: ["Webstie", "UI Design", "Marketplace"],
    icons: [
      {
        SvgIcon: NextJS,
        title: "Next.js",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS",
      },
      {
        SvgIcon: Vercel,
        title: "Vercel",
      },
      {
        SvgIcon: Express,
        title: "Express.js",
      },
      {
        SvgIcon: Axios,
        title: "Axios",
      },
      {
        SvgIcon: Typescript,
        title: "TypeScript",
      },
    ],
  },
  {
    title: "Particle Handtracker - Powered by OpenCV",
    category: "Creative",
    description:
      "A cutting-edge hand tracking solution using particle systems for real-time gesture recognition and interaction.",
    srcImage: "img/projects/particle-handtracker.webp",
    urlDirect: "https://particle-handtracker.vercel.app/",
    tags: ["Gesture Recognition", "Real-Time Interaction", "Particle Systems"],
    icons: [
      {
        SvgIcon: Html5,
        title: "HTML5",
      },
      {
        SvgIcon: Javascript,
        title: "JavaScript",
      },
    ],
  },
  {
    title: "Djoyo Florist - Selling Sign With Flowers",
    category: "Landing Page",
    description:
      "The official website of Djoyo Florist, which provides services for ordering flower arrangements, bouquets, flower boards, and event decorations in Indonesia. It features a product catalog, service information for weddings, graduations, birthdays, and condolences, as well as direct contact for quick orders.",
    srcImage: "img/projects/djoyo-florist.webp",
    urlDirect: "https://djoyoflorist.com/",
    tags: ["Customer Helper", "Wedding Decoration"],
    icons: [
      {
        SvgIcon: NextJS,
        title: "Next.js",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS",
      },
      {
        SvgIcon: Typescript,
        title: "TypeScript",
      },
      {
        SvgIcon: Vercel,
        title: "Vercel",
      },
    ],
  },
  {
    title: "IARTY Analytics for IG & TikTok",
    category: "Web App",
    description:
      "IARTY Analytics is a social media analytics tool focused on Instagram/Tiktok. In its current development stage, it allows users to easily identify accounts that don't follow them back and accounts they don't follow back. Designed to offer clarity and control over your Instagram/Tiktok connections.",
    urlDirect: "https://analytics.iarty.biz.id",
    srcImage: "img/projects/iarty-analytics.webp",
    tags: ["Analytics", "Social Media", "Web App"],
    icons: [
      {
        SvgIcon: NextJS,
        title: "Next.js",
      },
      {
        SvgIcon: Tailwindcss,
        title: "Tailwind CSS",
      },
      {
        SvgIcon: Typescript,
        title: "TypeScript",
      },
      {
        SvgIcon: Vercel,
        title: "Vercel",
      },
    ],
  },
  {
    title: "IARTY Education - Open courses for upskilling",
    category: "Web App",
    description:
      "A comprehensive EdTech platform designed to provide a high-quality learning experience. Featuring structured course materials and high-definition video lessons, it empowers users to master new skills through an intuitive, modern interface built for seamless educational delivery.",
    urlDirect: "https://education.iarty.biz.id",
    srcImage: "img/projects/iarty-education.webp",
    tags: ["E-Learning", "Video Course", "Education"],
    icons: [
      {
        SvgIcon: NextJS,
        title: "Next.js",
      },
      {
        SvgIcon: Git,
        title: "Git",
      },
      {
        SvgIcon: Vercel,
        title: "Vercel",
      },
      {
        SvgIcon: Express,
        title: "Express",
      },
      {
        SvgIcon: Postgresql,
        title: "PostgreSQL",
      },
      {
        SvgIcon: Framer,
        title: "Framer Motion",
      },
      {
        SvgIcon: Axios,
        title: "Axios",
      },
      {
        SvgIcon: Typescript,
        title: "TypeScript",
      },
      {
        SvgIcon: Openai,
        title: "OpenAI",
      },
    ],
  },
  {
    title: "Sigma Teknik - Air Conditioner Service",
    category: "Landing Page",
    description:
      "A website for a service company that handles air conditioner, refrigerator, and other cooling equipment repairs. It includes a full list of services, work documentation with photos, project records, company information, office location, and a direct WhatsApp contact button for quick communication.",
    srcImage: "img/projects/sigma-teknik-ac.webp",
    urlDirect: "https://www.mojokertoac.com/",
    tags: ["Customer Helper", "Air Conditioner Service"],
    icons: [
      {
        SvgIcon: NextJS,
        title: "Next.js",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS",
      },
      {
        SvgIcon: Framer,
        title: "Framer Motion",
      },
      {
        SvgIcon: Typescript,
        title: "TypeScript",
      },
      {
        SvgIcon: Vercel,
        title: "Vercel",
      },
    ],
  },
  {
    title: "Template Coffee Shop Surabaya",
    category: "Template",
    description:
      "Cafe website template that features a complete menu, product photos, location information, and a direct contact button to WhatsApp. Suitable for coffee businesses that want to appear neat and professional. Only Rp300.000",
    srcImage: "img/projects/cshop-surabaya.webp",
    urlDirect: "https://template-cshop-surabaya.vercel.app/",
    tags: ["Coffee Shop", "Customer Helper"],
    icons: [
      {
        SvgIcon: NextJS,
        title: "Next.js",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS",
      },
      {
        SvgIcon: Framer,
        title: "Framer Motion",
      },
      {
        SvgIcon: Typescript,
        title: "TypeScript",
      },
      {
        SvgIcon: Vercel,
        title: "Vercel",
      },
    ],
  },
  {
    title: "Template Coffee Shop Space",
    category: "Template",
    description:
      "A modern-themed template with a menu showcase, price details, product photos, cafe location, and WhatsApp contact feature. Suitable for cafes that want to give a futuristic impression while still being easily accessible to customers. Only Rp300.000",
    srcImage: "img/projects/cshop-space.webp",
    urlDirect: "https://template-cshop-space.vercel.app/",
    tags: ["Coffee Shop", "Customer Helper"],
    icons: [
      {
        SvgIcon: NextJS,
        title: "Next.js",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS",
      },
      {
        SvgIcon: Framer,
        title: "Framer Motion",
      },
      {
        SvgIcon: Typescript,
        title: "TypeScript",
      },
      {
        SvgIcon: Vercel,
        title: "Vercel",
      },
    ],
  },
  {
    title: "Template Coffee Shop Retro",
    category: "Template",
    description:
      "Retro-style template with menu pages, lists of drinks and food, cafe location, and a WhatsApp button for orders or reservations. Perfect for cafes that want to look unique and nostalgic. Only Rp300,000",
    srcImage: "img/projects/cshop-retro.webp",
    urlDirect: "https://template-cshop-retro.vercel.app/",
    tags: ["Coffee Shop", "Customer Helper"],
    icons: [
      {
        SvgIcon: NextJS,
        title: "Next.js",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS",
      },
      {
        SvgIcon: Framer,
        title: "Framer Motion",
      },
      {
        SvgIcon: Typescript,
        title: "TypeScript",
      },
      {
        SvgIcon: Vercel,
        title: "Vercel",
      },
    ],
  },
  {
    title: "Store Management System - IARTY MODULeF",
    category: "Business System",
    description:
      "This project provides a comprehensive solution for managing a grocery store, including stock management (in and out), expenditure tracking, income tracking, and cashier transactions. The system also includes analytics for better business insights and operational efficiency.",
    srcImage: "img/projects/iarty-modulef-store_management_system.webp",
    tags: [
      "Store Management",
      "Business Analytics",
      "Income Tracking",
      "Inventory Management",
    ],
    icons: [
      {
        SvgIcon: NextJS,
        title: "Next.js",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS",
      },
      {
        SvgIcon: Postgresql,
        title: "PostgreSQL",
      },
      {
        SvgIcon: Framer,
        title: "Framer Motion",
      },
      {
        SvgIcon: Axios,
        title: "Axios",
      },
      {
        SvgIcon: Typescript,
        title: "TypeScript",
      },
      {
        SvgIcon: Express,
        title: "Express.js",
      },
      {
        SvgIcon: Jsonwebtokens,
        title: "JWT",
      },
    ],
  },
  {
    title: "Savoria Online Order Restaurant - IARTY MODULeF",
    category: "Business System",
    description:
      "Savoria ModuleF offers a seamless online ordering experience for restaurants. Customers can scan a QR code at the table, choose their desired menu items, and pay using various payment methods such as bank transfer, e-wallet, or cash. The system also includes branch management, revenue analytics, and more, making the entire ordering process more efficient.",
    srcImage: "img/projects/iarty-modulef-savoria_online_order_restaurant.webp",
    tags: [
      "Restaurant Management",
      "Staff Management",
      "Branch Management",
      "Online Order",
      "Online Payment",
      "Business Analytics",
    ],
    icons: [
      {
        SvgIcon: NextJS,
        title: "Next.js",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS",
      },
      {
        SvgIcon: Postgresql,
        title: "PostgreSQL",
      },
      {
        SvgIcon: Framer,
        title: "Framer Motion",
      },
      {
        SvgIcon: Axios,
        title: "Axios",
      },
      {
        SvgIcon: Typescript,
        title: "TypeScript",
      },
      {
        SvgIcon: Express,
        title: "Express.js",
      },
      {
        SvgIcon: Jsonwebtokens,
        title: "JWT",
      },
    ],
  },
  {
    title: "Word Love Code - Gift Website",
    category: "Creative",
    description:
      "Word Love Code is a creative platform designed to help users create personalized gifts for their loved ones. Using a combination of HTML, CSS, and JavaScript, users can design unique messages, poems, and quotes that can be shared as meaningful gifts. Whether for special occasions or just because, Word Love Code brings words to life.",
    urlDirect: "https://word-love-code.vercel.app/",
    srcImage: "img/projects/world-love-code.webp",
    tags: ["Gift", "Love", "Personalized", "Web Development"],
    icons: [
      {
        SvgIcon: Html5,
        title: "HTML",
      },
      {
        SvgIcon: Css3,
        title: "CSS",
      },
      {
        SvgIcon: Javascript,
        title: "JavaScript",
      },
    ],
  },
  {
    title: "Online Store - IARTY ModuleF",
    category: "E-Commerce",
    description:
      "Discover a seamless shopping experience with ModuleF, an innovative online store module. Users can add products, and clicking on a product card redirects to the respective marketplace.",
    srcImage: "img/projects/online-store-modulef.webp",
    tags: ["Online Store", "E-Commerce"],
    icons: [
      {
        SvgIcon: NextJS,
        title: "Next.js",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS",
      },
      {
        SvgIcon: Postgresql,
        title: "PostgreSQL",
      },
      {
        SvgIcon: Framer,
        title: "Framer Motion",
      },
      {
        SvgIcon: Axios,
        title: "Axios",
      },
      {
        SvgIcon: Typescript,
        title: "TypeScript",
      },
      {
        SvgIcon: Express,
        title: "Express.js",
      },
      {
        SvgIcon: Jsonwebtokens,
        title: "JWT",
      },
    ],
  },
  {
    title: "QR Code Generator - Open Source",
    category: "Web App",
    description:
      "Create your own QR codes with ease using QR Code Generator, a powerful web application. Generate custom QR codes for any occasion and share them instantly. Built with modern web technologies for a seamless experience.",
    urlDirect: "https://qrcode.fiqtor.com",
    srcImage: "img/projects/qrcode-generator.webp",
    tags: ["Web Application", "QR Code", "ReactJS", "TailwindCSS"],
    icons: [
      {
        SvgIcon: ReactJS,
        title: "ReactJS",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS",
      },
    ],
  },
  {
    title: "Merry Christmas Tree - Gift Website",
    category: "Creative",
    description:
      "Celebrate the festive season with Merry Christmas Tree, your go-to website for all things Christmas. Discover beautifully decorated Christmas trees, festive ornaments, and holiday cheer that will brighten your celebrations.",
    urlDirect: "https://fiqtor.github.io/christmas-tree",
    srcImage: "img/projects/merry-christmas-tree.webp",
    tags: ["Holiday Website", "Festive Decorations", "Seasonal Joy"],
    icons: [
      {
        SvgIcon: Html5,
        title: "HTML",
      },
      {
        SvgIcon: Css3,
        title: "CSS",
      },
      {
        SvgIcon: Javascript,
        title: "Javascript",
      },
    ],
  },
  {
    title: "Flowers For Someone - Gift Website (Popular)",
    category: "Creative",
    description: `Flowers for Someone is your ultimate destination for heartfelt floral gifting. Whether it's a special occasion or just to brighten someone's day, our website offers a delightful of flower arrangements, bouquets, and personalized messages.`,
    urlDirect: "https://fiqtor.github.io/flowers-for-someone",
    srcImage: "/img/projects/flowers-for-someone.webp",
    tags: ["Gift Website"],
    icons: [
      {
        SvgIcon: Html5,
        title: "HTML",
      },
      {
        SvgIcon: Css3,
        title: "CSS",
      },
      {
        SvgIcon: Javascript,
        title: "Javascript",
      },
    ],
  },
  {
    title: "Coffee Shop - QR Code & Web2.0",
    category: "Business System",
    description: `Enhance your café's efficiency and make ordering easier for your customers with our user-friendly website application.`,
    srcImage: "/img/projects/coffee-shop.webp",
    tags: ["QR Code", "Web2.0", "AJAX"],
    icons: [
      {
        SvgIcon: Laravel,
        title: "Laravel",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS",
      },
      {
        SvgIcon: Mysql,
        title: "MySQL",
      },
      {
        SvgIcon: Cpanel,
        title: "cPanel",
      },
    ],
  },
  {
    title: "Padepokan App - LMS Website",
    category: "Web App",
    description: `Streamline attendance monitoring in your educational institution with our advanced QR Code technology integrated into a user-friendly website application.`,
    urlDirect: "https://padepokan.gaeni.org",
    srcImage: "/img/projects/padepokan-app.webp",
    tags: ["EducationApp", "QR Code"],
    icons: [
      {
        SvgIcon: Laravel,
        title: "Laravel",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS",
      },
      {
        SvgIcon: Mysql,
        title: "MySQL",
      },
      {
        SvgIcon: Cpanel,
        title: "cPanel",
      },
    ],
  },
  {
    title: "Presence App - LMS Website",
    category: "Web App",
    description: `Simplify attendance tracking in your company with our intuitive and efficient website application.`,
    urlDirect: "https://presence.gaeni.org",
    srcImage: "/img/projects/presence-app.webp",
    tags: ["RestAPI", "Performance", "EducationApp"],
    icons: [
      {
        SvgIcon: ReactJS,
        title: "ReactJS",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS",
      },
      {
        SvgIcon: Axios,
        title: "Axios",
      },
      {
        SvgIcon: Jsonwebtokens,
        title: "JWT",
      },
      {
        SvgIcon: Express,
        title: "ExpressJS",
      },
      {
        SvgIcon: Mysql,
        title: "MySQL",
      },
      {
        SvgIcon: Cpanel,
        title: "cPanel",
      },
    ],
  },
  {
    title: "BBY Interior - Architechture Design Service",
    category: "Landing Page",
    description: `Showcase your skills and work in style with our beautifully designed and user-friendly portfolio website, tailored to highlight your unique talents.`,
    urlDirect: "https://bby-interior.vercel.app",
    srcImage: "/img/projects/bby.interior.webp",
    tags: ["Portfolio", "Personal Branding", "Furniture"],
    icons: [
      {
        SvgIcon: NextJS,
        title: "NextJS",
      },
      {
        SvgIcon: Typescript,
        title: "Typescript",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS",
      },
      {
        SvgIcon: Swiper,
        title: "Swiper",
      },
    ],
  },
  {
    title: "KORARIA - Restaurant Website",
    category: "Business System",
    description: `Enhance your restaurant's online presence with our responsive web application, featuring a comprehensive menu display and product showcase, similar to solariaresto.co.id. Contact us for more information.`,
    srcImage: "/img/projects/koraria.webp",
    tags: ["Restaurant", "AJAX", "RestAPI", "QRCode"],
    icons: [
      {
        SvgIcon: Laravel,
        title: "Laravel",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS",
      },
      {
        SvgIcon: Mysql,
        title: "MySQL",
      },
      {
        SvgIcon: JQuery,
        title: "JQuery",
      },
    ],
  },
  {
    title: "Personal Website (v1.4)",
    category: "Landing Page",
    description: `Elevate your professional image with our feature-rich portfolio website, including contact information, skills, projects, responsiveness, and GitHub contributions. (outdated, now is v1.6.x)`,
    urlDirect: "https://fiqtor.com",
    srcImage: "/img/projects/personal-website.webp",
    tags: ["Portfolio", "Personal Branding", "UI/UX"],
    icons: [
      {
        SvgIcon: NextJS,
        title: "NextJS",
      },
      {
        SvgIcon: Framer,
        title: "FramerMotion",
      },
      {
        SvgIcon: Typescript,
        title: "Typescript",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS",
      },
    ],
  },
  {
    title: "Lunar UX - Company Profile",
    category: "Landing Page",
    description: `Present your company profile with elegance and functionality using our responsive website application, complete with contact details, services, and more.`,
    urlDirect: "https://lunar-ux.vercel.app",
    srcImage: "/img/projects/lunar-ux.webp",
    tags: ["Comapny Profile", "Landing page"],
    icons: [
      {
        SvgIcon: NextJS,
        title: "NextJS",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS",
      },
      {
        SvgIcon: Typescript,
        title: "Typescript",
      },
    ],
  },
  {
    title: "Hardware Harmony - Shop Website",
    category: "E-Commerce",
    description: `Boost your online sales with our responsive e-commerce website, designed to showcase your products effectively and engage your customers.`,
    urlDirect: "https://hardware-harmony.vercel.app",
    srcImage: "/img/projects/hardware-harmony.webp",
    tags: ["Shop Web"],
    icons: [
      {
        SvgIcon: NextJS,
        title: "NextJS",
      },
      {
        SvgIcon: Typescript,
        title: "Typescript",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS",
      },
    ],
  },
];
