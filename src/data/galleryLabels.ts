/**
 * Hand-written gallery metadata for projects that ship with multiple
 * screenshots. Only the caption lives here — the image paths come from the
 * project data (`images[]` in `projects.ts`).
 *
 * `slug` = the file-name part shared by that project's gallery images
 * (e.g. `transit-live-map.webp` → slug `transit-live-map`).
 */
export type GalleryCaption = { slug: string; label: { en: string; id: string } };

/** Ordered captions; the first entry that matches an image is used. */
export const GALLERY_CAPTIONS: GalleryCaption[] = [
  { slug: 'transit-thumbnail', label: { en: 'Cover', id: 'Sampul' } },
  { slug: 'transit-live-map-dark', label: { en: 'Live map (dark)', id: 'Peta live (gelap)' } },
  { slug: 'transit-live-map', label: { en: 'Live map', id: 'Peta live' } },
  { slug: 'transit-journey', label: { en: 'Journey planner', id: 'Perencana perjalanan' } },
  { slug: 'transit-routes', label: { en: 'Route explorer', id: 'Penjelajah rute' } },
  { slug: 'transit-halte', label: { en: 'Stop search', id: 'Pencarian halte' } },
  { slug: 'transit-mobile-map', label: { en: 'Mobile view', id: 'Tampilan ponsel' } },

  { slug: 'erp-dashboard-new', label: { en: 'Dashboard', id: 'Dasbor' } },
  { slug: 'erp-dashboard-analytics', label: { en: 'Analytics dashboard', id: 'Dasbor analitik' } },
  { slug: 'erp-dashboard', label: { en: 'Dashboard overview', id: 'Ringkasan dasbor' } },
  { slug: 'erp-dashboard-notifications', label: { en: 'Notifications', id: 'Notifikasi' } },
  { slug: 'erp-sales-orders', label: { en: 'Sales orders', id: 'Pesanan penjualan' } },
  { slug: 'erp-purchasing', label: { en: 'Purchasing', id: 'Pembelian' } },
  { slug: 'erp-inventory', label: { en: 'Inventory', id: 'Inventaris' } },
  { slug: 'erp-crm-customers', label: { en: 'CRM customers', id: 'Pelanggan CRM' } },
  { slug: 'erp-finance-invoices', label: { en: 'Finance & invoices', id: 'Keuangan & faktur' } },
  { slug: 'erp-hr-payroll', label: { en: 'HR payroll', id: 'Payroll SDM' } },
  { slug: 'erp-reports', label: { en: 'Reports', id: 'Laporan' } },

  { slug: 'crm-dashboard-new', label: { en: 'Dashboard', id: 'Dasbor' } },
  { slug: 'crm-dashboard-analytics', label: { en: 'Analytics', id: 'Analitik' } },
  { slug: 'crm-dashboard-overview', label: { en: 'Overview', id: 'Ringkasan' } },
  { slug: 'crm-dashboard', label: { en: 'Dashboard', id: 'Dasbor' } },
  { slug: 'crm-sales-pipeline', label: { en: 'Sales pipeline', id: 'Pipeline penjualan' } },
  { slug: 'crm-leads', label: { en: 'Leads', id: 'Prospek' } },
  { slug: 'crm-accounts', label: { en: 'Accounts', id: 'Akun' } },
  { slug: 'crm-customers', label: { en: 'Customers', id: 'Pelanggan' } },
  { slug: 'crm-tasks', label: { en: 'Tasks', id: 'Tugas' } },
  { slug: 'crm-audit-log', label: { en: 'Audit log', id: 'Log audit' } },
  { slug: 'crm-analytics', label: { en: 'Reports', id: 'Laporan' } },

  { slug: 'hris-dashboard-new', label: { en: 'Dashboard', id: 'Dasbor' } },
  { slug: 'hris-dashboard-analytics', label: { en: 'Analytics', id: 'Analitik' } },
  { slug: 'hris-dashboard', label: { en: 'Dashboard', id: 'Dasbor' } },
  { slug: 'hris-employees', label: { en: 'Employees', id: 'Karyawan' } },
  { slug: 'hris-attendance', label: { en: 'Attendance', id: 'Kehadiran' } },
  { slug: 'hris-payroll', label: { en: 'Payroll', id: 'Payroll' } },
  { slug: 'hris-recruitment', label: { en: 'Recruitment', id: 'Rekrutmen' } },
  { slug: 'hris-performance-reviews', label: { en: 'Performance reviews', id: 'Review performa' } },
  { slug: 'hris-goals', label: { en: 'Goals', id: 'Tujuan' } },
  { slug: 'hris-training', label: { en: 'Training', id: 'Pelatihan' } },
  { slug: 'hris-reports', label: { en: 'Reports', id: 'Laporan' } },
  { slug: 'hris-my-workspace', label: { en: 'My workspace', id: 'Ruang kerja saya' } },

  { slug: 'eschool-hero-new', label: { en: 'Cover', id: 'Sampul' } },
  { slug: 'eschool-website-hero', label: { en: 'Public website', id: 'Situs publik' } },
  { slug: 'eschool-dashboard-analytics', label: { en: 'Analytics dashboard', id: 'Dasbor analitik' } },
  { slug: 'eschool-dashboard', label: { en: 'Dashboard', id: 'Dasbor' } },
  { slug: 'eschool-admissions', label: { en: 'Admissions', id: 'Penerimaan siswa' } },
  { slug: 'eschool-ppdb-applications', label: { en: 'PPDB applications', id: 'Pendaftaran PPDB' } },
  { slug: 'eschool-lms-dashboard', label: { en: 'LMS dashboard', id: 'Dasbor LMS' } },
  { slug: 'eschool-lms-assignments', label: { en: 'LMS assignments', id: 'Tugas LMS' } },
  { slug: 'eschool-lms-signin', label: { en: 'LMS sign-in', id: 'Masuk LMS' } },
  { slug: 'eschool-finance-invoices', label: { en: 'Finance & invoices', id: 'Keuangan & faktur' } },
  { slug: 'eschool-student-affairs', label: { en: 'Student affairs', id: 'Kesiswaan' } },
  { slug: 'eschool-feature-toggles', label: { en: 'Feature toggles', id: 'Pengaturan fitur' } },

  { slug: 'resto-landing-new', label: { en: 'Cover', id: 'Sampul' } },
  { slug: 'resto-landing', label: { en: 'Landing page', id: 'Halaman utama' } },
  { slug: 'resto-dashboard', label: { en: 'Dashboard', id: 'Dasbor' } },
  { slug: 'resto-customer-menu', label: { en: 'Customer menu', id: 'Menu pelanggan' } },
  { slug: 'resto-customer-cart', label: { en: 'Customer cart', id: 'Keranjang pelanggan' } },
  { slug: 'resto-customer-checkout', label: { en: 'Checkout', id: 'Pembayaran' } },
  { slug: 'resto-orders', label: { en: 'Orders', id: 'Pesanan' } },
  { slug: 'resto-menu-management', label: { en: 'Menu management', id: 'Kelola menu' } },
  { slug: 'resto-tables-qr', label: { en: 'Tables & QR', id: 'Meja & QR' } },
];

const bySlug = new Map(GALLERY_CAPTIONS.map((c) => [c.slug, c.label]));

/** Longest-slug-first lookup so `x-hero-new` beats `x` when both exist. */
const slugsByLength = GALLERY_CAPTIONS.map((c) => c.slug).toSorted((a, b) => b.length - a.length);

/** Resolve a caption for a gallery image path. */
export const galleryLabel = (src: string, lang: 'en' | 'id'): string => {
  const file = src.split('/').pop()?.replace(/\.\w+$/, '') ?? '';
  const hit = slugsByLength.find((slug) => file === slug || file.startsWith(slug + '-'));
  if (hit) return bySlug.get(hit)![lang];
  // Fallback: tidy the file name into "Title Case".
  return file
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};
