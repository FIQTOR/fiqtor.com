/**
 * Represents a certificate with its details
 * @typedef {Object} Certificate
 * @property {string} title - The title/name of the certificate
 * @property {string} [urlDirect] - Optional direct URL to view/download the certificate
 * @property {string} published - Publication/issuance date of the certificate
 * @property {string} srcImage - Path to the certificate's image file
 * @property {boolean} thisAcademic - Indicates if this is an academic certificate
 * @property {Array<string>} [tags] - Optional array of tags/keywords related to the certificate
 */
type Certificate = {
  title: string;
  urlDirect?: string;
  published: string;
  srcImage: string;
  thisAcademic: boolean;
  tags?: Array<string>;
};

/**
 * Array containing all certificate entries
 * @type {Array<Certificate>}
 */
export const Certificates: Array<Certificate> = [
  {
    title:
      "SEAMEO QITEP in Science (SEAQIS) - Competition Web Cloud Engineering (1st Place out of 24 teams)",
    urlDirect:
      "https://officeseamolec-my.sharepoint.com/:f:/g/personal/seaqis_seameo_id/EjCcCaEA3PFHu70p7R_KQZ0BpYSlKVWPv65DOZSMr7-vIQ?e=5cGJbz",
    published: "Aug 2023",
    srcImage:
      "/img/certificate/seameo-qitep-in-science-web-cloud-engineering.webp",
    thisAcademic: true,
    tags: ["AWS Academy", "Laravel SAIL", "MySQL", "Putty", "Docker"],
  },
  {
    title:
      "LKS Jawa Timur ke-32 - Competition Web Technologies (4th Place out of 44)",
    urlDirect:
      "https://drive.google.com/file/d/1JRJXPr4zt0w0IheRY-u1Jal2qWn6G5ME/view?usp=sharing",
    published: "Apr 2024",
    srcImage:
      "/img/certificate/lksjatim32-webtechnologies-certificate-taufiiqul_hakim.webp",
    thisAcademic: true,
    tags: [
      "Laravel",
      "ReactJS",
      "Javascript",
      "RestAPI",
      "Game In Website",
      "Fullstack Developer",
    ],
  },
  {
    title: "LKS Kab.Jombang ke-32 - Competition Web Technologies (1st Place)",
    urlDirect:
      "https://drive.google.com/file/d/1JRJXPr4zt0w0IheRY-u1Jal2qWn6G5ME/view?usp=sharing",
    published: "Feb 2024",
    srcImage:
      "/img/certificate/LKS juara1 tingkat kabupaten jombang - Taufiiqul Hakim.webp",
    thisAcademic: true,
    tags: [
      "Laravel",
      "ReactJS",
      "Javascript",
      "RestAPI",
      "Game In Website",
      "Fullstack Developer",
    ],
  },

  {
    title: "Dicoding x DBS Foundation - Financial Literacy 101",
    urlDirect: "https://www.dicoding.com/certificates/N9ZO29Q2RPG5",
    published: "Oct 2025",
    srcImage:
      "/img/certificate/dicoding-financial_literacy_101-taufiiqul_hakim.webp",
    thisAcademic: false,
    tags: [
      "Budgeting",
      "Financial Management",
      "Accountant",
    ],
  },
  {
    title: "Dicoding x IDCamp - Learning to Create Front-End Web for Beginners",
    urlDirect: "https://www.dicoding.com/certificates/81P25LMLNPOY",
    published: "Oct 2025",
    srcImage:
      "/img/certificate/dicoding-learning_to_create_front-end_web_for_beginners-taufiiqul_hakim.webp",
    thisAcademic: false,
    tags: [
      "HTML",
      "CSS",
      "Javascript",
      "Bookshelf App",
    ],
  },
  {
    title: "Airofest by Airnology2.0 (UNAIR) - Coding Challenge Competition",
    urlDirect:
      "https://drive.google.com/file/d/1hb_vrPX6VH3FW4EIdj3A7n7gDrQh_hKM/view",
    published: "Oct 2023",
    srcImage: "/img/certificate/airnology2.0-coding-challenge-competition.webp",
    thisAcademic: true,
    tags: ["C", "C++", "Java", "Python", "Hacker Rank", "Problem Solving"],
  },
  {
    title: "HMJTI POLIJE - Competition Web Programming Native",
    urlDirect:
      "https://drive.google.com/drive/folders/1HoocGBaHSmQJ_1EGiHcCwvpB5t_cILEx",
    published: "Sep 2024",
    srcImage: "/img/certificate/HMJ TI - Setifikat Tim Syntheric.webp",
    thisAcademic: true,
    tags: ["Website", "UI/UX Design"],
  },
  {
    title: "Dicoding x IDCamp - Learn AI Fundamentals",
    urlDirect: "https://www.dicoding.com/certificates/L4PQ28O92ZO1",
    published: "Sep 2025",
    srcImage:
      "/img/certificate/dicoding-belajar-dasar-ai-Taufiiqul_Hakim.webp",
    thisAcademic: false,
    tags: [
      "Artificial Intelligence",
      "Machine Learning",
      "Deep Learning",
      "Generative AI",
    ],
  },
  {
    title:
      "Politeknik Elektronika Negeri Surabaya (PENS) - Webinar Optimalisasi Query SQL",
    urlDirect:
      "https://drive.google.com/drive/folders/1Rcw6vBXp9ivHgFLBHxUhPUdubC_AMuim",
    published: "Mar 2024",
    srcImage: "/img/certificate/pens-webinar-querySQL-Taufiiqul-Hakim.webp",
    thisAcademic: true,
    tags: ["Query", "SQL", "Database Management"],
  },
  {
    title: "dilesin.id - Basic Programming C++ #2",
    urlDirect:
      "https://drive.google.com/file/d/18dpd8nne6DgTBvsKQm9T9UM5nTJl9mxJ/view?usp=sharing",
    published: "May 2024",
    srcImage:
      "/img/certificate/dilesin_certificate_dasar-pemrograman-c++-batch2-Taufiiqul_Hakim.webp",
    thisAcademic: false,
    tags: ["C++", "Data Types", "Problem Solving"],
  },
  {
    title: "Dicoding x DBS Foundation - Learn JavaScript Programming Basics",
    urlDirect: "https://www.dicoding.com/certificates/KEXL18Q3RXG2",
    published: "May 2024",
    srcImage:
      "/img/certificate/dicoding-dasar_pemrograman_javascript-Taufiiqul_Hakim.webp",
    thisAcademic: false,
    tags: [
      "Asynchronus Process",
      "Node.js(NPM)",
      "Javascript",
      "OOP",
      "Data Stucture",
    ],
  },
  {
    title: "Dicoding x DBS Foundation - Learn the Basics of Web Programming",
    urlDirect: "https://www.dicoding.com/certificates/53XEOY470ZRN",
    published: "May 2024",
    srcImage:
      "/img/certificate/dicoding_sertifikat_course_belajar_dasar_pemrograman_web.webp",
    thisAcademic: false,
    tags: ["HTML3", "CSS3", "Javascript", "SemanticHTML"],
  },
  {
    title: "FreeCodeCamp(FCC) - Responsive Web Design",
    urlDirect:
      "https://www.freecodecamp.org/certification/Taufiiqul_Hakim/responsive-web-design",
    published: "Dec 2023",
    srcImage: "/img/certificate/freecodecamp-responsive-web-design.webp",
    thisAcademic: false,
    tags: ["HTML5", "CSS3", "Responsive On Mobile"],
  },
  {
    title: "FreeCodeCamp(FCC) - Front-end Development Libraries",
    urlDirect:
      "https://www.freecodecamp.org/certification/Taufiiqul_Hakim/front-end-development-libraries",
    published: "Dec 2023",
    srcImage:
      "/img/certificate/freecodecamp-front-end-development-libraries.webp",
    thisAcademic: false,
    tags: ["HTML5", "CSS3", "Bootstrap"],
  },
  {
    title: "Future Entrepreneur Summit Surabaya 2025 - Public Speaking Training",
    urlDirect: "https://app.simvent.id/certificates?context=NjM5MDY6TUJHR1VGN1cwRA==",
    published: "Dec 2025",
    srcImage:
      "/img/certificate/cerificate-future-entrepreneur-summit-2025-sby-5.webp",
    thisAcademic: false,
    tags: [
      "Improvement Softskill",
      "Public Speaking",
    ],
  },
  {
    title: "Future Entrepreneur Summit Surabaya 2025 - Future National Competition",
    urlDirect: "https://app.simvent.id/certificates?context=NjM5MDY6TUJHR1VGN1cwRA==",
    published: "Dec 2025",
    srcImage:
      "/img/certificate/cerificate-future-entrepreneur-summit-2025-sby-4.webp",
    thisAcademic: false,
    tags: [
      "Improvement Softskill",
      "Public Speaking",
    ],
  },
  {
    title: "Future Entrepreneur Summit Surabaya 2025 - International Youth Innovation Summit Selection Program 2025",
    urlDirect: "https://app.simvent.id/certificates?context=NjM5MDY6TUJHR1VGN1cwRA==",
    published: "Dec 2025",
    srcImage:
      "/img/certificate/cerificate-future-entrepreneur-summit-2025-sby-3.webp",
    thisAcademic: false,
    tags: [
      "Improvement Softskill",
      "Public Speaking",
    ],
  },
  {
    title: "Future Entrepreneur Summit Surabaya 2025 - Improvement Softskill Webinar",
    urlDirect: "https://app.simvent.id/certificates?context=NjM5MDY6TUJHR1VGN1cwRA==",
    published: "Dec 2025",
    srcImage:
      "/img/certificate/cerificate-future-entrepreneur-summit-2025-sby-2.webp",
    thisAcademic: false,
    tags: [
      "Improvement Softskill",
      "Public Speaking",
    ],
  },
  {
    title: "Future Entrepreneur Summit Surabaya 2025 - Participation Certificate",
    urlDirect: "https://app.simvent.id/certificates?context=NjM5MDY6TUJHR1VGN1cwRA==",
    published: "Dec 2025",
    srcImage:
      "/img/certificate/cerificate-future-entrepreneur-summit-2025-sby-1.webp",
    thisAcademic: false,
    tags: [
      "Improvement Softskill",
      "Public Speaking",
    ],
  },
  {
    title: "W3Docs - HTML5 Basic",
    urlDirect:
      "https://www.w3docs.com/quiz/certificate/3/100/1703048695/Taufiiqul%20Hakim/03cb7644103a77baf97c9dbf22de6ad8?version=4",
    published: "Dec 2023",
    srcImage: "/img/certificate/w3docs-html5.webp",
    thisAcademic: false,
    tags: ["Quiz"],
  },
  {
    title: "W3Docs - CSS3 Basic",
    urlDirect:
      "https://www.w3docs.com/quiz/certificate/5/100/1703049421/Taufiiqul%20Hakim/511f03d3a1f77d50371ecf486a66fef4?version=4",
    published: "Dec 2023",
    srcImage: "/img/certificate/w3docs-css3.webp",
    thisAcademic: false,
    tags: ["Quiz"],
  },
  {
    title: "W3Docs - Javascript Basic",
    urlDirect:
      "https://www.w3docs.com/quiz/certificate/4/100/1703051156/Taufiiqul%20Hakim/2da7b8727f097d9e81404e1da266e6f5?version=4",
    published: "Dec 2023",
    srcImage: "/img/certificate/w3docs-javascript.webp",
    thisAcademic: false,
    tags: ["Quiz"],
  },
  {
    title: "W3Docs - PHP Basic",
    urlDirect:
      "https://www.w3docs.com/quiz/certificate/2/100/1703051968/Taufiiqul%20Hakim/b5af64b012a69769ce9c43274e1f7c7e?version=4",
    published: "Dec 2023",
    srcImage: "/img/certificate/w3docs-php.webp",
    thisAcademic: false,
    tags: ["Quiz"],
  },
  {
    title: "W3Docs - Typescript Basic",
    urlDirect:
      "https://www.w3docs.com/quiz/certificate/33/100/1703052807/Taufiiqul%20Hakim/fc878598cf089e7e4d76b16cc78311b7?version=4",
    published: "Dec 2023",
    srcImage: "/img/certificate/w3docs-typescript.webp",
    thisAcademic: false,
    tags: ["Quiz"],
  },
  {
    title: "W3Docs - React Basic",
    urlDirect:
      "https://www.w3docs.com/quiz/certificate/34/100/1703053614/Taufiiqul%20Hakim/2596f078fc66cb09255e80dd19612272?version=4",
    published: "Dec 2023",
    srcImage: "/img/certificate/w3docs-react.webp",
    thisAcademic: false,
    tags: ["Quiz"],
  },
];
