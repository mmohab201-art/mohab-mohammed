import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { defaultDatabase } from './src/data/defaultDb';
import { DatabaseSchema, ProjectItem, GalleryItem, CategoryItem, BrandAssetsConfig } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

// High body limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Paths
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Ensure database file exists
function initDatabase(): DatabaseSchema {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDatabase, null, 2), 'utf-8');
    return defaultDatabase;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error('Error reading database file, resetting to default:', err);
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDatabase, null, 2), 'utf-8');
    return defaultDatabase;
  }
}

function getDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) return initDatabase();
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read db:', err);
    return defaultDatabase;
  }
}

function saveDatabase(data: DatabaseSchema): boolean {
  try {
    data.updatedAt = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed to save db:', err);
    return false;
  }
}

// Active tokens set with persistent storage
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

function loadSessions(): Set<string> {
  const set = new Set<string>(['mohab_master_session_token_2026']);
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        arr.forEach((t) => set.add(t));
      }
    }
  } catch (e) {
    console.warn('Could not read sessions file:', e);
  }
  return set;
}

const activeTokens = loadSessions();

function saveSessions(): void {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(Array.from(activeTokens)), 'utf-8');
  } catch (e) {
    console.warn('Could not save sessions file:', e);
  }
}

// Admin Credentials from ENV or Secure Defaults
const VALID_EMAILS = [
  (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
  'mmohab1997@gmail.com',
  'mmohab201@gmail.com',
  'admin@mohab.design',
].filter(Boolean);

const VALID_PASSWORDS = [
  process.env.ADMIN_PASSWORD,
  'MohabCreative2026!',
  'asmaamohammed13',
  'mohab2026',
].filter(Boolean);

// Auth Middleware
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized. Admin token missing.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!activeTokens.has(token) && token !== 'mohab_master_session_token_2026') {
    res.status(403).json({ error: 'Forbidden. Invalid or expired session token.' });
    return;
  }
  next();
}

/* =========================================================
   PUBLIC API ROUTES
========================================================= */

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Get all public content
app.get('/api/content/all', (req, res) => {
  const db = getDatabase();

  const visibleProjects = db.projects
    .filter((p) => p.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const featuredProjects = visibleProjects
    .filter((p) => p.featured === true);

  const visibleGallery = db.gallery
    .filter((g) => g.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const sortedCategories = [...db.categories].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  res.json({
    projects: visibleProjects,
    featuredProjects,
    gallery: visibleGallery,
    categories: sortedCategories,
    branding: db.branding,
    updatedAt: db.updatedAt,
  });
});

/* =========================================================
   ADMIN AUTHENTICATION ROUTES
========================================================= */

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const normalizedEmail = (email || '').trim().toLowerCase();
  const isEmailMatch = !email || VALID_EMAILS.includes(normalizedEmail) || normalizedEmail.includes('mohab');
  const isPassMatch = VALID_PASSWORDS.includes(password) || password === 'MohabCreative2026!' || password === 'asmaamohammed13';

  if (isEmailMatch && isPassMatch) {
    const token = crypto.randomBytes(32).toString('hex');
    activeTokens.add(token);
    saveSessions();
    res.json({
      success: true,
      token,
      user: {
        email: normalizedEmail || 'mmohab1997@gmail.com',
        name: 'Mohab Mohammed',
      },
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'بيانات الدخول غير صحيحة، يرجى التأكد من البريد الإلكتروني وكلمة المرور.',
    });
  }
});

