// Import icons from the icons directory
import type { ComponentType } from "react";
import {
  Axios,
  Cpanel,
  Css3,
  Docker,
  Express,
  Framer,
  Git,
  Google,
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
  Redux,
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
// srcImage: Path to project screenshot/image (used as the cover image)
// images: Optional array of extra screenshots to render as a gallery in the modal
//         (if omitted, only srcImage is shown)
// tags: Optional array of project categories/keywords
// icons: Array of technology icons used in the project
export type Project = {
  title: string;
  category: ProjectCategory;
  description: string;
  urlDirect?: string;
  srcImage: string;
  images?: Array<string>;
  tags?: Array<string>;
  icons: Array<Icon>;
};

// Export array of projects data
export const Projects: Array<Project> = [
  {
    title: "IARTY Ecosystem - Business Core",
    category: "Business System",
    description:
      "Imagine having one place that takes care of almost everything your business needs — online courses, smart AI-powered investment tools, and a digital store, all under one roof. That's Iarty. No more juggling a dozen different apps that don't talk to each other. We also build custom applications tailored to how your business actually works, so you can serve customers faster, save time, and grow your business — without ever needing to understand the technology behind it.",
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
    title: "Enterprise Suite - Full ERP Platform",
    category: "Business System",
    description:
      "Does running your business feel messy because your sales, stock, money, and staff records are scattered across notebooks and dozens of spreadsheets? Enterprise Suite brings everything into one simple screen. Instantly see today's sales, warehouse stock, who owes you money, employee salaries, and your real profit — all updated automatically in real time. No more manual counting, no more fear of costly mistakes. Just open the app and the entire health of your business is laid out clearly at a glance.",
    srcImage: "/img/projects/erp-dashboard.webp",
    images: [
      "/img/projects/erp-dashboard.webp",
      "/img/projects/erp-dashboard-analytics.webp",
      "/img/projects/erp-dashboard-notifications.webp",
      "/img/projects/erp-sales-orders.webp",
      "/img/projects/erp-purchasing.webp",
      "/img/projects/erp-inventory.webp",
      "/img/projects/erp-crm-customers.webp",
      "/img/projects/erp-finance-invoices.webp",
      "/img/projects/erp-hr-payroll.webp",
      "/img/projects/erp-reports.webp",
    ],
    tags: [
      "ERP",
      "Multi-Tenancy",
      "Accounting",
      "Inventory",
      "HR & Payroll",
      "CRM",
      "Reporting",
    ],
    icons: [
      {
        SvgIcon: ReactJS,
        title: "React 19",
      },
      {
        SvgIcon: Typescript,
        title: "TypeScript",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS v4",
      },
      {
        SvgIcon: Redux,
        title: "Redux Toolkit",
      },
      {
        SvgIcon: Node,
        title: "Node.js",
      },
      {
        SvgIcon: Express,
        title: "Express.js",
      },
      {
        SvgIcon: Mysql,
        title: "MySQL / MariaDB",
      },
      {
        SvgIcon: Jsonwebtokens,
        title: "JWT Auth",
      },
      {
        SvgIcon: Axios,
        title: "Axios",
      },
      {
        SvgIcon: Docker,
        title: "Docker",
      },
    ],
  },
  {
    title: "CRM Panel - Auth, RBAC & Sales CRM Suite",
    category: "Business System",
    description:
      "Is your sales team constantly losing track of potential buyers? CRM Panel keeps every customer and prospect in one place, so no lead ever slips through the cracks. See who is most likely to buy, get reminders to follow up on time, and track which salesperson is performing best this month — all without complicated charts. It's protected with layers of security, so only the right people can see sensitive information, wrapped in a clean, modern design that's genuinely pleasant to use every day. Perfect for businesses that want sales that are organized, predictable, and easy to measure.",
    srcImage: "img/projects/crm-dashboard.webp",
    images: [
      "img/projects/crm-dashboard.webp",
      "img/projects/crm-dashboard-analytics.webp",
      "img/projects/crm-dashboard-overview.webp",
      "img/projects/crm-sales-pipeline.webp",
      "img/projects/crm-leads.webp",
      "img/projects/crm-customers.webp",
      "img/projects/crm-accounts.webp",
      "img/projects/crm-tasks.webp",
      "img/projects/crm-analytics.webp",
      "img/projects/crm-audit-log.webp",
    ],
    tags: [
      "CRM",
      "RBAC",
      "Auth & 2FA",
      "Sales Pipeline",
      "Lead Scoring",
      "Multi-Tenancy",
      "Audit Log",
      "Analytics",
    ],
    icons: [
      {
        SvgIcon: ReactJS,
        title: "React 19",
      },
      {
        SvgIcon: Typescript,
        title: "TypeScript",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS v4",
      },
      {
        SvgIcon: Redux,
        title: "Redux Toolkit",
      },
      {
        SvgIcon: Node,
        title: "Node.js",
      },
      {
        SvgIcon: Express,
        title: "Express.js",
      },
      {
        SvgIcon: Mysql,
        title: "MySQL / MariaDB",
      },
      {
        SvgIcon: Jsonwebtokens,
        title: "JWT Auth",
      },
      {
        SvgIcon: Axios,
        title: "Axios",
      },
      {
        SvgIcon: Docker,
        title: "Docker",
      },
    ],
  },
  {
    title: "HRIS - Universal Human Resource System",
    category: "Business System",
    description:
      "Managing people — attendance, leave, salaries, contracts, and hiring — can be a nightmare when it's all done by hand. HRIS solves it in a single app that fits any type of business: factories, hospitals, schools, and service companies alike. Employees can clock in from their phone, request leave themselves, and view their payslips without lining up at HR. Owners can see payroll, attendance, and headcount reports in seconds. The result: HR work that's dramatically faster, accurate, and free from the drama of payroll mistakes.",
    srcImage: "img/projects/hris-dashboard.webp",
    images: [
      "img/projects/hris-dashboard.webp",
      "img/projects/hris-dashboard-analytics.webp",
      "img/projects/hris-my-workspace.webp",
      "img/projects/hris-employees.webp",
      "img/projects/hris-attendance.webp",
      "img/projects/hris-payroll.webp",
      "img/projects/hris-recruitment.webp",
      "img/projects/hris-performance-reviews.webp",
      "img/projects/hris-training.webp",
      "img/projects/hris-goals.webp",
      "img/projects/hris-reports.webp",
    ],
    tags: [
      "HRIS",
      "Payroll",
      "Attendance",
      "Leave Management",
      "Recruitment",
      "Performance",
      "Self-Service",
      "Multi-Tenancy",
      "RBAC",
      "Analytics",
    ],
    icons: [
      {
        SvgIcon: ReactJS,
        title: "React 19",
      },
      {
        SvgIcon: Typescript,
        title: "TypeScript",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS v4",
      },
      {
        SvgIcon: Redux,
        title: "Redux Toolkit",
      },
      {
        SvgIcon: Node,
        title: "Node.js",
      },
      {
        SvgIcon: Express,
        title: "Express.js",
      },
      {
        SvgIcon: Mysql,
        title: "MySQL / MariaDB",
      },
      {
        SvgIcon: Jsonwebtokens,
        title: "JWT Auth",
      },
      {
        SvgIcon: Axios,
        title: "Axios",
      },
      {
        SvgIcon: Docker,
        title: "Docker",
      },
    ],
  },
  {
    title: "IHS E-School - School Management & LMS",
    category: "Business System",
    description:
      "Running a school by hand — new student admissions, attendance, grades, tuition fees, and announcements to parents — is exhausting. IHS E-School brings it all into one connected platform. New students can apply online, teachers record attendance and grades in seconds, parents can follow their child's progress right from their phone, and the school manages payments and announcements automatically. It even includes an online classroom for students. In short: school administration becomes tidy, transparent, and time-saving for teachers, students, and parents alike.",
    srcImage: "/img/projects/eschool-website-hero.webp",
    images: [
      "/img/projects/eschool-website-hero.webp",
      "/img/projects/eschool-admissions.webp",
      "/img/projects/eschool-dashboard.webp",
      "/img/projects/eschool-dashboard-analytics.webp",
      "/img/projects/eschool-ppdb-applications.webp",
      "/img/projects/eschool-student-affairs.webp",
      "/img/projects/eschool-feature-toggles.webp",
      "/img/projects/eschool-finance-invoices.webp",
      "/img/projects/eschool-lms-signin.webp",
      "/img/projects/eschool-lms-dashboard.webp",
      "/img/projects/eschool-lms-assignments.webp",
    ],
    tags: [
      "School Management",
      "LMS",
      "Admissions (PPDB)",
      "CBT Exams",
      "Attendance",
      "Finance & Billing",
      "Feature Flags",
      "Parent Portal",
      "RBAC",
    ],
    icons: [
      {
        SvgIcon: ReactJS,
        title: "React 19",
      },
      {
        SvgIcon: Typescript,
        title: "TypeScript",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS v4",
      },
      {
        SvgIcon: Redux,
        title: "Redux Toolkit",
      },
      {
        SvgIcon: Node,
        title: "Node.js",
      },
      {
        SvgIcon: Express,
        title: "Express.js",
      },
      {
        SvgIcon: Mysql,
        title: "MySQL / MariaDB",
      },
      {
        SvgIcon: Jsonwebtokens,
        title: "JWT Auth",
      },
      {
        SvgIcon: Google,
        title: "Google OAuth",
      },
      {
        SvgIcon: Axios,
        title: "Axios",
      },
    ],
  },
  {
    title: "Golden Dragon - Restaurant QR Ordering App",
    category: "Business System",
    description:
      "Tired of waiters running back and forth and customers waiting forever to order? Golden Dragon lets your diners simply scan a QR code on the table, browse your full menu, and order and pay right from their own phone. Orders appear instantly on your kitchen and cashier screens, so nothing gets lost and nobody has to shout across the room. Customers can pay online through QRIS, bank transfer, e-wallet, or card — or settle at the cashier. Behind the scenes, you get a full dashboard to manage your menu, generate table QR codes, watch live orders, and track your best-selling dishes. Fewer mistakes, faster service, happier customers.",
    srcImage: "img/projects/resto-landing.webp",
    images: [
      "img/projects/resto-landing.webp",
      "img/projects/resto-customer-menu.webp",
      "img/projects/resto-customer-cart.webp",
      "img/projects/resto-customer-checkout.webp",
      "img/projects/resto-dashboard.webp",
      "img/projects/resto-orders.webp",
      "img/projects/resto-menu-management.webp",
      "img/projects/resto-tables-qr.webp",
    ],
    tags: [
      "Restaurant",
      "QR Menu",
      "Self-Ordering",
      "Midtrans Payment",
      "WhatsApp Verification",
      "Realtime SSE",
      "Admin Dashboard",
      "RBAC",
    ],
    icons: [
      {
        SvgIcon: ReactJS,
        title: "React 19",
      },
      {
        SvgIcon: Typescript,
        title: "TypeScript",
      },
      {
        SvgIcon: Tailwindcss,
        title: "TailwindCSS v4",
      },
      {
        SvgIcon: Redux,
        title: "Redux Toolkit",
      },
      {
        SvgIcon: Node,
        title: "Node.js",
      },
      {
        SvgIcon: Express,
        title: "Express.js",
      },
      {
        SvgIcon: Mysql,
        title: "MySQL / MariaDB",
      },
      {
        SvgIcon: Jsonwebtokens,
        title: "JWT Auth",
      },
      {
        SvgIcon: Google,
        title: "Google OAuth",
      },
      {
        SvgIcon: Axios,
        title: "Axios",
      },
    ],
  },
  {
    title: "WhatsApp Automation - AI Chatbot",
    category: "AI & Automation",
    description:
      "What if your business could reply to every customer on WhatsApp — instantly, day or night — without hiring anyone? This AI assistant answers questions, shares product info, takes orders, and guides customers automatically, so you never miss a sale because you were too busy or asleep. It plugs into the way your business already works, giving you 24/7 support, lightning-fast replies, and customers who feel cared for. Think of it as a tireless team member who never takes a day off.",
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
      "Meet your all-in-one AI assistant. Instead of juggling several subscriptions, IARTY AI lets you chat with 50+ different AI brains — including GPT and DeepSeek — inside one single conversation, and even switch between them mid-chat. Bring your own key or use the built-in free credits. Whether you need help writing, planning a project, thinking through a tricky problem, or analyzing the US stock and crypto markets, it's all here in one powerful, portable tool. Your conversations can even be exported and moved anywhere, so your ideas are never locked in.",
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
      "Why start from scratch when the perfect ready-made solution already exists? This marketplace is a one-stop shop for AI-powered tools and templates that save you time and money. Browse, pick, and instantly put them to work for your project — whether you're running a business, creating content, or building something new. No technical know-how required.",
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
      "Building a good-looking website usually costs a fortune and takes months. Zantova changes that. It's a marketplace where you can grab beautiful, ready-to-use website designs and building blocks, then plug them straight into your project. Whether you're a business owner wanting a polished site or a creator assembling something special, you get a professional result in a fraction of the time and cost — no design team required.",
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
      "Imagine controlling a colorful world of floating particles just by moving your hands in front of your camera — no mouse, no controller. This playful experiment tracks your hand movements in real time and turns them into dazzling visual effects. It's a fun, hands-on glimpse of how computers can understand people without any special equipment, and a taste of the interactive experiences technology can create.",
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
      "Whether it's a wedding, a graduation, a birthday, or a moment of condolence, the right flowers say what words cannot. Djoyo Florist's website makes ordering beautiful bouquets, flower boards, and event decorations effortless. Browse the full catalog of arrangements, see exactly what's available for every occasion, and reach out directly to place an order in seconds. It's the friendly online face of a trusted florist — helping customers find the perfect gift without a single phone call or store visit.",
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
      "Ever wondered who's actually following you back on Instagram or TikTok — and how many aren't? IARTY Analytics tells you in seconds. Simply connect your account and instantly see exactly which accounts don't follow you back and which ones you've stopped following. No guessing, no scrolling through endless lists by hand. It gives you clear, honest insight into your social connections, so you can decide what to do next with total confidence.",
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
      "Want to learn a new skill but don't know where to start? IARTY Education is an online learning platform built to make education feel simple and enjoyable. Well-organized lessons and crystal-clear HD video courses let you master new abilities at your own pace, from anywhere. The clean, modern interface makes studying painless — no confusing menus, no wasted time. Just log in, pick a course, and start leveling up.",
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
      "When your AC breaks in the middle of a heatwave, you don't want to hunt for a number — you want help fast. Sigma Teknik's website makes it easy to find a trusted cooling technician. See the full range of services (air conditioners, refrigerators, and more), browse real photos of completed jobs, check the company's credentials and location, and tap one button to chat on WhatsApp. It's a professional, reassuring online presence that turns a stressful repair into a simple message.",
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
      "Give your coffee shop a website as welcoming as your café. This ready-made template shows off your complete menu with tempting product photos, tells customers where to find you, and lets them message you on WhatsApp with a single tap. Ideal for coffee businesses that want to look neat, credible, and professional — without spending a fortune or waiting weeks. Only Rp300,000.",
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
      "Make your café feel ahead of its time. This modern template displays your menu and prices, showcases your drinks and food with attractive photos, shares your location, and lets customers reach you instantly on WhatsApp. Perfect for coffee shops that want a fresh, futuristic vibe that still feels friendly and easy to use. Only Rp300,000.",
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
      "Stand out with a café website that feels warm, unique, and full of character. This retro-style template presents your menu of drinks and food, shows customers where to find you, and includes a WhatsApp button for orders or reservations. Ideal for cafés that want a memorable, nostalgic look that guests instantly love. Only Rp300,000.",
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
      "Running a grocery store means keeping track of a hundred things at once — and losing count costs real money. This system handles it all for you: what comes in, what goes out, daily spending, daily income, and cashier transactions, all recorded in one place. It even shows you simple analytics so you can spot what's selling and what's not. The result is a store that runs smoothly, with clear numbers and confident decisions — no more messy notebooks.",
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
      "Let your customers order without waiting for a waiter. With Savoria, diners scan a QR code at the table, pick what they want from your menu, and pay however is easiest — bank transfer, e-wallet, or cash. Orders flow straight to your staff, and your dashboard tracks revenue, manages multiple branches, and shows you what's working. It's a smoother, faster experience for guests and far less chaos for your team.",
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
      "Sometimes the best gift isn't something you buy — it's something you say. Word Love Code lets you turn heartfelt messages, poems, and quotes into beautiful, personalized digital gifts for the people you love. Craft it in minutes, share it with a link, and watch it come to life. Perfect for anniversaries, birthdays, or just to make someone's day brighter.",
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
      "Showcase your products online without the hassle of a full storefront. On this online store, you add your products, and when a customer taps one, they're sent straight to where they can buy it — your marketplace listing. It's a clean, simple way to put your catalog in front of people and turn interest into sales, in just a few clicks.",
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
      "Need a QR code for your menu, business card, event, or promotion? This free tool creates custom QR codes in seconds — no sign-up, no cost, no fuss. Generate one for any link or occasion and share it instantly. Clean, fast, and completely open source, so anyone can use it.",
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
      "Send a little holiday magic. This delightful website is a festive Christmas experience you can share with anyone — a beautifully decorated tree, twinkling ornaments, and a warm dose of seasonal cheer. It's a charming digital greeting that sparks a smile and brightens the season for friends, family, and customers.",
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
    description: `Love is best when it's shared in a way that's truly personal. Flowers for Someone lets you create a beautiful digital bouquet — complete with flowers, colors, and a heartfelt message — and send it to someone special in seconds. Whether it's a special occasion or simply "thinking of you," it's a quick, touching gift that always hits the heart. No delivery fees, no waiting, just instant warmth.`,
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
    description: `Want to serve more customers without adding more staff? This café app makes ordering effortless. Customers scan a QR code right from their table, pick their drinks and food, and orders reach your team instantly — cutting out queues, misheard orders, and lost time. Your staff works smoother, your guests are served faster, and your café simply runs better.`,
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
    description: `Taking attendance at a school doesn't have to mean calling out names for ten minutes. Padepokan lets students check in simply by scanning a QR code, instantly recording who's present — no paperwork, no wasting class time. Teachers and administrators get a clear, real-time view of attendance, so tracking who showed up becomes effortless and accurate.`,
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
    description: `Wondering who's actually in the office today? Presence makes company attendance dead simple. Employees clock in from their phone, and managers instantly see who's present, late, or away — without chasing paperwork or dealing with messy sign-in sheets. It saves time, removes guesswork, and keeps your team's working hours clear and organized.`,
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
    description: `Your talent deserves a first impression that wows. BBY Interior's portfolio website presents design work and skills with elegance, guiding visitors through beautiful visuals and a smooth, easy-to-navigate experience. Every detail is crafted to highlight what makes the work unique — so clients instantly see the quality and want to get in touch.`,
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
    description: `Your restaurant deserves to be found online. KORARIA gives your business a polished, attractive website that shows your full menu and products in a way that makes mouths water. Whether customers are choosing where to eat or checking you out for the first time, a strong online presence turns hungry browsers into paying diners.`,
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
    description: `This portfolio website is where it all began — a clean, modern showcase of skills, projects, and achievements built to leave a strong professional impression. It presents who you are, what you've done, and how to reach you, all in an engaging, mobile-friendly design. (This is an older version; the current site is the one you're looking at now.)`,
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
    description: `Make a company that means business. Lunar UX gives your company a professional online profile that explains who you are, what you offer, and how to get in touch — all in a polished, easy-to-browse design. It's the modern, credible first impression that helps potential clients and partners take you seriously from the very first click.`,
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
    description: `Turn your shop into an online store that sells around the clock. Hardware Harmony showcases your products in an attractive, easy-to-browse layout designed to catch the eye and encourage purchases. Whether customers are on a phone or computer, they get a smooth shopping experience — so you reach more buyers and boost sales without opening a physical location.`,
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
