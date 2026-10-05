import type { Language } from "@/i18n/translations";

// Localizable text for a career entry.
type LocalizedText = Record<Language, string>;

// Define the Career type interface for storing career/job experience information
type Career = {
  companyImage: string; // Path to company logo/image
  position: LocalizedText; // Job title/position held
  companyName: string; // Name of the company
  location: LocalizedText; // Location of the job
  priode: LocalizedText; // Duration/time period of employment
  website?: string; // Optional company website URL
  description?: LocalizedText; // Optional company description
};

// Export array of career experiences
export const Careers: Array<Career> = [
  {
    companyImage: "/img/iarty.webp",
    position: { en: "Founder", id: "Pendiri" },
    companyName: "IARTY",
    location: { en: "Bekasi", id: "Bekasi" },
    priode: { en: "Mar 2025 - Present", id: "Mar 2025 - Sekarang" },
    website: "https://iarty.biz.id",
    description: {
      en: "Built and scaled the IARTY ecosystem across education, AI, digital products, and services, leading end-to-end business strategy and execution. Managed multi-platform digital presence (Instagram, TikTok, YouTube, Threads) to deliver technology-focused content and drive audience growth. Created educational content through academy.iarichty, simplifying complex tech and AI topics into clear, human-centered English. Oversaw product development, marketing strategy, and operations to ensure alignment between business goals, user needs, and scalable growth.",
      id: "Membangun dan mengembangkan ekosistem IARTY di bidang pendidikan, AI, produk digital, dan layanan, memimpin strategi dan eksekusi bisnis dari awal hingga akhir. Mengelola kehadiran digital multi-platform (Instagram, TikTok, YouTube, Threads) untuk menyajikan konten bertema teknologi dan mendorong pertumbuhan audiens. Membuat konten edukatif melalui academy.iarichty, menyederhanakan topik teknologi dan AI yang rumit menjadi bahasa yang jelas dan mudah dipahami. Mengawasi pengembangan produk, strategi pemasaran, dan operasional untuk memastikan keselarasan antara tujuan bisnis, kebutuhan pengguna, dan pertumbuhan yang berkelanjutan.",
    },
  },
  {
    companyImage: "/img/career/flashcom-indonesia.webp",
    position: {
      en: "Freelance Web Programming Trainer",
      id: "Trainer Pemrograman Web Freelance",
    },
    companyName: "Flashcom Indonesia",
    location: { en: "Surabaya", id: "Surabaya" },
    priode: { en: "Nov 2025 - Apr 2026", id: "Nov 2025 - Apr 2026" },
    website: "https://flashcomindonesia.com",
    description: {
      en: "Responsible for teaching and mentoring students in website development, covering both front-end and back-end fundamentals. Guided learners through hands-on projects to build practical skills and prepare them for careers or freelance opportunities in web development.",
      id: "Bertanggung jawab mengajar dan membimbing siswa dalam pengembangan website, mencakup dasar-dasar front-end maupun back-end. Membimbing peserta melalui proyek praktik untuk membangun keterampilan nyata dan mempersiapkan mereka untuk karier atau peluang freelance di bidang pengembangan web.",
    },
  },
  {
    companyImage: "/img/career/seaqis.webp",
    position: {
      en: "Full Stack Developer & IT Support",
      id: "Full Stack Developer & Dukungan IT",
    },
    companyName: "SEAQIS",
    location: { en: "Bandung", id: "Bandung" },
    priode: { en: "Jan 2024 - June 2024", id: "Jan 2024 - Juni 2024" },
    website: "https://www.qitepinscience.org",
    description: {
      en: "Designed and implemented a QR code-based attendance system to streamline employee check-in and check-out processes. Improved data accuracy, reduced manual errors, and enhanced HR operational efficiency. Collaborated with stakeholders to ensure usability and seamless integration with existing workflows.",
      id: "Merancang dan mengimplementasikan sistem absensi berbasis kode QR untuk merampingkan proses check-in dan check-out karyawan. Meningkatkan akurasi data, mengurangi kesalahan manual, dan meningkatkan efisiensi operasional HR. Berkolaborasi dengan pemangku kepentingan untuk memastikan kegunaan dan integrasi yang mulus dengan alur kerja yang sudah ada.",
    },
  },
  {
    companyImage: "/img/career/kodesatset.webp",
    position: { en: "Founder", id: "Pendiri" },
    companyName: "KodeSatSet",
    location: { en: "Jombang", id: "Jombang" },
    priode: { en: "Feb 2024 - Apr 2024", id: "Feb 2024 - Apr 2024" },
    website: "https://www.instagram.com/kodesatset",
    description: {
      en: "Founded and developed a technology-focused course program specializing in mobile app development. Designed curriculum, managed class operations, and ensured learning quality. Trained 50+ students in React Native development with hands-on use of Android Studio and emulators, while providing structured materials and direct mentorship to build practical, real-world skills.",
      id: "Mendirikan dan mengembangkan program kursus bertema teknologi yang mengkhususkan diri pada pengembangan aplikasi mobile. Merancang kurikulum, mengelola operasional kelas, dan memastikan kualitas pembelajaran. Melatih 50+ siswa dalam pengembangan React Native dengan penggunaan langsung Android Studio dan emulator, sekaligus menyediakan materi terstruktur dan bimbingan langsung untuk membangun keterampilan praktis yang nyata.",
    },
  },
];
