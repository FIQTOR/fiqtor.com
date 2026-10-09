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

// Which project list a project should appear in when browsing by tab.
// - "best": flagship, highest-impact projects (shown first on the homepage)
// - "recent": newer / smaller shipped work (everything that isn't "best")
export type ProjectHighlight = "best" | "recent";

// Define the Project type interface
// title: Name of the project (per language)
// category: Main category of the project
// description: Brief explanation of the project (per language)
// urlDirect: Optional live demo URL
// srcImage: Path to project screenshot/image (used as the cover image)
// images: Optional array of extra screenshots to render as a gallery in the modal
//         (if omitted, only srcImage is shown)
//   tags: Optional array of project categories/keywords (per language)
//   icons: Array of technology icons used in the project
//   best: When true the project is a flagship project shown in the "Best
//         Project" tab (homepage default). Omit/false means it belongs to the
//         "Recent Project" tab instead.
export type Project = {
  title: LocalizedText;
  category: ProjectCategory;
  description: LocalizedText;
  urlDirect?: string;
  srcImage: string;
  images?: Array<string>;
  tags?: Record<Language, Array<string>>;
  icons: Array<Icon>;
  best?: boolean;
};

// Export array of projects data
export const Projects: Array<Project> = [
  {
    title: {
      en: "Oriental Pearl Tower - Interactive 3D Explorer",
      id: "Menara Mutiara Oriental - Penjelajah 3D Interaktif",
    },
    category: "Creative",
    description: {
      en: "A real-time 3D explorer I built for Shanghai's 468 m Oriental Pearl Tower, loaded from a Draco-compressed GLB with automatic multi-stage fallback loading. Visitors orbit the tower, explode it into 34 labeled components (structure, façade, glass, lighting, radome, plaza…) and reassemble it, with a draggable sun, real-time shadows and a day/night switch. It solves the problem of flat photo galleries for complex structures — every layer of the building can be inspected in 3D right in the browser.",
      id: "Penjelajah 3D real-time yang saya bangun untuk Menara Mutiara Oriental Shanghai setinggi 468 m, dimuat dari GLB terkompresi Draco dengan pemuatan cadangan otomatis berlapis. Pengunjung memutar menara, membongkarnya menjadi 34 komponen berlabel (rangka, fasad, kaca, lampu, radome, plaza…) lalu menyatukannya kembali, dengan matahari yang bisa digeser, bayangan real-time, dan sakelar siang/malam. Ini menyelesaikan masalah galeri foto datar untuk struktur kompleks — setiap lapisan bangunan bisa diperiksa dalam 3D langsung di browser.",
    },
    urlDirect: "https://oriental-pearl-tower.vercel.app/",
    srcImage: "img/projects/oriental-pearl-tower.webp",
    tags: {
      en: ["3D", "Three.js", "WebGL", "GLTF", "Draco", "Interactive", "Creative Coding"],
      id: ["3D", "Three.js", "WebGL", "GLTF", "Draco", "Interaktif", "Creative Coding"],
    },
    icons: [
      {
        SvgIcon: Javascript,
        title: "JavaScript",
      },
      {
        SvgIcon: Html5,
        title: "HTML5",
      },
      {
        SvgIcon: Css3,
        title: "CSS3",
      },
      {
        SvgIcon: Vercel,
        title: "Vercel",
      },
    ],
  },
  {
    title: {
      en: "Lagoon - Interactive 3D Island Diorama",
      id: "Lagoon - Diorama Pulau 3D Interaktif",
    },
    category: "Creative",
    description: {
      en: "A real-time 3D island diorama I built where every tap on the lagoon sends a ripple across the reef, with a full day-to-night cycle, rain and sunset presets, overwater villas, and a live water simulation. It solves the problem of static, lifeless hero visuals — visitors can play with the scene, dragging the sun from golden hour to starlight and stirring the water themselves.",
      id: "Diorama pulau 3D real-time yang saya bangun di mana setiap ketukan di laguna mengirim riak melintasi terumbu, dengan siklus siang-malam penuh, preset hujan dan matahari terbenam, vila di atas air, dan simulasi air langsung. Ini menyelesaikan masalah visual hero yang statis dan tanpa nyawa — pengunjung bisa bermain dengan adegan, menggeser matahari dari golden hour ke cahaya bintang dan mengaduk air sendiri.",
    },
    urlDirect: "https://lagoon-mocha.vercel.app/",
    srcImage: "img/projects/lagoon.webp",
    tags: {
      en: ["3D", "Three.js", "WebGL", "Interactive", "Water Simulation", "Creative Coding"],
      id: ["3D", "Three.js", "WebGL", "Interaktif", "Simulasi Air", "Creative Coding"],
    },
    icons: [
      {
        SvgIcon: Javascript,
        title: "JavaScript",
      },
      {
        SvgIcon: Html5,
        title: "HTML5",
      },
      {
        SvgIcon: Css3,
        title: "CSS3",
      },
      {
        SvgIcon: Vercel,
        title: "Vercel",
      },
    ],
  },
  {
    title: {
      en: "Lintas Rent - Premium Car Rental",
      id: "Lintas Rent - Rental Mobil Premium",
    },
    category: "Landing Page",
    description: {
      en: "A premium car rental website I built with a cinematic scroll-driven 3D showroom featuring real GLB car models (Ferrari, Lamborghini, Porsche). Visitors scrub through each car, get a live price estimate for their chosen dates and options, and send a pre-filled booking straight to WhatsApp. It solves the problem of rental businesses showing flat photo galleries — here customers explore the actual cars in 3D and book in seconds.",
      id: "Situs rental mobil premium yang saya bangun dengan showroom 3D sinematik yang digerakkan scroll menampilkan model mobil GLB asli (Ferrari, Lamborghini, Porsche). Pengunjung menelusuri setiap mobil, mendapat estimasi harga langsung untuk tanggal dan opsi pilihan, lalu mengirim pemesanan siap-pakai langsung ke WhatsApp. Ini menyelesaikan masalah bisnis rental yang hanya menampilkan galeri foto datar — di sini pelanggan menjelajahi mobil sebenarnya dalam 3D dan memesan dalam hitungan detik.",
    },
    urlDirect: "https://lintas-rent.vercel.app/",
    srcImage: "img/projects/lintas-rent.webp",
    tags: {
      en: ["Landing Page", "3D", "Three.js", "GLTF", "GSAP ScrollTrigger", "Booking"],
      id: ["Landing Page", "3D", "Three.js", "GLTF", "GSAP ScrollTrigger", "Pemesanan"],
    },
    icons: [
      {
        SvgIcon: Javascript,
        title: "JavaScript",
      },
      {
        SvgIcon: Html5,
        title: "HTML5",
      },
      {
        SvgIcon: Css3,
        title: "CSS3",
      },
      {
        SvgIcon: Vercel,
        title: "Vercel",
      },
    ],
  },
  {
    title: {
      en: "IARTY Ecosystem - Business Core",
      id: "Ekosistem IARTY - Inti Bisnis",
    },
    category: "Business System",
    best: true,
    description: {
      en: "A digital business ecosystem I built that combines online courses, an AI-powered investment tool, and a digital marketplace under one account system. It solves the problem of business owners having to subscribe to and switch between many separate tools that don't share data — I unified education, investment, and commerce into a single platform they can also extend with custom apps.",
      id: "Ekosistem bisnis digital yang saya bangun dengan menggabungkan kursus online, alat investasi bertenaga AI, dan marketplace digital dalam satu sistem akun. Ini menyelesaikan masalah pemilik bisnis yang harus berlangganan dan berpindah-pindah banyak alat terpisah yang tidak berbagi data — saya menyatukan pendidikan, investasi, dan perdagangan ke dalam satu platform yang juga bisa diperluas dengan aplikasi khusus.",
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
    best: true,
    description: {
      en: "A full ERP platform I built that unifies sales, purchasing, multi-warehouse inventory, CRM, double-entry accounting, HR & payroll, approvals, and reports into one workspace. It solves the problem of business data being split across notebooks and spreadsheets: instead of reconciling multiple sources by hand, owners see live sales, stock, debts, salaries, and real profit on one dashboard.",
      id: "Platform ERP lengkap yang saya bangun untuk menyatukan penjualan, pembelian, inventaris multi-gudang, CRM, akuntansi double-entry, HR & penggajian, persetujuan, dan laporan ke dalam satu ruang kerja. Ini menyelesaikan masalah data bisnis yang terpecah di buku catatan dan spreadsheet: alih-alih merekonsiliasi banyak sumber secara manual, pemilik melihat penjualan, stok, utang, gaji, dan laba riil secara langsung di satu dasbor.",
    },
    srcImage: "/img/projects/erp-dashboard-new.webp",
    images: [
      "/img/projects/erp-dashboard-new.webp",
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
    best: true,
    description: {
      en: "A sales CRM I built with secure login (including 2FA), role-based access control, a drag-and-drop deal pipeline, automatic lead scoring, tasks & reminders, and an analytics dashboard. It solves the problem of sales teams losing track of prospects and follow-ups: every lead, customer, and deal lives in one place, so nothing gets forgotten and performance is measurable.",
      id: "CRM penjualan yang saya bangun dengan login aman (termasuk 2FA), kontrol akses berbasis peran, pipeline deal drag-and-drop, penilaian prospek otomatis, tugas & pengingat, serta dasbor analitik. Ini menyelesaikan masalah tim penjualan yang kehilangan jejak prospek dan tindak lanjut: setiap prospek, pelanggan, dan deal tersimpan di satu tempat, sehingga tak ada yang terlupa dan performa bisa diukur.",
    },
    srcImage: "img/projects/crm-dashboard-new.webp",
    images: [
      "img/projects/crm-dashboard-new.webp",
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
    best: true,
    description: {
      en: "A Human Resource Information System I built covering employee records, attendance, leave, payroll, recruitment, performance, and an employee self-service portal. It solves the problem of HR admin being slow and error-prone when done manually: employees clock in and request leave from their phone, and payroll, attendance, and headcount reports are generated automatically.",
      id: "Sistem Informasi SDM yang saya bangun mencakup data karyawan, absensi, cuti, penggajian, rekrutmen, performa, dan portal swalayan karyawan. Ini menyelesaikan masalah administrasi HR yang lambat dan rawan salah saat dilakukan manual: karyawan absen dan mengajukan cuti dari ponsel, dan laporan gaji, kehadiran, serta jumlah karyawan dibuat otomatis.",
    },
    srcImage: "img/projects/hris-dashboard-new.webp",
    images: [
      "img/projects/hris-dashboard-new.webp",
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
    best: true,
    description: {
      en: "A school management system + learning platform I built with online admissions, attendance, gradebooks, CBT exams, tuition billing, a parent portal, and an LMS for materials and assignments. It solves the problem of schools running admissions, grades, fees, and parent updates on paper: everything moves into one connected platform so staff save time and parents can follow their child's progress.",
      id: "Sistem manajemen sekolah + platform pembelajaran yang saya bangun dengan pendaftaran online, absensi, buku nilai, ujian CBT, tagihan SPP, portal orang tua, dan LMS untuk materi serta tugas. Ini menyelesaikan masalah sekolah yang menjalankan pendaftaran, nilai, biaya, dan info ke orang tua di atas kertas: semuanya pindah ke satu platform terhubung sehingga staf hemat waktu dan orang tua bisa memantau perkembangan anak.",
    },
    srcImage: "/img/projects/eschool-hero-new.webp",
    images: [
      "/img/projects/eschool-hero-new.webp",
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
    best: true,
    description: {
      en: "A restaurant self-ordering app I built: diners scan a table QR code, order and pay from their phone (QRIS, transfer, e-wallet, card), and orders appear live on kitchen and cashier screens, plus a staff dashboard for menu, table QR, orders, and sales. It solves the problem of waiters running back and forth, slow ordering, and lost orders — guests order themselves and payment is verified automatically.",
      id: "Aplikasi pesan mandiri restoran yang saya bangun: pelanggan memindai kode QR di meja, memesan dan membayar dari ponsel (QRIS, transfer, e-wallet, kartu), dan pesanan muncul langsung di layar dapur dan kasir, plus dasbor staf untuk menu, QR meja, pesanan, dan penjualan. Ini menyelesaikan masalah pelayan yang mondar-mandir, pemesanan lambat, dan pesanan yang terlewat — tamu memesan sendiri dan pembayaran terverifikasi otomatis.",
    },
    srcImage: "img/projects/resto-landing-new.webp",
    images: [
      "img/projects/resto-landing-new.webp",
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
    best: true,
    description: {
      en: "An AI chatbot I built for WhatsApp that automatically answers customer questions, shares product info, and takes orders 24/7. It solves the problem of businesses losing sales because they can't reply to WhatsApp fast enough or outside working hours — the bot handles customer chats automatically without hiring extra admin staff.",
      id: "Chatbot AI yang saya bangun untuk WhatsApp yang otomatis menjawab pertanyaan pelanggan, membagikan info produk, dan menerima pesanan 24/7. Ini menyelesaikan masalah bisnis yang kehilangan penjualan karena tidak bisa membalas WhatsApp dengan cepat atau di luar jam kerja — bot menangani obrolan pelanggan secara otomatis tanpa menambah staf admin.",
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
    best: true,
    description: {
      en: "An AI chat platform I built where you can talk to 50+ AI models (GPT, DeepSeek, and others) in one conversation and switch models mid-chat. It solves the problem of needing multiple AI subscriptions and juggling separate apps — one tool covers writing, planning, problem-solving, and stock/crypto analysis, and conversations can be exported.",
      id: "Platform obrolan AI yang saya bangun di mana Anda bisa berbicara dengan 50+ model AI (GPT, DeepSeek, dan lainnya) dalam satu percakapan dan berpindah model di tengah obrolan. Ini menyelesaikan masalah kebutuhan banyak langganan AI dan repot berpindah aplikasi — satu alat mencakup menulis, merencanakan, memecahkan masalah, dan analisis saham/kripto, serta percakapan bisa diekspor.",
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
    best: true,
    description: {
      en: "An online marketplace I built where users browse and buy AI tools, prompts, and templates for their projects. It solves the problem of people building everything from scratch or searching everywhere for good AI resources — they can find and start using ready-made solutions in one place.",
      id: "Marketplace online yang saya bangun tempat pengguna menjelajahi dan membeli alat, prompt, dan template AI untuk proyek mereka. Ini menyelesaikan masalah orang yang membangun segalanya dari nol atau mencari ke mana-mana untuk sumber AI yang bagus — mereka bisa menemukan dan langsung memakai solusi siap pakai di satu tempat.",
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
    best: true,
    description: {
      en: "A UI marketplace I built where customers buy ready-to-use website designs and components. It solves the problem of businesses and creators spending months and a lot of money on custom design — they get professional, ready-made UI they can drop straight into their project for a fraction of the cost and time.",
      id: "Marketplace UI yang saya bangun tempat pelanggan membeli desain dan komponen situs yang siap pakai. Ini menyelesaikan masalah bisnis dan kreator yang menghabiskan berbulan-bulan dan banyak biaya untuk desain kustom — mereka mendapat UI profesional siap pakai yang bisa langsung dipasang ke proyek dengan biaya dan waktu jauh lebih sedikit.",
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
      en: "An interactive web experiment I built that tracks hand movement through the camera and turns it into responsive particle visuals — no mouse or controller needed. It solves the problem of touchless, camera-only interaction for demos and interactive displays, showing how a plain webcam can control a screen.",
      id: "Eksperimen web interaktif yang saya bangun yang melacak gerakan tangan lewat kamera dan mengubahnya menjadi visual partikel yang responsif — tanpa mouse atau kontroler. Ini menyelesaikan masalah interaksi tanpa sentuh yang hanya mengandalkan kamera untuk demo dan display interaktif, menunjukkan bagaimana webcam biasa bisa mengendalikan layar.",
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
      en: "An official website I built for Djoyo Florist with a product catalog (bouquets, flower boards, event decorations), occasion-based service info, and a direct order contact. It solves the problem of a florist relying only on social media and word of mouth — customers can browse the full catalog and place an order in seconds from one clear website.",
      id: "Situs resmi yang saya bangun untuk Djoyo Florist dengan katalog produk (buket, papan bunga, dekorasi acara), info layanan per acara, dan kontak pesanan langsung. Ini menyelesaikan masalah florist yang hanya mengandalkan media sosial dan mulut ke mulut — pelanggan bisa menjelajahi katalog lengkap dan memesan dalam hitungan detik dari satu situs yang jelas.",
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
      en: "A social media analytics tool I built for Instagram and TikTok that lists which accounts don't follow you back and which you don't follow back. It solves the problem of checking followers manually one by one — users connect their account and get the full list instantly.",
      id: "Alat analitik media sosial yang saya bangun untuk Instagram dan TikTok yang menampilkan akun mana yang tidak mengikuti balik dan mana yang tidak Anda ikuti balik. Ini menyelesaikan masalah pengecekan pengikut satu per satu secara manual — pengguna menghubungkan akun dan mendapat daftar lengkap seketika.",
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
      en: "An online learning platform I built with structured lessons, HD video courses, and progress tracking. It solves the problem of scattered, disorganized learning content — students get well-arranged courses they can follow at their own pace from anywhere in one clean interface.",
      id: "Platform pembelajaran online yang saya bangun dengan pelajaran terstruktur, kursus video HD, dan pelacakan progres. Ini menyelesaikan masalah konten belajar yang tersebar dan tidak teratur — siswa mendapat kursus yang tertata rapi dan bisa diikuti sesuai tempo sendiri dari mana saja dalam satu antarmuka yang bersih.",
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
      en: "A service company website I built for Sigma Teknik with a full service list (AC, refrigerators, cooling equipment), photo documentation of completed jobs, company info, location, and a one-tap WhatsApp button. It solves the problem of customers struggling to find and trust a technician — they can see proof of work and contact the company instantly.",
      id: "Situs perusahaan jasa yang saya bangun untuk Sigma Teknik dengan daftar layanan lengkap (AC, kulkas, peralatan pendingin), dokumentasi foto pekerjaan selesai, info perusahaan, lokasi, dan tombol WhatsApp sekali ketuk. Ini menyelesaikan masalah pelanggan yang sulit menemukan dan mempercayai teknisi — mereka bisa melihat bukti pekerjaan dan menghubungi perusahaan seketika.",
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
      en: "A ready-to-use website template I built for coffee shops, featuring a full menu, product photos, location info, and a WhatsApp contact button. It solves the problem of small cafés having no online presence or spending a lot on a website — they get a neat, professional site for Rp300,000.",
      id: "Template situs siap pakai yang saya bangun untuk kedai kopi, dengan menu lengkap, foto produk, info lokasi, dan tombol kontak WhatsApp. Ini menyelesaikan masalah kafe kecil yang tidak punya kehadiran online atau harus mengeluarkan banyak biaya untuk membuat situs — mereka mendapat situs yang rapi dan profesional dengan Rp300.000.",
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
      en: "A modern-themed coffee shop website template I built with a menu showcase, prices, product photos, location, and WhatsApp contact. It solves the problem of cafés that want a distinctive, modern look without custom development cost or wait — a polished futuristic template ready in minutes for Rp300,000.",
      id: "Template situs kedai kopi bertema modern yang saya bangun dengan tampilan menu, harga, foto produk, lokasi, dan kontak WhatsApp. Ini menyelesaikan masalah kafe yang ingin tampilan modern yang khas tanpa biaya atau waktu pengembangan kustom — template futuristik yang siap dalam beberapa menit dengan Rp300.000.",
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
      en: "A retro-style coffee shop website template I built with menu pages, drink and food lists, location, and a WhatsApp button for orders or reservations. It solves the problem of cafés wanting a memorable, nostalgic look without hiring a designer — a characterful template available instantly for Rp300,000.",
      id: "Template situs kedai kopi bergaya retro yang saya bangun dengan halaman menu, daftar minuman dan makanan, lokasi, dan tombol WhatsApp untuk pesanan atau reservasi. Ini menyelesaikan masalah kafe yang ingin tampilan nostalgik yang berkesan tanpa menyewa desainer — template penuh karakter yang langsung tersedia dengan Rp300.000.",
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
      en: "A store management system I built for grocery shops with stock in/out, expense and income tracking, cashier transactions, and simple analytics. It solves the problem of shop owners losing money through miscounts and messy records — every transaction and stock movement is recorded in one place with clear, automatic reports.",
      id: "Sistem manajemen toko yang saya bangun untuk toko kelontong dengan stok masuk/keluar, pelacakan pengeluaran dan pemasukan, transaksi kasir, dan analitik sederhana. Ini menyelesaikan masalah pemilik toko yang rugi karena salah hitung dan catatan berantakan — setiap transaksi dan pergerakan stok tercatat di satu tempat dengan laporan otomatis yang jelas.",
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
      en: "An online restaurant ordering system I built where guests scan a table QR code, order, and pay (bank transfer, e-wallet, or cash), with branch management and revenue analytics for owners. It solves the problem of slow table service and manual order-taking — orders go straight to staff and owners can track revenue across branches.",
      id: "Sistem pesan online restoran yang saya bangun di mana tamu memindai kode QR di meja, memesan, dan membayar (transfer bank, e-wallet, atau tunai), dengan manajemen cabang dan analitik pendapatan untuk pemilik. Ini menyelesaikan masalah pelayanan meja yang lambat dan pencatatan pesanan manual — pesanan langsung ke staf dan pemilik bisa melacak pendapatan lintas cabang.",
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
      en: "A creative web tool I built that turns custom messages, poems, and quotes into personalized digital gifts shared via a link. It solves the problem of finding a meaningful, personal gift — users craft a heartfelt message in minutes and send something more touching than a store-bought card.",
      id: "Alat web kreatif yang saya bangun yang mengubah pesan, puisi, dan kutipan kustom menjadi hadiah digital personal yang dibagikan lewat tautan. Ini menyelesaikan masalah mencari hadiah yang bermakna dan personal — pengguna merangkai pesan tulus dalam beberapa menit dan mengirim sesuatu yang lebih menyentuh daripada kartu beli di toko.",
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
      en: "An online store module I built where sellers add products and customers are redirected to the product's marketplace listing when they tap a card. It solves the problem of displaying a product catalog online without running a full checkout — sellers showcase items and send buyers straight to where they can purchase.",
      id: "Modul toko online yang saya bangun di mana penjual menambahkan produk dan pelanggan diarahkan ke listing marketplace produk saat mengetuk kartunya. Ini menyelesaikan masalah menampilkan katalog produk secara online tanpa harus menjalankan checkout penuh — penjual memamerkan barang dan mengarahkan pembeli langsung ke tempat pembelian.",
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
      en: "A free, open-source QR code generator I built that creates custom QR codes for any link, menu, or event in seconds. It solves the problem of needing quick QR codes without sign-ups, accounts, paywalls, or watermarks — anyone can generate and download one instantly.",
      id: "Pembuat kode QR gratis dan open source yang saya bangun yang membuat kode QR kustom untuk tautan, menu, atau acara apa pun dalam hitungan detik. Ini menyelesaikan masalah kebutuhan kode QR cepat tanpa daftar, akun, paywall, atau watermark — siapa saja bisa membuat dan mengunduhnya seketika.",
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
      en: "A festive interactive website I built as a shareable Christmas greeting with a decorated tree and animated ornaments. It solves the problem of sending a plain holiday message — it's a charming digital greeting anyone can share to brighten the season.",
      id: "Situs interaktif meriah yang saya bangun sebagai ucapan Natal yang bisa dibagikan dengan pohon berhias dan ornamen beranimasi. Ini menyelesaikan masalah mengirim ucapan liburan yang biasa saja — ini sapaan digital yang menawan yang bisa dibagikan siapa saja untuk mencerahkan suasana musim.",
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
      en: "A popular gift website I built that lets users create and send a digital flower bouquet with a personalized message via a link. It solves the problem of sending flowers that cost money and take time to deliver — users send a touching, personalized digital bouquet instantly with no delivery fees.",
      id: "Situs hadiah populer yang saya bangun yang memungkinkan pengguna membuat dan mengirim buket bunga digital dengan pesan personal lewat tautan. Ini menyelesaikan masalah mengirim bunga yang butuh biaya dan waktu pengiriman — pengguna mengirim buket digital yang menyentuh dan personal seketika tanpa biaya kirim.",
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
      en: "A café ordering web app I built where customers scan a QR code at their table to browse the menu and order, with orders reaching staff instantly. It solves the problem of long queues and misheard orders during busy hours — customers self-order and staff process orders faster without extra manpower.",
      id: "Aplikasi web pesan kafe yang saya bangun di mana pelanggan memindai kode QR di meja untuk melihat menu dan memesan, dengan pesanan langsung sampai ke staf. Ini menyelesaikan masalah antrean panjang dan pesanan salah dengar saat jam sibuk — pelanggan memesan sendiri dan staf memproses pesanan lebih cepat tanpa tambahan tenaga.",
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
      en: "An attendance app I built for schools where students check in by scanning a QR code. It solves the problem of slow manual roll-calling and paper attendance sheets — attendance is recorded instantly and teachers get a clear real-time view of who's present.",
      id: "Aplikasi absensi yang saya bangun untuk sekolah di mana siswa absen dengan memindai kode QR. Ini menyelesaikan masalah pemanggilan absen manual yang lambat dan lembar kertas — kehadiran tercatat seketika dan guru mendapat tampilan real-time yang jelas tentang siapa yang hadir.",
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
      en: "A company attendance app I built where employees clock in from their phone and managers see who's present, late, or away in real time. It solves the problem of messy sign-in sheets and manual attendance tracking — attendance is automatic and the working-hours record is always clean and organized.",
      id: "Aplikasi absensi perusahaan yang saya bangun di mana karyawan absen dari ponsel dan manajer melihat siapa yang hadir, terlambat, atau tidak ada secara real-time. Ini menyelesaikan masalah daftar hadir berantakan dan pelacakan manual — absensi otomatis dan catatan jam kerja selalu bersih dan tertata.",
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
      en: "A portfolio website I built for BBY Interior to present architectural and interior design work with elegant visuals and smooth navigation. It solves the problem of a design firm not having a professional online showcase — clients can quickly see the quality of past work and reach out.",
      id: "Situs portofolio yang saya bangun untuk BBY Interior untuk menyajikan karya desain arsitektur dan interior dengan visual elegan dan navigasi yang mulus. Ini menyelesaikan masalah firma desain yang tidak punya etalase online profesional — klien bisa cepat melihat kualitas karya sebelumnya dan menghubungi.",
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
      en: "A restaurant website I built that displays a full menu and product showcase with a responsive layout. It solves the problem of restaurants being hard to find or looking unprofessional online — a strong web presence helps new customers discover the restaurant and decide to visit.",
      id: "Situs restoran yang saya bangun yang menampilkan menu lengkap dan etalase produk dengan tata letak responsif. Ini menyelesaikan masalah restoran yang sulit ditemukan atau tampak tidak profesional secara online — kehadiran web yang kuat membantu pelanggan baru menemukan restoran dan memutuskan untuk datang.",
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
      en: "My personal portfolio website (an earlier version) that showcases skills, projects, achievements, and contact details in a responsive design. It solves the problem of presenting professional experience in one credible place — visitors immediately see who I am and what I've built. (The current site is the newer version you're viewing.)",
      id: "Situs portofolio pribadi saya (versi lebih lama) yang menampilkan keterampilan, proyek, pencapaian, dan detail kontak dalam desain responsif. Ini menyelesaikan masalah menyajikan pengalaman profesional di satu tempat yang kredibel — pengunjung langsung melihat siapa saya dan apa yang telah saya bangun. (Situs saat ini adalah versi terbaru yang sedang Anda lihat.)",
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
      en: "A company profile website I built that presents who the company is, its services, and contact details in a clean, responsive layout. It solves the problem of a company lacking a credible online profile — potential clients and partners can understand the business and get in touch quickly.",
      id: "Situs profil perusahaan yang saya bangun yang menyajikan identitas perusahaan, layanan, dan detail kontak dalam tata letak yang bersih dan responsif. Ini menyelesaikan masalah perusahaan yang tidak punya profil online yang kredibel — calon klien dan mitra bisa memahami bisnis dan menghubungi dengan cepat.",
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
      en: "An e-commerce website I built to showcase shop products in an attractive, responsive layout optimized for browsing. It solves the problem of a shop having no online sales channel — products are presented clearly and customers can browse and buy from phone or computer.",
      id: "Situs e-commerce yang saya bangun untuk memamerkan produk toko dalam tata letak menarik dan responsif yang dioptimalkan untuk penelusuran. Ini menyelesaikan masalah toko yang tidak punya kanal penjualan online — produk disajikan dengan jelas dan pelanggan bisa menelusuri serta membeli dari ponsel atau komputer.",
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

// Flagship projects (marked with `best: true`), shown in the "Best Project" tab.
export const BestProjects: Array<Project> = Projects.filter(
  (project) => project.best === true
);

// Everything that isn't a flagship project, shown in the "Recent Project" tab.
export const RecentProjects: Array<Project> = Projects.filter(
  (project) => project.best !== true
);

// Convenience helper to grab the list for a given highlight tab.
export const getProjectsByHighlight = (
  highlight: ProjectHighlight
): Array<Project> => (highlight === "best" ? BestProjects : RecentProjects);
