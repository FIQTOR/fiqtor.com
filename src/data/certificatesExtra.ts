/**
 * Optional long-form descriptions for selected certificates, keyed by the
 * exact certificate title (used only in the detail modal).
 *
 * The titles and issuers themselves live in `certificates.ts`; this file only
 * adds context so a card can explain *why* the credential matters.
 */
export const CERTIFICATE_DESCRIPTIONS: Record<string, string> = {
  'BNSP — National Professional Certification: Certified Junior Web Developer (Competency Certificate)':
    'A national competency certificate issued by Indonesia\'s professional certification body (BNSP). It verifies, through a formal competency assessment, that the holder can build and maintain web applications — from structuring HTML documents and styling with CSS to writing client-side logic with JavaScript and working with a database-backed backend.',
  'SEAMEO QITEP in Science (SEAQIS) — Web Cloud Engineering Champion (1st Place out of 24 Teams)':
    'First place in a cloud engineering competition run by SEAMEO QITEP in Science (SEAQIS). As part of a 24-team field, the solution deployed a Laravel application to a cloud VM (Laravel SAIL) with a MySQL database, configured the server over SSH with PuTTY, and containerised the stack with Docker. The score sheet is included as the second image.',
  'LKS SMK East Java XXXII — Web Technologies: 4th Place / Rank 4 of 44 (Provincial Level)':
    'Competed in the Provincial Skills Competition (Lomba Kompetensi Siswa, LKS) for Web Technologies at the East Java level, placing 4th overall. The competition tests building a full web application against a detailed client brief under a strict time limit.',
  'LKS SMK Jombang Regency XXXII — Web Technologies Champion (1st Place)':
    'First place in the Web Technologies category of the district-level Skills Competition (LKS) in Jombang Regency — the qualifying round for the provincial competition, where the same candidate went on to place 4th in East Java.',
  'Airofest by Airnology 2.0 (Universitas Airlangga) — National Coding Challenge Competition':
    'Participant in a national coding challenge organised by Airnology at Universitas Airlangga, judged on solving algorithmic and web programming problems against teams from universities across Indonesia.',
  'freeCodeCamp — Responsive Web Design Certification':
    'A hands-on certification covering semantic HTML, modern CSS layout (Flexbox and Grid), responsive design, accessibility, and the projects required to prove each skill.',
  'freeCodeCamp — Front-End Development Libraries Certification':
    'A hands-on certification covering the core front-end libraries used in production: React for UI, Redux for state management, Sass, Bootstrap, and jQuery, completed with five build-it-yourself projects.',
  'GEMA Foundation — Storytelling Agenda TOEIC Test (Score 640)':
    'An official TOEIC (Test of English for International Communication) score of 640, taken through the GEMA Foundation storytelling agenda — evidence of working proficiency in English.',
  'SEAMEO QITEP in Science — Internship / Praktik Kerja Lapangan (Distinction)':
    'Completed the industrial internship (Praktik Kerja Lapangan) at SEAQIS with a distinction grade. The internship produced the QR-based employee attendance system that later shipped to production.',
  'Politeknik Elektronika Negeri Surabaya (PENS) — Webinar: SQL Query Optimization':
    'Attended a technical webinar by Politeknik Elektronika Negeri Surabaya on optimising SQL queries — indexing strategy, execution plans, and avoiding the common N+1 pattern.',
  'Dilesin.id — C++ Programming Fundamentals #2 (Certified)':
    'A certified C++ programming course covering pointers, memory management, object-oriented design, and standard library containers.',
};
