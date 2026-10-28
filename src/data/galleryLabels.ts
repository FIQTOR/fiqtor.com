/**
 * Hand-written gallery metadata for projects that ship with multiple
 * screenshots. Only the caption lives here — the image paths come from the
 * project data (`images[]` in `projects.ts`).
 *
 * `slug` = the file-name part shared by that project's gallery images
 * (e.g. `transit-live-map.webp` → slug `transit-live-map`).
 */
export type GalleryCaption = { slug: string; label: { en: string; id: string; zh: string } };

/** Ordered captions; the first entry that matches an image is used. */
export const GALLERY_CAPTIONS: GalleryCaption[] = [
  { slug: 'transit-thumbnail', label: { en: 'Cover', id: 'Sampul', zh: '封面' } },
  { slug: 'transit-live-map-dark', label: { en: 'Live map (dark)', id: 'Peta live (gelap)', zh: '实时地图 (暗黑)' } },
  { slug: 'transit-live-map', label: { en: 'Live map', id: 'Peta live', zh: '实时地图' } },
  { slug: 'transit-journey', label: { en: 'Journey planner', id: 'Perencana perjalanan', zh: '出行规划' } },
  { slug: 'transit-routes', label: { en: 'Route explorer', id: 'Penjelajah rute', zh: '路线探索' } },
  { slug: 'transit-halte', label: { en: 'Stop search', id: 'Pencarian halte', zh: '站点搜索' } },
  { slug: 'transit-mobile-map', label: { en: 'Mobile view', id: 'Tampilan ponsel', zh: '移动端视图' } },

  { slug: 'erp-dashboard-new', label: { en: 'Dashboard', id: 'Dasbor', zh: '仪表盘' } },
  { slug: 'erp-dashboard-analytics', label: { en: 'Analytics dashboard', id: 'Dasbor analitik', zh: '数据分析仪表盘' } },
  { slug: 'erp-dashboard', label: { en: 'Dashboard overview', id: 'Ringkasan dasbor', zh: '仪表盘总览' } },
  { slug: 'erp-dashboard-notifications', label: { en: 'Notifications', id: 'Notifikasi', zh: '通知中心' } },
  { slug: 'erp-sales-orders', label: { en: 'Sales orders', id: 'Pesanan penjualan', zh: '销售订单' } },
  { slug: 'erp-purchasing', label: { en: 'Purchasing', id: 'Pembelian', zh: '采购管理' } },
  { slug: 'erp-inventory', label: { en: 'Inventory', id: 'Inventaris', zh: '库存盘点' } },
  { slug: 'erp-crm-customers', label: { en: 'CRM customers', id: 'Pelanggan CRM', zh: 'CRM 客户管理' } },
  { slug: 'erp-finance-invoices', label: { en: 'Finance & invoices', id: 'Keuangan & faktur', zh: '财务与发票' } },
  { slug: 'erp-hr-payroll', label: { en: 'HR payroll', id: 'Payroll SDM', zh: '人力资源薪酬' } },
  { slug: 'erp-reports', label: { en: 'Reports', id: 'Laporan', zh: '数据报表' } },

  { slug: 'crm-dashboard-new', label: { en: 'Dashboard', id: 'Dasbor', zh: '仪表盘' } },
  { slug: 'crm-dashboard-analytics', label: { en: 'Analytics', id: 'Analitik', zh: '分析统计' } },
  { slug: 'crm-dashboard-overview', label: { en: 'Overview', id: 'Ringkasan', zh: '概览' } },
  { slug: 'crm-dashboard', label: { en: 'Dashboard', id: 'Dasbor', zh: '仪表盘' } },
  { slug: 'crm-sales-pipeline', label: { en: 'Sales pipeline', id: 'Pipeline penjualan', zh: '销售漏斗' } },
  { slug: 'crm-leads', label: { en: 'Leads', id: 'Prospek', zh: '潜在客户' } },
  { slug: 'crm-accounts', label: { en: 'Accounts', id: 'Akun', zh: '客户账户' } },
  { slug: 'crm-customers', label: { en: 'Customers', id: 'Pelanggan', zh: '客户列表' } },
  { slug: 'crm-tasks', label: { en: 'Tasks', id: 'Tugas', zh: '任务看板' } },
  { slug: 'crm-audit-log', label: { en: 'Audit log', id: 'Log audit', zh: '审计日志' } },
  { slug: 'crm-analytics', label: { en: 'Reports', id: 'Laporan', zh: '数据报表' } },

  { slug: 'hris-dashboard-new', label: { en: 'Dashboard', id: 'Dasbor', zh: '仪表盘' } },
  { slug: 'hris-dashboard-analytics', label: { en: 'Analytics', id: 'Analitik', zh: '分析统计' } },
  { slug: 'hris-dashboard', label: { en: 'Dashboard', id: 'Dasbor', zh: '仪表盘' } },
  { slug: 'hris-employees', label: { en: 'Employees', id: 'Karyawan', zh: '员工花名册' } },
  { slug: 'hris-attendance', label: { en: 'Attendance', id: 'Kehadiran', zh: '考勤记录' } },
  { slug: 'hris-payroll', label: { en: 'Payroll', id: 'Payroll', zh: '薪资结算' } },
  { slug: 'hris-recruitment', label: { en: 'Recruitment', id: 'Rekrutmen', zh: '招聘管理' } },
  { slug: 'hris-performance-reviews', label: { en: 'Performance reviews', id: 'Review performa', zh: '绩效考核' } },
  { slug: 'hris-goals', label: { en: 'Goals', id: 'Tujuan', zh: '目标管理' } },
  { slug: 'hris-training', label: { en: 'Training', id: 'Pelatihan', zh: '员工培训' } },
  { slug: 'hris-reports', label: { en: 'Reports', id: 'Laporan', zh: '数据报表' } },
  { slug: 'hris-my-workspace', label: { en: 'My workspace', id: 'Ruang kerja saya', zh: '个人工作台' } },

  { slug: 'eschool-hero-new', label: { en: 'Cover', id: 'Sampul', zh: '封面' } },
  { slug: 'eschool-website-hero', label: { en: 'Public website', id: 'Situs publik', zh: '前台门户' } },
  { slug: 'eschool-dashboard-analytics', label: { en: 'Analytics dashboard', id: 'Dasbor analitik', zh: '数据分析仪表盘' } },
  { slug: 'eschool-dashboard', label: { en: 'Dashboard', id: 'Dasbor', zh: '仪表盘' } },
  { slug: 'eschool-admissions', label: { en: 'Admissions', id: 'Penerimaan siswa', zh: '招生工作' } },
  { slug: 'eschool-ppdb-applications', label: { en: 'PPDB applications', id: 'Pendaftaran PPDB', zh: '招生报名' } },
  { slug: 'eschool-lms-dashboard', label: { en: 'LMS dashboard', id: 'Dasbor LMS', zh: 'LMS 教学看板' } },
  { slug: 'eschool-lms-assignments', label: { en: 'LMS assignments', id: 'Tugas LMS', zh: 'LMS 作业批改' } },
  { slug: 'eschool-lms-signin', label: { en: 'LMS sign-in', id: 'Masuk LMS', zh: 'LMS 登录界面' } },
  { slug: 'eschool-finance-invoices', label: { en: 'Finance & invoices', id: 'Keuangan & faktur', zh: '财务与发票' } },
  { slug: 'eschool-student-affairs', label: { en: 'Student affairs', id: 'Kesiswaan', zh: '学生工作' } },
  { slug: 'eschool-feature-toggles', label: { en: 'Feature toggles', id: 'Pengaturan fitur', zh: '功能开关配置' } },

  { slug: 'resto-landing-new', label: { en: 'Cover', id: 'Sampul', zh: '封面' } },
  { slug: 'resto-landing', label: { en: 'Landing page', id: 'Halaman utama', zh: '产品落地页' } },
  { slug: 'resto-dashboard', label: { en: 'Dashboard', id: 'Dasbor', zh: '仪表盘' } },
  { slug: 'resto-customer-menu', label: { en: 'Customer menu', id: 'Menu pelanggan', zh: '顾客点餐菜单' } },
  { slug: 'resto-customer-cart', label: { en: 'Customer cart', id: 'Keranjang pelanggan', zh: '点餐购物车' } },
  { slug: 'resto-customer-checkout', label: { en: 'Checkout', id: 'Pembayaran', zh: '结账支付' } },
  { slug: 'resto-orders', label: { en: 'Orders', id: 'Pesanan', zh: '订单流转' } },
  { slug: 'resto-menu-management', label: { en: 'Menu management', id: 'Kelola menu', zh: '菜品分类管理' } },
  { slug: 'resto-tables-qr', label: { en: 'Tables & QR', id: 'Meja & QR', zh: '桌台与餐桌码' } },
];

const bySlug = new Map(GALLERY_CAPTIONS.map((c) => [c.slug, c.label]));

/** Longest-slug-first lookup so `x-hero-new` beats `x` when both exist. */
const slugsByLength = GALLERY_CAPTIONS.map((c) => c.slug).toSorted((a, b) => b.length - a.length);

/** Resolve a caption for a gallery image path. */
export const galleryLabel = (src: string, lang: 'en' | 'id' | 'zh'): string => {
  const file = src.split('/').pop()?.replace(/\.\w+$/, '') ?? '';
  const hit = slugsByLength.find((slug) => file === slug || file.startsWith(slug + '-'));
  if (hit) {
    const val = bySlug.get(hit);
    if (val) return (val as Record<string, string>)[lang] || val.en;
  }
  // Fallback: tidy the file name into "Title Case".
  return file
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};
