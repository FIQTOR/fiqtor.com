// Import icons from the icons directory
import type { ComponentType } from "react";
import type { Language } from "@/i18n/translations";
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

// Localizable string, keyed by language code.
export type LocalizedText = Record<Language, string>;

// Define the Project type interface
// title: Name of the project (per language)
// category: Main category of the project
// description: Brief explanation of the project (per language)
// urlDirect: Optional live demo URL
// srcImage: Path to project screenshot/image (used as the cover image)
// images: Optional array of extra screenshots to render as a gallery in the modal
//         (if omitted, only srcImage is shown)
// tags: Optional array of project categories/keywords (per language)
// icons: Array of technology icons used in the project
export type Project = {
  title: LocalizedText;
  category: ProjectCategory;
  description: LocalizedText;
  urlDirect?: string;
  srcImage: string;
  images?: Array<string>;
  tags?: Record<Language, Array<string>>;
  icons: Array<Icon>;
};

// Export array of projects data
export const Projects: Array<Project> = [
  {
    title: {
      en: "IARTY Ecosystem - Business Core",
      id: "Ekosistem IARTY - Inti Bisnis",
    },
    category: "Business System",
    description: {
      en: "Imagine having one place that takes care of almost everything your business needs — online courses, smart AI-powered investment tools, and a digital store, all under one roof. That's Iarty. No more juggling a dozen different apps that don't talk to each other. We also build custom applications tailored to how your business actually works, so you can serve customers faster, save time, and grow your business — without ever needing to understand the technology behind it.",
      id: "Bayangkan punya satu tempat yang menangani hampir semua kebutuhan bisnis Anda — kursus online, alat investasi pintar bertenaga AI, dan toko digital, semuanya dalam satu atap. Itulah Iarty. Tak perlu lagi mencampur aduk belasan aplikasi yang tidak saling terhubung. Kami juga membuat aplikasi khusus sesuai cara kerja bisnis Anda, agar Anda bisa melayani pelanggan lebih cepat, menghemat waktu, dan menumbuhkan usaha — tanpa perlu memahami teknologi di baliknya.",
    },
    urlDirect: "https://iarty.biz.id",
    srcImage: "img/projects/iarty.webp",
    tags: {
      en: ["Ecosystem", "AI Integration", "Business Growth", "EdTech"],
      id: ["Ekosistem", "Integrasi AI", "Pertumbuhan Bisnis", "EdTech"],
    },
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
    title: {
      en: "Enterprise Suite - Full ERP Platform",
      id: "Enterprise Suite - Platform ERP Lengkap",
    },
    category: "Business System",
    description: {
      en: "Does running your business feel messy because your sales, stock, money, and staff records are scattered across notebooks and dozens of spreadsheets? Enterprise Suite brings everything into one simple screen. Instantly see today's sales, warehouse stock, who owes you money, employee salaries, and your real profit — all updated automatically in real time. No more manual counting, no more fear of costly mistakes. Just open the app and the entire health of your business is laid out clearly at a glance.",
      id: "Apakah bisnis Anda terasa berantakan karena catatan penjualan, stok, uang, dan karyawan tersebar di buku catatan dan puluhan spreadsheet? Enterprise Suite menyatukan semuanya dalam satu layar sederhana. Lihat seketika penjualan hari ini, stok gudang, siapa yang berutang, gaji karyawan, dan laba riil Anda — semua diperbarui otomatis secara real-time. Tak perlu lagi menghitung manual, tak perlu takut salah yang mahal. Cukup buka aplikasi dan kesehatan bisnis Anda tersaji jelas dalam sekejap.",
    },
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
    tags: {
      en: ["ERP", "Multi-Tenancy", "Accounting", "Inventory", "HR & Payroll", "CRM", "Reporting"],
      id: ["ERP", "Multi-Tenancy", "Akuntansi", "Inventaris", "HR & Payroll", "CRM", "Pelaporan"],
    },
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
    title: {
      en: "CRM Panel - Auth, RBAC & Sales CRM Suite",
      id: "CRM Panel - Autentikasi, RBAC & Suite CRM Penjualan",
    },
    category: "Business System",
    description: {
      en: "Is your sales team constantly losing track of potential buyers? CRM Panel keeps every customer and prospect in one place, so no lead ever slips through the cracks. See who is most likely to buy, get reminders to follow up on time, and track which salesperson is performing best this month — all without complicated charts. It's protected with layers of security, so only the right people can see sensitive information, wrapped in a clean, modern design that's genuinely pleasant to use every day. Perfect for businesses that want sales that are organized, predictable, and easy to measure.",
      id: "Apakah tim penjualan Anda sering kehilangan jejak calon pembeli? CRM Panel menyimpan setiap pelanggan dan prospek di satu tempat, sehingga tidak ada peluang yang terlewat. Lihat siapa yang paling mungkin membeli, dapatkan pengingat untuk menindaklanjuti tepat waktu, dan pantau siapa penjual terbaik bulan ini — tanpa grafik yang rumit. Dilindungi berlapis keamanan, hanya orang yang tepat yang bisa melihat informasi sensitif, dibungkus desain modern yang nyaman dipakai setiap hari. Sempurna untuk bisnis yang ingin penjualan tertata, terprediksi, dan mudah diukur.",
    },
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
    tags: {
      en: ["CRM", "RBAC", "Auth & 2FA", "Sales Pipeline", "Lead Scoring", "Multi-Tenancy", "Audit Log", "Analytics"],
      id: ["CRM", "RBAC", "Autentikasi & 2FA", "Pipeline Penjualan", "Penilaian Prospek", "Multi-Tenancy", "Log Audit", "Analitik"],
    },
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
    title: {
      en: "HRIS - Universal Human Resource System",
      id: "HRIS - Sistem SDM Universal",
    },
    category: "Business System",
    description: {
      en: "Managing people — attendance, leave, salaries, contracts, and hiring — can be a nightmare when it's all done by hand. HRIS solves it in a single app that fits any type of business: factories, hospitals, schools, and service companies alike. Employees can clock in from their phone, request leave themselves, and view their payslips without lining up at HR. Owners can see payroll, attendance, and headcount reports in seconds. The result: HR work that's dramatically faster, accurate, and free from the drama of payroll mistakes.",
      id: "Mengelola orang — absensi, cuti, gaji, kontrak, dan rekrutmen — bisa jadi mimpi buruk jika dilakukan manual. HRIS menyelesaikannya dalam satu aplikasi yang cocok untuk berbagai jenis bisnis: pabrik, rumah sakit, sekolah, maupun perusahaan jasa. Karyawan bisa absen dari ponsel, mengajukan cuti sendiri, dan melihat slip gaji tanpa antre di HR. Pemilik bisa melihat laporan gaji, kehadiran, dan jumlah karyawan dalam hitungan detik. Hasilnya: pekerjaan HR jauh lebih cepat, akurat, dan bebas drama kesalahan penggajian.",
    },
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
    tags: {
      en: ["HRIS", "Payroll", "Attendance", "Leave Management", "Recruitment", "Performance", "Self-Service", "Multi-Tenancy", "RBAC", "Analytics"],
      id: ["HRIS", "Penggajian", "Absensi", "Manajemen Cuti", "Rekrutmen", "Performa", "Layanan Mandiri", "Multi-Tenancy", "RBAC", "Analitik"],
    },
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
    title: {
      en: "IHS E-School - School Management & LMS",
      id: "IHS E-School - Manajemen Sekolah & LMS",
    },
    category: "Business System",
    description: {
      en: "Running a school by hand — new student admissions, attendance, grades, tuition fees, and announcements to parents — is exhausting. IHS E-School brings it all into one connected platform. New students can apply online, teachers record attendance and grades in seconds, parents can follow their child's progress right from their phone, and the school manages payments and announcements automatically. It even includes an online classroom for students. In short: school administration becomes tidy, transparent, and time-saving for teachers, students, and parents alike.",
      id: "Mengelola sekolah secara manual — pendaftaran siswa baru, absensi, nilai, uang sekolah, dan pengumuman ke orang tua — sungguh melelahkan. IHS E-School menyatukan semuanya dalam satu platform terhubung. Siswa baru bisa mendaftar online, guru mencatat absensi dan nilai dalam hitungan detik, orang tua bisa mengikuti perkembangan anak langsung dari ponsel, dan sekolah mengelola pembayaran serta pengumuman secara otomatis. Bahkan ada ruang kelas online untuk siswa. Singkatnya: administrasi sekolah jadi rapi, transparan, dan hemat waktu bagi guru, siswa, maupun orang tua.",
    },
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
    tags: {
      en: ["School Management", "LMS", "Admissions (PPDB)", "CBT Exams", "Attendance", "Finance & Billing", "Feature Flags", "Parent Portal", "RBAC"],
      id: ["Manajemen Sekolah", "LMS", "Penerimaan Siswa (PPDB)", "Ujian CBT", "Absensi", "Keuangan & Tagihan", "Feature Flags", "Portal Orang Tua", "RBAC"],
    },
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
    title: {
      en: "Golden Dragon - Restaurant QR Ordering App",
      id: "Golden Dragon - Aplikasi Pesan QR Restoran",
    },
    category: "Business System",
    description: {
      en: "Tired of waiters running back and forth and customers waiting forever to order? Golden Dragon lets your diners simply scan a QR code on the table, browse your full menu, and order and pay right from their own phone. Orders appear instantly on your kitchen and cashier screens, so nothing gets lost and nobody has to shout across the room. Customers can pay online through QRIS, bank transfer, e-wallet, or card — or settle at the cashier. Behind the scenes, you get a full dashboard to manage your menu, generate table QR codes, watch live orders, and track your best-selling dishes. Fewer mistakes, faster service, happier customers.",
      id: "Lelah para pelayan mondar-mandir dan pelanggan menunggu lama untuk memesan? Golden Dragon membuat pelanggan cukup memindai kode QR di meja, menjelajahi menu lengkap, lalu memesan dan membayar langsung dari ponsel mereka. Pesanan muncul seketika di layar dapur dan kasir, sehingga tak ada yang terlewat dan tak perlu berteriak di ruangan. Pelanggan bisa membayar online lewat QRIS, transfer bank, e-wallet, atau kartu — atau bayar di kasir. Di balik layar, Anda mendapat dasbor lengkap untuk mengelola menu, membuat kode QR meja, memantau pesanan langsung, dan melacak menu terlaris. Lebih sedikit kesalahan, pelayanan lebih cepat, pelanggan lebih senang.",
    },
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
    tags: {
      en: ["Restaurant", "QR Menu", "Self-Ordering", "Midtrans Payment", "WhatsApp Verification", "Realtime SSE", "Admin Dashboard", "RBAC"],
      id: ["Restoran", "Menu QR", "Pesan Mandiri", "Pembayaran Midtrans", "Verifikasi WhatsApp", "Realtime SSE", "Dasbor Admin", "RBAC"],
    },
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
    title: {
      en: "WhatsApp Automation - AI Chatbot",
      id: "Otomasi WhatsApp - Chatbot AI",
    },
    category: "AI & Automation",
    description: {
      en: "What if your business could reply to every customer on WhatsApp — instantly, day or night — without hiring anyone? This AI assistant answers questions, shares product info, takes orders, and guides customers automatically, so you never miss a sale because you were too busy or asleep. It plugs into the way your business already works, giving you 24/7 support, lightning-fast replies, and customers who feel cared for. Think of it as a tireless team member who never takes a day off.",
      id: "Bagaimana jika bisnis Anda bisa membalas setiap pelanggan di WhatsApp — seketika, siang maupun malam — tanpa menyewa siapa pun? Asisten AI ini menjawab pertanyaan, membagikan info produk, menerima pesanan, dan memandu pelanggan secara otomatis, sehingga Anda tak pernah kehilangan penjualan karena terlalu sibuk atau tertidur. Ia terhubung dengan cara kerja bisnis Anda, memberi dukungan 24/7, balasan super cepat, dan pelanggan yang merasa diperhatikan. Anggap saja sebagai anggota tim tak kenal lelah yang tak pernah libur.",
    },
    srcImage: "img/projects/whatsapp-automation.webp",
    tags: {
      en: ["AI Chatbot", "Customer Support", "Business Automation"],
      id: ["Chatbot AI", "Dukungan Pelanggan", "Otomasi Bisnis"],
    },
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
    title: {
      en: "IARTY AI (Third Party) - Multiple AI Models",
      id: "IARTY AI (Pihak Ketiga) - Beragam Model AI",
    },
    category: "AI & Automation",
    description: {
      en: "Meet your all-in-one AI assistant. Instead of juggling several subscriptions, IARTY AI lets you chat with 50+ different AI brains — including GPT and DeepSeek — inside one single conversation, and even switch between them mid-chat. Bring your own key or use the built-in free credits. Whether you need help writing, planning a project, thinking through a tricky problem, or analyzing the US stock and crypto markets, it's all here in one powerful, portable tool. Your conversations can even be exported and moved anywhere, so your ideas are never locked in.",
      id: "Temui asisten AI serba bisa Anda. Alih-alih mengelola beberapa langganan, IARTY AI memungkinkan Anda mengobrol dengan 50+ otak AI berbeda — termasuk GPT dan DeepSeek — dalam satu percakapan, bahkan berpindah di tengah obrolan. Bawa kunci API Anda sendiri atau gunakan kredit gratis bawaan. Perlu bantuan menulis, merencanakan proyek, memikirkan masalah rumit, atau menganalisis pasar saham AS dan kripto, semuanya ada dalam satu alat portabel yang kuat. Percakapan Anda bahkan bisa diekspor dan dipindahkan ke mana saja, jadi ide Anda tak pernah terkunci.",
    },
    urlDirect: "https://ai.iarty.biz.id",
    srcImage: "img/projects/iarty-ai.webp",
    tags: {
      en: ["AI Chat", "Multi-AI", "Productivity Tool"],
      id: ["Obrolan AI", "Multi-AI", "Alat Produktivitas"],
    },
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
    title: {
      en: "AI Marketplace - Find the best prompts for your project",
      id: "Marketplace AI - Temukan prompt terbaik untuk proyek Anda",
    },
    category: "E-Commerce",
    description: {
      en: "Why start from scratch when the perfect ready-made solution already exists? This marketplace is a one-stop shop for AI-powered tools and templates that save you time and money. Browse, pick, and instantly put them to work for your project — whether you're running a business, creating content, or building something new. No technical know-how required.",
      id: "Kenapa mulai dari nol jika solusi siap pakai yang sempurna sudah ada? Marketplace ini adalah pusat serba ada untuk alat dan template bertenaga AI yang menghemat waktu dan uang Anda. Telusuri, pilih, dan langsung pakai untuk proyek Anda — baik Anda menjalankan bisnis, membuat konten, atau membangun sesuatu yang baru. Tak perlu keahlian teknis.",
    },
    urlDirect: "https://marketplace.iarty.biz.id",
    srcImage: "img/projects/iarty-ai-marketplace.webp",
    tags: {
      en: ["AI Marketplace", "Business", "AI Tools"],
      id: ["Marketplace AI", "Bisnis", "Alat AI"],
    },
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
    title: {
      en: "Zantova App - UI Marketplace",
      id: "Zantova App - Marketplace UI",
    },
    category: "E-Commerce",
    description: {
      en: "Building a good-looking website usually costs a fortune and takes months. Zantova changes that. It's a marketplace where you can grab beautiful, ready-to-use website designs and building blocks, then plug them straight into your project. Whether you're a business owner wanting a polished site or a creator assembling something special, you get a professional result in a fraction of the time and cost — no design team required.",
      id: "Membangun situs yang enak dilihat biasanya mahal dan memakan waktu berbulan-bulan. Zantova mengubah itu. Ini marketplace tempat Anda bisa mengambil desain dan komponen situs yang indah dan siap pakai, lalu memasangnya langsung ke proyek Anda. Baik Anda pemilik bisnis yang ingin situs rapi maupun kreator yang merangkai sesuatu istimewa, Anda mendapat hasil profesional dalam sebagian kecil waktu dan biaya — tanpa perlu tim desain.",
    },
    urlDirect: "https://zantova.my.id",
    srcImage: "img/projects/zantova.webp",
    tags: {
      en: ["Webstie", "UI Design", "Marketplace"],
      id: ["Situs Web", "Desain UI", "Marketplace"],
    },
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
    title: {
      en: "Particle Handtracker - Powered by OpenCV",
      id: "Particle Handtracker - Didukung OpenCV",
    },
    category: "Creative",
    description: {
      en: "Imagine controlling a colorful world of floating particles just by moving your hands in front of your camera — no mouse, no controller. This playful experiment tracks your hand movements in real time and turns them into dazzling visual effects. It's a fun, hands-on glimpse of how computers can understand people without any special equipment, and a taste of the interactive experiences technology can create.",
      id: "Bayangkan mengendalikan dunia partikel berwarna yang melayang hanya dengan menggerakkan tangan di depan kamera — tanpa mouse, tanpa kontroler. Eksperimen menyenangkan ini melacak gerakan tangan Anda secara real-time dan mengubahnya menjadi efek visual yang memukau. Ini sekilas pengalaman interaktif yang bisa diciptakan teknologi, dan bagaimana komputer dapat memahami manusia tanpa perangkat khusus.",
    },
    srcImage: "img/projects/particle-handtracker.webp",
    urlDirect: "https://particle-handtracker.vercel.app/",
    tags: {
      en: ["Gesture Recognition", "Real-Time Interaction", "Particle Systems"],
      id: ["Pengenalan Gestur", "Interaksi Real-Time", "Sistem Partikel"],
    },
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
    title: {
      en: "Djoyo Florist - Selling Sign With Flowers",
      id: "Djoyo Florist - Jual Kesan dengan Bunga",
    },
    category: "Landing Page",
    description: {
      en: "Whether it's a wedding, a graduation, a birthday, or a moment of condolence, the right flowers say what words cannot. Djoyo Florist's website makes ordering beautiful bouquets, flower boards, and event decorations effortless. Browse the full catalog of arrangements, see exactly what's available for every occasion, and reach out directly to place an order in seconds. It's the friendly online face of a trusted florist — helping customers find the perfect gift without a single phone call or store visit.",
      id: "Entah itu pernikahan, kelulusan, ulang tahun, atau momen belasungkawa, bunga yang tepat menyampaikan apa yang tak terucap. Situs Djoyo Florist memudahkan pemesanan buket, papan bunga, dan dekorasi acara. Telusuri katalog rangkaian lengkap, lihat apa saja yang tersedia untuk setiap kesempatan, dan hubungi langsung untuk memesan dalam hitungan detik. Ini wajah online yang ramah dari florist terpercaya — membantu pelanggan menemukan hadiah sempurna tanpa perlu menelepon atau datang ke toko.",
    },
    srcImage: "img/projects/djoyo-florist.webp",
    urlDirect: "https://djoyoflorist.com/",
    tags: {
      en: ["Customer Helper", "Wedding Decoration"],
      id: ["Asisten Pelanggan", "Dekorasi Pernikahan"],
    },
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
    title: {
      en: "IARTY Analytics for IG & TikTok",
      id: "IARTY Analytics untuk IG & TikTok",
    },
    category: "Web App",
    description: {
      en: "Ever wondered who's actually following you back on Instagram or TikTok — and how many aren't? IARTY Analytics tells you in seconds. Simply connect your account and instantly see exactly which accounts don't follow you back and which ones you've stopped following. No guessing, no scrolling through endless lists by hand. It gives you clear, honest insight into your social connections, so you can decide what to do next with total confidence.",
      id: "Pernah penasaran siapa yang benar-benar mengikuti balik Anda di Instagram atau TikTok — dan berapa yang tidak? IARTY Analytics memberitahu Anda dalam hitungan detik. Cukup hubungkan akun Anda dan lihat langsung akun mana yang tidak mengikuti balik dan mana yang sudah berhenti Anda ikuti. Tak perlu menebak, tak perlu menggulir daftar panjang secara manual. Ini memberi Anda wawasan yang jernih dan jujur tentang koneksi sosial Anda, sehingga Anda bisa memutuskan langkah berikutnya dengan percaya diri.",
    },
    urlDirect: "https://analytics.iarty.biz.id",
    srcImage: "img/projects/iarty-analytics.webp",
    tags: {
      en: ["Analytics", "Social Media", "Web App"],
      id: ["Analitik", "Media Sosial", "Aplikasi Web"],
    },
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
    title: {
      en: "IARTY Education - Open courses for upskilling",
      id: "IARTY Education - Kursus terbuka untuk peningkatan keterampilan",
    },
    category: "Web App",
    description: {
      en: "Want to learn a new skill but don't know where to start? IARTY Education is an online learning platform built to make education feel simple and enjoyable. Well-organized lessons and crystal-clear HD video courses let you master new abilities at your own pace, from anywhere. The clean, modern interface makes studying painless — no confusing menus, no wasted time. Just log in, pick a course, and start leveling up.",
      id: "Ingin mempelajari keterampilan baru tapi bingung mulai dari mana? IARTY Education adalah platform pembelajaran online yang membuat pendidikan terasa sederhana dan menyenangkan. Pelajaran tersusun rapi dan video kursus HD yang jernih memungkinkan Anda menguasai kemampuan baru sesuai tempo Anda, dari mana saja. Antarmuka modern yang bersih membuat belajar tanpa beban — tanpa menu membingungkan, tanpa membuang waktu. Cukup masuk, pilih kursus, dan mulai tingkatkan diri.",
    },
    urlDirect: "https://education.iarty.biz.id",
    srcImage: "img/projects/iarty-education.webp",
    tags: {
      en: ["E-Learning", "Video Course", "Education"],
      id: ["E-Learning", "Kursus Video", "Pendidikan"],
    },
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
    title: {
      en: "Sigma Teknik - Air Conditioner Service",
      id: "Sigma Teknik - Servis Air Conditioner",
    },
    category: "Landing Page",
    description: {
      en: "When your AC breaks in the middle of a heatwave, you don't want to hunt for a number — you want help fast. Sigma Teknik's website makes it easy to find a trusted cooling technician. See the full range of services (air conditioners, refrigerators, and more), browse real photos of completed jobs, check the company's credentials and location, and tap one button to chat on WhatsApp. It's a professional, reassuring online presence that turns a stressful repair into a simple message.",
      id: "Saat AC Anda rusak di tengah cuaca panas, Anda tak ingin mencari-cari nomor — Anda ingin bantuan cepat. Situs Sigma Teknik memudahkan menemukan teknisi pendingin terpercaya. Lihat ragam layanan (AC, kulkas, dan lainnya), telusuri foto nyata hasil pekerjaan, cek kredibilitas dan lokasi perusahaan, dan ketuk satu tombol untuk mengobrol di WhatsApp. Ini kehadiran online yang profesional dan menenangkan yang mengubah perbaikan yang menegangkan menjadi pesan singkat.",
    },
    srcImage: "img/projects/sigma-teknik-ac.webp",
    urlDirect: "https://www.mojokertoac.com/",
    tags: {
      en: ["Customer Helper", "Air Conditioner Service"],
      id: ["Asisten Pelanggan", "Servis AC"],
    },
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
    title: {
      en: "Template Coffee Shop Surabaya",
      id: "Template Coffee Shop Surabaya",
    },
    category: "Template",
    description: {
      en: "Give your coffee shop a website as welcoming as your café. This ready-made template shows off your complete menu with tempting product photos, tells customers where to find you, and lets them message you on WhatsApp with a single tap. Ideal for coffee businesses that want to look neat, credible, and professional — without spending a fortune or waiting weeks. Only Rp300,000.",
      id: "Berikan kedai kopi Anda situs sehangat kafenya. Template siap pakai ini menampilkan menu lengkap dengan foto produk menggiurkan, memberi tahu pelanggan lokasi Anda, dan membuat mereka bisa mengirim pesan di WhatsApp dengan satu ketukan. Ideal untuk bisnis kopi yang ingin tampil rapi, kredibel, dan profesional — tanpa mengeluarkan banyak biaya atau menunggu berminggu-minggu. Hanya Rp300.000.",
    },
    srcImage: "img/projects/cshop-surabaya.webp",
    urlDirect: "https://template-cshop-surabaya.vercel.app/",
    tags: {
      en: ["Coffee Shop", "Customer Helper"],
      id: ["Kedai Kopi", "Asisten Pelanggan"],
    },
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
    title: {
      en: "Template Coffee Shop Space",
      id: "Template Coffee Shop Space",
    },
    category: "Template",
    description: {
      en: "Make your café feel ahead of its time. This modern template displays your menu and prices, showcases your drinks and food with attractive photos, shares your location, and lets customers reach you instantly on WhatsApp. Perfect for coffee shops that want a fresh, futuristic vibe that still feels friendly and easy to use. Only Rp300,000.",
      id: "Buat kafe Anda terasa mendahului zamannya. Template modern ini menampilkan menu dan harga, memamerkan minuman dan makanan dengan foto menarik, membagikan lokasi Anda, dan membuat pelanggan menghubungi Anda seketika di WhatsApp. Sempurna untuk kedai kopi yang menginginkan nuansa segar dan futuristik yang tetap terasa ramah dan mudah digunakan. Hanya Rp300.000.",
    },
    srcImage: "img/projects/cshop-space.webp",
    urlDirect: "https://template-cshop-space.vercel.app/",
    tags: {
      en: ["Coffee Shop", "Customer Helper"],
      id: ["Kedai Kopi", "Asisten Pelanggan"],
    },
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
    title: {
      en: "Template Coffee Shop Retro",
      id: "Template Coffee Shop Retro",
    },
    category: "Template",
    description: {
      en: "Stand out with a café website that feels warm, unique, and full of character. This retro-style template presents your menu of drinks and food, shows customers where to find you, and includes a WhatsApp button for orders or reservations. Ideal for cafés that want a memorable, nostalgic look that guests instantly love. Only Rp300,000.",
      id: "Menonjollah dengan situs kafe yang terasa hangat, unik, dan penuh karakter. Template bergaya retro ini menyajikan menu minuman dan makanan, menunjukkan lokasi Anda, dan menyertakan tombol WhatsApp untuk pesanan atau reservasi. Ideal untuk kafe yang menginginkan tampilan nostalgik yang langsung disukai pengunjung. Hanya Rp300.000.",
    },
    srcImage: "img/projects/cshop-retro.webp",
    urlDirect: "https://template-cshop-retro.vercel.app/",
    tags: {
      en: ["Coffee Shop", "Customer Helper"],
      id: ["Kedai Kopi", "Asisten Pelanggan"],
    },
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
    title: {
      en: "Store Management System - IARTY MODULeF",
      id: "Sistem Manajemen Toko - IARTY MODULeF",
    },
    category: "Business System",
    description: {
      en: "Running a grocery store means keeping track of a hundred things at once — and losing count costs real money. This system handles it all for you: what comes in, what goes out, daily spending, daily income, and cashier transactions, all recorded in one place. It even shows you simple analytics so you can spot what's selling and what's not. The result is a store that runs smoothly, with clear numbers and confident decisions — no more messy notebooks.",
      id: "Mengelola toko kelontong berarti mengurus ratusan hal sekaligus — dan salah hitung berarti kerugian nyata. Sistem ini menangani semuanya untuk Anda: apa yang masuk, apa yang keluar, pengeluaran harian, pemasukan harian, dan transaksi kasir, semua tercatat di satu tempat. Ia bahkan menampilkan analitik sederhana agar Anda bisa melihat apa yang laku dan tidak. Hasilnya toko yang berjalan lancar, dengan angka jelas dan keputusan yang percaya diri — tak ada lagi buku catatan berantakan.",
    },
    srcImage: "img/projects/iarty-modulef-store_management_system.webp",
    tags: {
      en: ["Store Management", "Business Analytics", "Income Tracking", "Inventory Management"],
      id: ["Manajemen Toko", "Analitik Bisnis", "Pelacakan Pendapatan", "Manajemen Inventaris"],
    },
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
    title: {
      en: "Savoria Online Order Restaurant - IARTY MODULeF",
      id: "Savoria Pesan Online Restoran - IARTY MODULeF",
    },
    category: "Business System",
    description: {
      en: "Let your customers order without waiting for a waiter. With Savoria, diners scan a QR code at the table, pick what they want from your menu, and pay however is easiest — bank transfer, e-wallet, or cash. Orders flow straight to your staff, and your dashboard tracks revenue, manages multiple branches, and shows you what's working. It's a smoother, faster experience for guests and far less chaos for your team.",
      id: "Biarkan pelanggan memesan tanpa menunggu pelayan. Dengan Savoria, pengunjung memindai kode QR di meja, memilih dari menu Anda, dan membayar dengan cara termudah — transfer bank, e-wallet, atau tunai. Pesanan langsung mengalir ke staf Anda, dan dasbor melacak pendapatan, mengelola banyak cabang, dan menunjukkan apa yang berhasil. Pengalaman yang lebih mulus dan cepat bagi tamu, dan jauh lebih sedikit kekacauan bagi tim Anda.",
    },
    srcImage: "img/projects/iarty-modulef-savoria_online_order_restaurant.webp",
    tags: {
      en: ["Restaurant Management", "Staff Management", "Branch Management", "Online Order", "Online Payment", "Business Analytics"],
      id: ["Manajemen Restoran", "Manajemen Staf", "Manajemen Cabang", "Pesan Online", "Pembayaran Online", "Analitik Bisnis"],
    },
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
    title: {
      en: "Word Love Code - Gift Website",
      id: "Word Love Code - Situs Hadiah",
    },
    category: "Creative",
    description: {
      en: "Sometimes the best gift isn't something you buy — it's something you say. Word Love Code lets you turn heartfelt messages, poems, and quotes into beautiful, personalized digital gifts for the people you love. Craft it in minutes, share it with a link, and watch it come to life. Perfect for anniversaries, birthdays, or just to make someone's day brighter.",
      id: "Kadang hadiah terbaik bukanlah yang Anda beli — melainkan yang Anda ucapkan. Word Love Code memungkinkan Anda mengubah pesan tulus, puisi, dan kutipan menjadi hadiah digital yang indah dan personal untuk orang yang Anda cintai. Rakit dalam beberapa menit, bagikan lewat tautan, dan saksikan ia hidup. Sempurna untuk ulang tahun pernikahan, ulang tahun, atau sekadar membuat hari seseorang lebih cerah.",
    },
    urlDirect: "https://word-love-code.vercel.app/",
    srcImage: "img/projects/world-love-code.webp",
    tags: {
      en: ["Gift", "Love", "Personalized", "Web Development"],
      id: ["Hadiah", "Cinta", "Personalisasi", "Pengembangan Web"],
    },
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
    title: {
      en: "Online Store - IARTY ModuleF",
      id: "Toko Online - IARTY ModuleF",
    },
    category: "E-Commerce",
    description: {
      en: "Showcase your products online without the hassle of a full storefront. On this online store, you add your products, and when a customer taps one, they're sent straight to where they can buy it — your marketplace listing. It's a clean, simple way to put your catalog in front of people and turn interest into sales, in just a few clicks.",
      id: "Pamerkan produk Anda secara online tanpa repot membuat toko penuh. Di toko online ini, Anda menambahkan produk, dan saat pelanggan mengetuknya, mereka langsung diarahkan ke tempat mereka bisa membelinya — listing marketplace Anda. Cara yang bersih dan sederhana untuk menampilkan katalog Anda dan mengubah minat menjadi penjualan, hanya dalam beberapa klik.",
    },
    srcImage: "img/projects/online-store-modulef.webp",
    tags: {
      en: ["Online Store", "E-Commerce"],
      id: ["Toko Online", "E-Commerce"],
    },
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
    title: {
      en: "QR Code Generator - Open Source",
      id: "Pembuat Kode QR - Open Source",
    },
    category: "Web App",
    description: {
      en: "Need a QR code for your menu, business card, event, or promotion? This free tool creates custom QR codes in seconds — no sign-up, no cost, no fuss. Generate one for any link or occasion and share it instantly. Clean, fast, and completely open source, so anyone can use it.",
      id: "Butuh kode QR untuk menu, kartu nama, acara, atau promosi? Alat gratis ini membuat kode QR kustom dalam hitungan detik — tanpa daftar, tanpa biaya, tanpa ribet. Buat untuk tautan atau kesempatan apa pun dan bagikan seketika. Bersih, cepat, dan sepenuhnya open source, jadi siapa saja bisa menggunakannya.",
    },
    urlDirect: "https://qrcode.fiqtor.com",
    srcImage: "img/projects/qrcode-generator.webp",
    tags: {
      en: ["Web Application", "QR Code", "ReactJS", "TailwindCSS"],
      id: ["Aplikasi Web", "Kode QR", "ReactJS", "TailwindCSS"],
    },
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
    title: {
      en: "Merry Christmas Tree - Gift Website",
      id: "Merry Christmas Tree - Situs Hadiah",
    },
    category: "Creative",
    description: {
      en: "Send a little holiday magic. This delightful website is a festive Christmas experience you can share with anyone — a beautifully decorated tree, twinkling ornaments, and a warm dose of seasonal cheer. It's a charming digital greeting that sparks a smile and brightens the season for friends, family, and customers.",
      id: "Kirimkan sedikit keajaiban liburan. Situs menyenangkan ini adalah pengalaman Natal yang meriah untuk dibagikan kepada siapa saja — pohon berhias indah, ornamen berkelap-kelip, dan keceriaan musiman yang hangat. Ini sapaan digital yang menawan yang memancing senyum dan mencerahkan musim bagi teman, keluarga, dan pelanggan.",
    },
    urlDirect: "https://fiqtor.github.io/christmas-tree",
    srcImage: "img/projects/merry-christmas-tree.webp",
    tags: {
      en: ["Holiday Website", "Festive Decorations", "Seasonal Joy"],
      id: ["Situs Liburan", "Dekorasi Meriah", "Keceriaan Musiman"],
    },
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
    title: {
      en: "Flowers For Someone - Gift Website (Popular)",
      id: "Flowers For Someone - Situs Hadiah (Populer)",
    },
    category: "Creative",
    description: {
      en: "Love is best when it's shared in a way that's truly personal. Flowers for Someone lets you create a beautiful digital bouquet — complete with flowers, colors, and a heartfelt message — and send it to someone special in seconds. Whether it's a special occasion or simply \"thinking of you,\" it's a quick, touching gift that always hits the heart. No delivery fees, no waiting, just instant warmth.",
      id: "Cinta paling indah saat dibagikan dengan cara yang benar-benar personal. Flowers for Someone memungkinkan Anda membuat buket digital yang cantik — lengkap dengan bunga, warna, dan pesan tulus — dan mengirimkannya ke orang istimewa dalam hitungan detik. Entah untuk kesempatan khusus atau sekadar \"aku sedang memikirkanmu\", ini hadiah cepat dan menyentuh yang selalu mengena di hati. Tanpa biaya kirim, tanpa menunggu, hanya kehangatan instan.",
    },
    urlDirect: "https://fiqtor.github.io/flowers-for-someone",
    srcImage: "/img/projects/flowers-for-someone.webp",
    tags: {
      en: ["Gift Website"],
      id: ["Situs Hadiah"],
    },
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
    title: {
      en: "Coffee Shop - QR Code & Web2.0",
      id: "Kedai Kopi - Kode QR & Web2.0",
    },
    category: "Business System",
    description: {
      en: "Want to serve more customers without adding more staff? This café app makes ordering effortless. Customers scan a QR code right from their table, pick their drinks and food, and orders reach your team instantly — cutting out queues, misheard orders, and lost time. Your staff works smoother, your guests are served faster, and your café simply runs better.",
      id: "Ingin melayani lebih banyak pelanggan tanpa menambah staf? Aplikasi kafe ini membuat pemesanan tanpa repot. Pelanggan memindai kode QR langsung dari meja, memilih minuman dan makanan, dan pesanan langsung sampai ke tim Anda — memangkas antrean, pesanan salah dengar, dan waktu terbuang. Staf bekerja lebih lancar, tamu dilayani lebih cepat, dan kafe Anda berjalan lebih baik.",
    },
    srcImage: "/img/projects/coffee-shop.webp",
    tags: {
      en: ["QR Code", "Web2.0", "AJAX"],
      id: ["Kode QR", "Web2.0", "AJAX"],
    },
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
    title: {
      en: "Padepokan App - LMS Website",
      id: "Padepokan App - Situs LMS",
    },
    category: "Web App",
    description: {
      en: "Taking attendance at a school doesn't have to mean calling out names for ten minutes. Padepokan lets students check in simply by scanning a QR code, instantly recording who's present — no paperwork, no wasting class time. Teachers and administrators get a clear, real-time view of attendance, so tracking who showed up becomes effortless and accurate.",
      id: "Mencatat kehadiran di sekolah tak harus berarti memanggil nama selama sepuluh menit. Padepokan membuat siswa cukup memindai kode QR untuk absen, langsung merekam siapa yang hadir — tanpa kertas, tanpa membuang waktu kelas. Guru dan administrator mendapat tampilan kehadiran real-time yang jelas, sehingga melacak siapa yang hadir menjadi mudah dan akurat.",
    },
    urlDirect: "https://padepokan.gaeni.org",
    srcImage: "/img/projects/padepokan-app.webp",
    tags: {
      en: ["EducationApp", "QR Code"],
      id: ["Aplikasi Pendidikan", "Kode QR"],
    },
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
    title: {
      en: "Presence App - LMS Website",
      id: "Presence App - Situs LMS",
    },
    category: "Web App",
    description: {
      en: "Wondering who's actually in the office today? Presence makes company attendance dead simple. Employees clock in from their phone, and managers instantly see who's present, late, or away — without chasing paperwork or dealing with messy sign-in sheets. It saves time, removes guesswork, and keeps your team's working hours clear and organized.",
      id: "Penasaran siapa yang benar-benar ada di kantor hari ini? Presence membuat absensi perusahaan sangat mudah. Karyawan absen dari ponsel, dan manajer langsung melihat siapa yang hadir, terlambat, atau tidak ada — tanpa mengejar kertas atau berurusan dengan daftar hadir berantakan. Ini menghemat waktu, menghilangkan dugaan, dan menjaga jam kerja tim Anda tetap jelas dan tertata.",
    },
    urlDirect: "https://presence.gaeni.org",
    srcImage: "/img/projects/presence-app.webp",
    tags: {
      en: ["RestAPI", "Performance", "EducationApp"],
      id: ["REST API", "Performa", "Aplikasi Pendidikan"],
    },
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
    title: {
      en: "BBY Interior - Architechture Design Service",
      id: "BBY Interior - Jasa Desain Arsitektur",
    },
    category: "Landing Page",
    description: {
      en: "Your talent deserves a first impression that wows. BBY Interior's portfolio website presents design work and skills with elegance, guiding visitors through beautiful visuals and a smooth, easy-to-navigate experience. Every detail is crafted to highlight what makes the work unique — so clients instantly see the quality and want to get in touch.",
      id: "Bakat Anda layak mendapat kesan pertama yang memukau. Situs portofolio BBY Interior menyajikan karya desain dan keahlian dengan elegan, memandu pengunjung melalui visual indah dan pengalaman yang mulus dan mudah dinavigasi. Setiap detail dirancang untuk menonjolkan keunikan karya — sehingga klien langsung melihat kualitasnya dan ingin menghubungi Anda.",
    },
    urlDirect: "https://bby-interior.vercel.app",
    srcImage: "/img/projects/bby.interior.webp",
    tags: {
      en: ["Portfolio", "Personal Branding", "Furniture"],
      id: ["Portofolio", "Personal Branding", "Furnitur"],
    },
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
    title: {
      en: "KORARIA - Restaurant Website",
      id: "KORARIA - Situs Restoran",
    },
    category: "Business System",
    description: {
      en: "Your restaurant deserves to be found online. KORARIA gives your business a polished, attractive website that shows your full menu and products in a way that makes mouths water. Whether customers are choosing where to eat or checking you out for the first time, a strong online presence turns hungry browsers into paying diners.",
      id: "Restoran Anda layak ditemukan secara online. KORARIA memberi bisnis Anda situs yang rapi dan menarik yang menampilkan menu dan produk lengkap dengan cara yang menggugah selera. Entah pelanggan sedang memilih tempat makan atau mengecek Anda pertama kali, kehadiran online yang kuat mengubah penjelajah yang lapar menjadi tamu yang membayar.",
    },
    srcImage: "/img/projects/koraria.webp",
    tags: {
      en: ["Restaurant", "AJAX", "RestAPI", "QRCode"],
      id: ["Restoran", "AJAX", "REST API", "Kode QR"],
    },
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
    title: {
      en: "Personal Website (v1.4)",
      id: "Situs Pribadi (v1.4)",
    },
    category: "Landing Page",
    description: {
      en: "This portfolio website is where it all began — a clean, modern showcase of skills, projects, and achievements built to leave a strong professional impression. It presents who you are, what you've done, and how to reach you, all in an engaging, mobile-friendly design. (This is an older version; the current site is the one you're looking at now.)",
      id: "Situs portofolio inilah tempat semuanya bermula — etalase bersih dan modern untuk keterampilan, proyek, dan pencapaian yang dirancang meninggalkan kesan profesional yang kuat. Ini menyajikan siapa Anda, apa yang telah Anda kerjakan, dan bagaimana menghubungi Anda, semua dalam desain yang menarik dan ramah ponsel. (Ini versi lama; situs yang sedang Anda lihat sekarang adalah versi terbarunya.)",
    },
    urlDirect: "https://fiqtor.com",
    srcImage: "/img/projects/personal-website.webp",
    tags: {
      en: ["Portfolio", "Personal Branding", "UI/UX"],
      id: ["Portofolio", "Personal Branding", "UI/UX"],
    },
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
    title: {
      en: "Lunar UX - Company Profile",
      id: "Lunar UX - Profil Perusahaan",
    },
    category: "Landing Page",
    description: {
      en: "Make a company that means business. Lunar UX gives your company a professional online profile that explains who you are, what you offer, and how to get in touch — all in a polished, easy-to-browse design. It's the modern, credible first impression that helps potential clients and partners take you seriously from the very first click.",
      id: "Buat perusahaan yang tampak serius. Lunar UX memberi perusahaan Anda profil online profesional yang menjelaskan siapa Anda, apa yang Anda tawarkan, dan bagaimana menghubungi Anda — semua dalam desain rapi yang mudah ditelusuri. Ini kesan pertama modern dan kredibel yang membantu calon klien dan mitra menanggapi Anda dengan serius sejak klik pertama.",
    },
    urlDirect: "https://lunar-ux.vercel.app",
    srcImage: "/img/projects/lunar-ux.webp",
    tags: {
      en: ["Comapny Profile", "Landing page"],
      id: ["Profil Perusahaan", "Landing Page"],
    },
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
    title: {
      en: "Hardware Harmony - Shop Website",
      id: "Hardware Harmony - Situs Toko",
    },
    category: "E-Commerce",
    description: {
      en: "Turn your shop into an online store that sells around the clock. Hardware Harmony showcases your products in an attractive, easy-to-browse layout designed to catch the eye and encourage purchases. Whether customers are on a phone or computer, they get a smooth shopping experience — so you reach more buyers and boost sales without opening a physical location.",
      id: "Ubah toko Anda menjadi toko online yang berjualan sepanjang waktu. Hardware Harmony memamerkan produk Anda dalam tata letak menarik yang mudah ditelusuri, dirancang untuk mencuri perhatian dan mendorong pembelian. Baik pelanggan membuka di ponsel atau komputer, mereka mendapat pengalaman belanja yang mulus — sehingga Anda menjangkau lebih banyak pembeli dan meningkatkan penjualan tanpa membuka lokasi fisik.",
    },
    urlDirect: "https://hardware-harmony.vercel.app",
    srcImage: "/img/projects/hardware-harmony.webp",
    tags: {
      en: ["Shop Web"],
      id: ["Situs Toko"],
    },
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
