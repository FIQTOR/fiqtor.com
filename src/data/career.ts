// Define the Career type interface for storing career/job experience information
type Career = {
  companyImage: string; // Path to company logo/image
  position: string; // Job title/position held
  companyName: string; // Name of the company
  location: string; // Location of the job
  priode: string; // Duration/time period of employment
  website?: string; // Optional company website URL
  description?: string; // Optional company description
};

// Export array of career experiences
export const Careers: Array<Career> = [
  {
    companyImage: "/img/iarty.webp",
    position: "Founder",
    companyName: "IARTY",
    location: "Bekasi",
    priode: "Mar 2025 - Present",
    website: "https://iarty.biz.id",
    description:
      "Built and scaled the IARTY ecosystem across education, AI, digital products, and services, leading end-to-end business strategy and execution. Managed multi-platform digital presence (Instagram, TikTok, YouTube, Threads) to deliver technology-focused content and drive audience growth. Created educational content through academy.iarichty, simplifying complex tech and AI topics into clear, human-centered English. Oversaw product development, marketing strategy, and operations to ensure alignment between business goals, user needs, and scalable growth.",
  },
  {
    companyImage: "/img/career/flashcom-indonesia.webp",
    position: "Freelance Web Programming Trainer",
    companyName: "Flashcom Indonesia",
    location: "Surabaya",
    priode: "Nov 2025 - Apr 2026",
    website: "https://flashcomindonesia.com",
    description:
      "Responsible for teaching and mentoring students in website development, covering both front-end and back-end fundamentals. Guided learners through hands-on projects to build practical skills and prepare them for careers or freelance opportunities in web development.",
  },
  {
    companyImage: "/img/career/seaqis.webp",
    position: "Full Stack Developer & IT Support",
    companyName: "SEAQIS",
    location: "Bandung",
    priode: "Jan 2024 - June 2024",
    website: "https://www.qitepinscience.org",
    description:
      "Designed and implemented a QR code-based attendance system to streamline employee check-in and check-out processes. Improved data accuracy, reduced manual errors, and enhanced HR operational efficiency. Collaborated with stakeholders to ensure usability and seamless integration with existing workflows.",
  },
  {
    companyImage: "/img/career/kodesatset.webp",
    position: "Founder",
    companyName: "KodeSatSet",
    location: "Jombang",
    priode: "Feb 2024 - Apr 2024",
    website: "https://www.instagram.com/kodesatset",
    description:
      "Founded and developed a technology-focused course program specializing in mobile app development. Designed curriculum, managed class operations, and ensured learning quality. Trained 50+ students in React Native development with hands-on use of Android Studio and emulators, while providing structured materials and direct mentorship to build practical, real-world skills.",
  },
];