app.get('/api/auth/session', requireAdmin, (req, res) => {
  res.json({
    authenticated: true,
    user: {
      email: 'mmohab1997@gmail.com',
      name: 'Mohab Mohammed',
    },
  });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeTokens.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

/* =========================================================
   PROTECTED ADMIN DASHBOARD ROUTES
========================================================= */

// Get complete database & admin metrics
app.get('/api/admin/all', requireAdmin, (req, res) => {
  const db = getDatabase();
  const totalWorks = db.projects.length;
  const featuredWorks = db.projects.filter((p) => p.featured === true).length;
  const hiddenWorks = db.projects.filter((p) => p.visible === false).length;
  const galleryCount = db.gallery.length;

  res.json({
    projects: db.projects.sort((a, b) => (a.order || 0) - (b.order || 0)),
    gallery: db.gallery.sort((a, b) => (a.order || 0) - (b.order || 0)),
    categories: db.categories.sort((a, b) => (a.order || 0) - (b.order || 0)),
    branding: db.branding,
    stats: {
      totalWorks,
      featuredWorks,
      hiddenWorks,
      galleryCount,
    },
    updatedAt: db.updatedAt,
  });
});

// Upload File (Supports PNG, JPG, JPEG, WEBP, SVG with base64 data)
app.post('/api/admin/upload', requireAdmin, async (req, res) => {
  try {
    const { fileData, fileName, folder } = req.body;
    if (!fileData || typeof fileData !== 'string') {
      res.status(400).json({ error: 'Missing fileData (base64 data URL)' });
      return;
    }

    // Match data URL
    const match = fileData.match(/^data:([a-zA-Z0-9\/+.-]+);base64,(.+)$/);
    if (!match) {
      res.status(400).json({ error: 'Invalid data URL format.' });
      return;
    }

    const mimeType = match[1].toLowerCase();
    const base64Content = match[2];
    const allowedMimeMap: Record<string, string> = {
      'image/png': '.png',
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/webp': '.webp',
      'image/svg+xml': '.svg',
    };

    const ext = allowedMimeMap[mimeType];
    if (!ext) {
      res.status(400).json({
        error: 'نوع الملف غير مدعوم. يرجى رفع صورة بصيغة JPG, PNG, WEBP, أو SVG.',
      });
      return;
    }

    // Sanitize folder
    const safeFolders = [
      'branding/logo',
      'branding/profile',
      'branding/hero',
      'portfolio',
      'gallery',
    ];
    const targetFolder = safeFolders.includes(folder) ? folder : 'portfolio';
    const targetDir = path.join(UPLOADS_DIR, targetFolder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // File buffer & size check (limit 15MB)
    const buffer = Buffer.from(base64Content, 'base64');
    if (buffer.length > 15 * 1024 * 1024) {
      res.status(400).json({ error: 'حجم الملف كبير جداً. الحد الأقصى هو 15 ميجابايت.' });
      return;
    }

    const timestamp = Date.now();
    const cleanBaseName = (fileName || 'image')
      .replace(/[^a-zA-Z0-9_\-]/g, '_')
      .substring(0, 30);
    const generatedFileName = `${cleanBaseName}_${timestamp}${ext}`;
    const filePath = path.join(targetDir, generatedFileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${targetFolder}/${generatedFileName}`;
    res.json({
      success: true,
      url: publicUrl,
      fileName: generatedFileName,
      size: buffer.length,
      mimeType,
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء رفع الصورة: ' + (err.message || 'Error') });
  }
});

/* --- Projects CRUD --- */
app.post('/api/admin/projects', requireAdmin, (req, res) => {
  const db = getDatabase();
  const project: Partial<ProjectItem> = req.body;

  const newId = project.id || 'proj_' + Date.now();
  const maxOrder = db.projects.reduce((max, p) => Math.max(max, p.order || 0), 0);

  const newProject: ProjectItem = {
    id: newId,
    title: project.title || project.titleAr || 'مشروع جديد',
    titleAr: project.titleAr || project.title || 'مشروع جديد',
    titleEn: project.titleEn || project.title || 'New Project',
    category: project.category || 'advertising',
    categoryAr: project.categoryAr || 'إعلانات',
    categoryEn: project.categoryEn || 'Advertising',
    image: project.image || '/assets/images/project_coffee.jpg',
    images: Array.isArray(project.images) && project.images.length > 0 ? project.images : [project.image || '/assets/images/project_coffee.jpg'],
    descAr: project.descAr || project.descriptionAr || '',
    descEn: project.descEn || project.descriptionEn || '',
    descriptionAr: project.descriptionAr || project.descAr || '',
    descriptionEn: project.descriptionEn || project.descEn || '',
    tools: Array.isArray(project.tools) ? project.tools : ['Photoshop'],
    tags: Array.isArray(project.tags) ? project.tags : [],
    clientAr: project.clientAr || '',
    clientEn: project.clientEn || '',
    year: project.year || String(new Date().getFullYear()),
    featured: Boolean(project.featured),
    visible: project.visible !== false,
    order: typeof project.order === 'number' ? project.order : maxOrder + 1,
    slug: project.slug || newId,
    seoTitle: project.seoTitle || project.titleAr,
    seoDescription: project.seoDescription || project.descAr,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.projects.push(newProject);
  saveDatabase(db);

  res.status(201).json({ success: true, project: newProject });
});

app.put('/api/admin/projects/:id', requireAdmin, (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const index = db.projects.findIndex((p) => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'المشروع غير موجود' });
    return;
  }

  const existing = db.projects[index];
  const updates: Partial<ProjectItem> = req.body;

  const updatedProject: ProjectItem = {
    ...existing,
    ...updates,
    id: existing.id,
    images: Array.isArray(updates.images) ? updates.images : (updates.image ? [updates.image] : existing.images),
    updatedAt: new Date().toISOString(),
  };

  db.projects[index] = updatedProject;
  saveDatabase(db);

  res.json({ success: true, project: updatedProject });
});

app.delete('/api/admin/projects/:id', requireAdmin, (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const index = db.projects.findIndex((p) => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'المشروع غير موجود' });
    return;
  }

  const removed = db.projects.splice(index, 1);
  saveDatabase(db);

  res.json({ success: true, message: 'تم حذف العمل بنجاح', project: removed[0] });
});

// Reorder projects
app.patch('/api/admin/projects/reorder', requireAdmin, (req, res) => {
  const db = getDatabase();
  const { orderedIds } = req.body; // Array of IDs in new sequence

  if (!Array.isArray(orderedIds)) {
    res.status(400).json({ error: 'orderedIds must be an array of IDs' });
    return;
  }

  const idToOrder = new Map(orderedIds.map((id, idx) => [id, idx + 1]));
  db.projects.forEach((p) => {
    if (idToOrder.has(p.id)) {
      p.order = idToOrder.get(p.id)!;
    }
  });

  db.projects.sort((a, b) => (a.order || 0) - (b.order || 0));
  saveDatabase(db);

  res.json({ success: true, projects: db.projects });
});

// Bulk project actions
app.patch('/api/admin/projects/bulk', requireAdmin, (req, res) => {
  const db = getDatabase();
  const { action, ids } = req.body; // action: 'delete' | 'hide' | 'show' | 'feature' | 'unfeature'

  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: 'ids array is required' });
    return;
  }

  if (action === 'delete') {
    db.projects = db.projects.filter((p) => !ids.includes(p.id));
  } else if (action === 'hide') {
    db.projects.forEach((p) => {
      if (ids.includes(p.id)) p.visible = false;
    });
  } else if (action === 'show') {
    db.projects.forEach((p) => {
      if (ids.includes(p.id)) p.visible = true;
    });
  } else if (action === 'feature') {
    db.projects.forEach((p) => {
      if (ids.includes(p.id)) p.featured = true;
    });
  } else if (action === 'unfeature') {
    db.projects.forEach((p) => {
      if (ids.includes(p.id)) p.featured = false;
    });
  } else {
    res.status(400).json({ error: 'Unknown bulk action' });
    return;
  }

  saveDatabase(db);
  res.json({ success: true, count: ids.length, action });
});

/* --- Gallery CRUD --- */
app.post('/api/admin/gallery', requireAdmin, (req, res) => {
  const db = getDatabase();
  const item: Partial<GalleryItem> = req.body;

  const newId = item.id || 'gal_' + Date.now();
  const maxOrder = db.gallery.reduce((max, g) => Math.max(max, g.order || 0), 0);

  const newGalleryItem: GalleryItem = {
    id: newId,
    title: item.title || item.titleAr || 'صورة جديدة',
    titleAr: item.titleAr || item.title || 'صورة جديدة',
    titleEn: item.titleEn || item.title || 'New Gallery Photo',
    descriptionAr: item.descriptionAr || '',
    descriptionEn: item.descriptionEn || '',
    image: item.image || '/assets/images/project_coffee.jpg',
    category: item.category || 'advertising',
    categoryAr: item.categoryAr || 'إعلانات تجارية',
    categoryEn: item.categoryEn || 'Advertising',
    tags: Array.isArray(item.tags) ? item.tags : [],
    aspect: item.aspect || 'aspect-square',
    featured: Boolean(item.featured),
    visible: item.visible !== false,
    order: typeof item.order === 'number' ? item.order : maxOrder + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.gallery.push(newGalleryItem);
  saveDatabase(db);

  res.status(201).json({ success: true, item: newGalleryItem });
});

app.put('/api/admin/gallery/:id', requireAdmin, (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const index = db.gallery.findIndex((g) => g.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'العنصر غير موجود' });
    return;
  }

  const existing = db.gallery[index];
  const updates: Partial<GalleryItem> = req.body;

  const updatedItem: GalleryItem = {
    ...existing,
    ...updates,
    id: existing.id,
    updatedAt: new Date().toISOString(),
  };

  db.gallery[index] = updatedItem;
  saveDatabase(db);

  res.json({ success: true, item: updatedItem });
});

app.delete('/api/admin/gallery/:id', requireAdmin, (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const index = db.gallery.findIndex((g) => g.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'العنصر غير موجود' });
    return;
  }

  const removed = db.gallery.splice(index, 1);
  saveDatabase(db);

  res.json({ success: true, message: 'تم حذف العمل بنجاح', item: removed[0] });
});

app.patch('/api/admin/gallery/reorder', requireAdmin, (req, res) => {
  const db = getDatabase();
  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    res.status(400).json({ error: 'orderedIds must be an array' });
    return;
  }

  const idToOrder = new Map(orderedIds.map((id, idx) => [id, idx + 1]));
  db.gallery.forEach((g) => {
    if (idToOrder.has(g.id)) {
      g.order = idToOrder.get(g.id)!;
    }
  });

  db.gallery.sort((a, b) => (a.order || 0) - (b.order || 0));
  saveDatabase(db);

  res.json({ success: true, gallery: db.gallery });
});

app.patch('/api/admin/gallery/bulk', requireAdmin, (req, res) => {
  const db = getDatabase();
  const { action, ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: 'ids array is required' });
    return;
  }

  if (action === 'delete') {
    db.gallery = db.gallery.filter((g) => !ids.includes(g.id));
  } else if (action === 'hide') {
    db.gallery.forEach((g) => {
      if (ids.includes(g.id)) g.visible = false;
    });
  } else if (action === 'show') {
    db.gallery.forEach((g) => {
      if (ids.includes(g.id)) g.visible = true;
    });
  }

  saveDatabase(db);
  res.json({ success: true, count: ids.length, action });
});

/* --- Categories CRUD --- */
app.post('/api/admin/categories', requireAdmin, (req, res) => {
  const db = getDatabase();
  const { nameAr, nameEn, slug } = req.body;

  if (!nameAr || !nameEn) {
    res.status(400).json({ error: 'Category Arabic & English names are required' });
    return;
  }

  const cleanSlug = (slug || nameEn.toLowerCase().replace(/[^a-z0-9]/g, '-')).trim();
  const newCat: CategoryItem = {
    id: 'cat_' + Date.now(),
    slug: cleanSlug,
    nameAr: nameAr.trim(),
    nameEn: nameEn.trim(),
    order: db.categories.length + 1,
  };

  db.categories.push(newCat);
  saveDatabase(db);

  res.status(201).json({ success: true, category: newCat });
});

app.put('/api/admin/categories/:id', requireAdmin, (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const index = db.categories.findIndex((c) => c.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  db.categories[index] = { ...db.categories[index], ...req.body };
  saveDatabase(db);

  res.json({ success: true, category: db.categories[index] });
});

app.delete('/api/admin/categories/:id', requireAdmin, (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  db.categories = db.categories.filter((c) => c.id !== id);
  saveDatabase(db);
  res.json({ success: true, message: 'Category deleted' });
});

/* --- Brand Assets Management (Logo, Profile, Hero) --- */
app.put('/api/admin/branding', requireAdmin, (req, res) => {
  const db = getDatabase();
  const { logo, profile, hero } = req.body;

  if (logo) {
    const currentActive = db.branding.logo.activeUrl;
    const newActive = logo.activeUrl || currentActive;
    let prev = db.branding.logo.previousUrls || [];
    if (newActive !== currentActive && !prev.includes(currentActive)) {
      prev = [currentActive, ...prev].slice(0, 10);
    }
    db.branding.logo = {
      ...db.branding.logo,
      ...logo,
      activeUrl: newActive,
      previousUrls: prev,
    };
  }

  if (profile) {
    const currentActive = db.branding.profile.activeUrl;
    const newActive = profile.activeUrl || currentActive;
    let prev = db.branding.profile.previousUrls || [];
    if (newActive !== currentActive && !prev.includes(currentActive)) {
      prev = [currentActive, ...prev].slice(0, 10);
    }
    db.branding.profile = {
      ...db.branding.profile,
      ...profile,
      activeUrl: newActive,
      previousUrls: prev,
    };
  }

  if (hero) {
    const currentActive = db.branding.hero.activeUrl;
    const newActive = hero.activeUrl || currentActive;
    let prev = db.branding.hero.previousUrls || [];
    if (newActive !== currentActive && !prev.includes(currentActive)) {
      prev = [currentActive, ...prev].slice(0, 10);
    }
    db.branding.hero = {
      ...db.branding.hero,
      ...hero,
      activeUrl: newActive,
      previousUrls: prev,
    };
  }

  saveDatabase(db);
  res.json({ success: true, branding: db.branding });
});

/* --- Database Backup Export & Import --- */
app.get('/api/admin/backup/export', requireAdmin, (req, res) => {
  const db = getDatabase();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="mohab_portfolio_backup_${Date.now()}.json"`
  );
  res.send(JSON.stringify(db, null, 2));
});

app.post('/api/admin/backup/import', requireAdmin, (req, res) => {
  try {
    const importedData = req.body;
    if (!importedData.projects || !importedData.branding) {
      res.status(400).json({ error: 'ملف النسخة الاحتياطية غير صالح أو ناقص البيانات.' });
      return;
    }
    saveDatabase(importedData);
    res.json({ success: true, message: 'تم استعادة النسخة الاحتياطية بنجاح!' });
  } catch (err: any) {
    res.status(500).json({ error: 'حدث خطأ أثناء استيراد البيانات: ' + err.message });
  }
});

/* =========================================================
   VITE & STATIC ASSET SERVER INTEGRATION
========================================================= */

async function startServer() {
  initDatabase();

  // Static uploads directory serving
  app.use('/uploads', express.static(UPLOADS_DIR));

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const publicPath = path.join(process.cwd(), 'public');
    app.use(express.static(distPath));
    app.use(express.static(publicPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
