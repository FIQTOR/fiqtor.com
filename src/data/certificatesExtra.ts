import type { LocalizedText } from "./site";

/**
 * Optional long-form descriptions for selected certificates, keyed by the
 * exact certificate title (used only in the detail modal).
 */
export const CERTIFICATE_DESCRIPTIONS: Record<string, LocalizedText> = {
  'BNSP — National Professional Certification: Certified Junior Web Developer (Competency Certificate)': {
    en: "A national competency certificate issued by Indonesia's professional certification body (BNSP). It verifies, through a formal competency assessment, that the holder can build and maintain web applications — from structuring HTML documents and styling with CSS to writing client-side logic with JavaScript and working with a database-backed backend.",
    id: 'Sertifikat kompetensi nasional yang diterbitkan oleh Badan Nasional Sertifikasi Profesi (BNSP). Memverifikasi melalui asesmen kompetensi resmi bahwa pemegang sertifikat mampu membangun dan memelihara aplikasi web — mulai dari struktur HTML, styling CSS, logika JavaScript, hingga backend dengan basis data.',
    zh: '印度尼西亚国家专业认证机构 (BNSP) 颁发的国家能力资质证书。通过严谨的专业考核，验证证书持有者具备独立构建与维护 Web 应用程序的能力 — 涵盖 HTML 结构、CSS 样式、JavaScript 前端交互以及后端数据库开发。',
  },
  'SEAMEO QITEP in Science (SEAQIS) — Web Cloud Engineering Champion (1st Place out of 24 Teams)': {
    en: 'First place in a cloud engineering competition run by SEAMEO QITEP in Science (SEAQIS). As part of a 24-team field, the solution deployed a Laravel application to a cloud VM (Laravel SAIL) with a MySQL database, configured the server over SSH with PuTTY, and containerised the stack with Docker. The score sheet is included as the second image.',
    id: 'Juara 1 dalam kompetisi cloud engineering yang diadakan oleh SEAMEO QITEP in Science (SEAQIS). Dari 24 tim peserta, solusi yang dikerjakan mencakup deployment aplikasi Laravel ke VM cloud (Laravel SAIL) dengan basis data MySQL, konfigurasi server via SSH, dan kontainerisasi Docker. Lembar penilaian disertakan sebagai gambar kedua.',
    zh: '在由 SEAMEO QITEP in Science (SEAQIS) 举办的 Web 云工程竞赛中荣获第 1 名（共 24 支队伍）。参赛方案成功将 Laravel 应用部署至云端虚拟机（Laravel SAIL）与 MySQL 数据库，通过 SSH/PuTTY 配置服务器，并使用 Docker 完成全栈容器化交付。评分明细表包含在第二张附图中。',
  },
  'LKS SMK East Java XXXII — Web Technologies: 4th Place / Rank 4 of 44 (Provincial Level)': {
    en: 'Competed in the Provincial Skills Competition (Lomba Kompetensi Siswa, LKS) for Web Technologies at the East Java level, placing 4th overall. The competition tests building a full web application against a detailed client brief under a strict time limit.',
    id: 'Berkompetisi di Lomba Kompetensi Siswa (LKS) bidang Web Technologies tingkat Provinsi Jawa Timur, meraih juara harapan 1 (peringkat 4 dari 44). Menguji pembangunan aplikasi web lengkap sesuai brief klien dalam batasan waktu yang ketat.',
    zh: '参加东爪哇省职业技能大赛（LKS SMK）Web Technologies 赛道，并在 44 名顶尖选手中荣获全省第 4 名。比赛要求在极具挑战的高压限时内，严格按照详尽的客户业务需求从零开发出高可用全栈 Web 应用。',
  },
  'LKS SMK Jombang Regency XXXII — Web Technologies Champion (1st Place)': {
    en: 'First place in the Web Technologies category of the district-level Skills Competition (LKS) in Jombang Regency — the qualifying round for the provincial competition, where the same candidate went on to place 4th in East Java.',
    id: 'Juara 1 dalam Lomba Kompetensi Siswa (LKS) bidang Web Technologies tingkat Kabupaten Jombang — babak kualifikasi menuju tingkat provinsi, di mana perwakilan ini kemudian meraih peringkat 4 di Jawa Timur.',
    zh: '在 Jombang 县级职业技能大赛（LKS SMK）Web Technologies 赛道中斩获冠军（第 1 名）— 作为该地区唯一代表晋级省赛，并在东爪哇全省决赛中斩获第 4 名。',
  },
  'Airofest by Airnology 2.0 (Universitas Airlangga) — National Coding Challenge Competition': {
    en: 'Participant in a national coding challenge organised by Airnology at Universitas Airlangga, judged on solving algorithmic and web programming problems against teams from universities across Indonesia.',
    id: 'Peserta kompetisi coding nasional yang diselenggarakan oleh Airnology Universitas Airlangga, diuji dalam pemecahan masalah algoritma dan pemrograman web melawan tim dari berbagai universitas se-Indonesia.',
    zh: '受邀参加由艾尔朗加大学（Universitas Airlangga）举办的全国编程挑战赛（Airnology 2.0），与来自全印尼各知名高校的技术团队在算法设计与 Web 编程问题上进行激烈同台角逐。',
  },
  'freeCodeCamp — Responsive Web Design Certification': {
    en: 'A hands-on certification covering semantic HTML, modern CSS layout (Flexbox and Grid), responsive design, accessibility, and the projects required to prove each skill.',
    id: 'Sertifikasi praktik yang mencakup HTML semantik, tata letak CSS modern (Flexbox dan Grid), desain responsif, aksesibilitas web, serta rangkaian proyek mandiri untuk membuktikan setiap keahlian.',
    zh: '实战型能力认证，深入覆盖语义化 HTML、现代 CSS 布局系统（Flexbox 与 CSS Grid）、全终端自适应响应式设计、无障碍标准（a11y）以及 5 项严苛的独立实战项目考核。',
  },
  'freeCodeCamp — Front-End Development Libraries Certification': {
    en: 'A hands-on certification covering the core front-end libraries used in production: React for UI, Redux for state management, Sass, Bootstrap, and jQuery, completed with five build-it-yourself projects.',
    id: 'Sertifikasi praktik yang mencakup pustaka front-end utama untuk produksi: React untuk UI, Redux untuk state management, Sass, Bootstrap, dan jQuery, diselesaikan melalui lima proyek mandiri.',
    zh: '工业级前端生态核心库能力认证，系统覆盖生产环境核心技术：React 界面架构、Redux 状态管理、Sass 预处理、Bootstrap 与 jQuery，并通过 5 个完整的端到端独立应用验证交付。',
  },
  'GEMA Foundation — Storytelling Agenda TOEIC Test (Score 640)': {
    en: 'An official TOEIC (Test of English for International Communication) score of 640, taken through the GEMA Foundation storytelling agenda — evidence of working proficiency in English.',
    id: 'Skor resmi TOEIC (Test of English for International Communication) sebesar 640 melalui agenda GEMA Foundation — bukti kemahiran bahasa Inggris tingkat kerja dan profesional.',
    zh: 'TOEIC（国际交流英语考试）官方权威成绩 640 分，通过 GEMA 基金会项目完成考核 — 具备流利的国际工程英语技术沟通与跨国协作能力。',
  },
  'SEAMEO QITEP in Science — Internship / Praktik Kerja Lapangan (Distinction)': {
    en: 'Completed the industrial internship (Praktik Kerja Lapangan) at SEAQIS with a distinction grade. The internship produced the QR-based employee attendance system that later shipped to production.',
    id: 'Menyelesaikan Praktik Kerja Lapangan (PKL) industri di SEAQIS dengan predikat sangat memuaskan (Distinction). Magang ini menghasilkan sistem absensi QR karyawan yang kemudian diimplementasikan ke produksi.',
    zh: '在东南亚教育部长组织科学教学质量改进中心（SEAQIS）完成工业级软件工程实习并以优异成绩（Distinction）毕业。实习期间主导设计并研发了基于二维码的员工智能考勤管理系统，随后成功投入日常生产环境。',
  },
  'Politeknik Elektronika Negeri Surabaya (PENS) — Webinar: SQL Query Optimization': {
    en: 'Attended a technical webinar by Politeknik Elektronika Negeri Surabaya on optimising SQL queries — indexing strategy, execution plans, and avoiding the common N+1 pattern.',
    id: 'Mengikuti webinar teknis dari PENS mengenai optimasi kueri SQL — strategi indeks, analisis execution plan, serta penghindaran masalah umum N+1.',
    zh: '参与泗水电子工程理工学院（PENS）SQL 数据库深度优化专题技术研讨，掌握索引架构策略、查询执行计划深度剖析以及规避 N+1 性能瓶颈的工程方案。',
  },
  'Dilesin.id — C++ Programming Fundamentals #2 (Certified)': {
    en: 'A certified C++ programming course covering pointers, memory management, object-oriented design, and standard library containers.',
    id: 'Kursus pemrograman C++ bersertifikat yang mencakup pointer, manajemen memori, pemrograman berorientasi objek (OOP), dan kontainer library standar.',
    zh: 'C++ 高级编程语言认证进修，系统掌握底层指针运算、精细内存管理机制、面向对象架构设计（OOP）及标准模板库（STL）核心容器实操。',
  },
};
