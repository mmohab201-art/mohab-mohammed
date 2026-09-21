import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ProjectItem, GalleryItem, CategoryItem, BrandAssetsConfig, AdminUser } from '../types';
import { defaultDatabase } from '../data/defaultDb';

interface AdminStats {
  totalWorks: number;
  featuredWorks: number;
  hiddenWorks: number;
  galleryCount: number;
}

interface AdminContextType {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (password: string, email?: string) => Promise<boolean>;
  logout: () => void;
  
  projects: ProjectItem[];
  gallery: GalleryItem[];
  categories: CategoryItem[];
  branding: BrandAssetsConfig;
  stats: AdminStats;
  
  fetchAdminData: () => Promise<void>;
  createProject: (project: Partial<ProjectItem>) => Promise<boolean>;
  updateProject: (id: string, updates: Partial<ProjectItem>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  reorderProjects: (orderedIds: string[]) => Promise<boolean>;
  bulkProjects: (action: 'delete' | 'hide' | 'show' | 'feature' | 'unfeature', ids: string[]) => Promise<boolean>;

  createGalleryItem: (item: Partial<GalleryItem>) => Promise<boolean>;
  updateGalleryItem: (id: string, updates: Partial<GalleryItem>) => Promise<boolean>;
  deleteGalleryItem: (id: string) => Promise<boolean>;
  reorderGallery: (orderedIds: string[]) => Promise<boolean>;
  bulkGallery: (action: 'delete' | 'hide' | 'show', ids: string[]) => Promise<boolean>;

  createCategory: (nameAr: string, nameEn: string, slug?: string) => Promise<boolean>;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;

  updateBranding: (updates: { logo?: any; profile?: any; hero?: any }) => Promise<boolean>;
  uploadImageFile: (file: File, folder: string) => Promise<string>;
  exportBackupJson: () => void;
  importBackupJson: (jsonData: any) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const TOKEN_KEY = 'mohab_admin_auth_token';

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [projects, setProjects] = useState<ProjectItem[]>(defaultDatabase.projects);
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultDatabase.gallery);
  const [categories, setCategories] = useState<CategoryItem[]>(defaultDatabase.categories);
  const [branding, setBranding] = useState<BrandAssetsConfig>(defaultDatabase.branding);
  const [stats, setStats] = useState<AdminStats>({
    totalWorks: defaultDatabase.projects.length,
    featuredWorks: defaultDatabase.projects.filter(p => p.featured).length,
    hiddenWorks: defaultDatabase.projects.filter(p => !p.visible).length,
    galleryCount: defaultDatabase.gallery.length,
  });

  const getHeaders = useCallback(() => {
    const token = adminUser?.token || (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null);
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || ''}`,
    };
  }, [adminUser]);

  const fetchAdminData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/all', {
        headers: getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        setGallery(data.gallery || []);
        setCategories(data.categories || []);
        if (data.branding) setBranding(data.branding);
        if (data.stats) setStats(data.stats);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('mohab_content_updated'));
        }
      }
    } catch (e) {
      console.warn('Failed to fetch admin data:', e);
    }
  }, [getHeaders]);

  // Check existing token on mount
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      const savedToken = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
      if (!savedToken) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/session', {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setAdminUser({
            email: data.user.email,
            name: data.user.name,
            token: savedToken,
          });
          await fetchAdminData();
        } else {
          localStorage.removeItem(TOKEN_KEY);
          setAdminUser(null);
        }
      } catch (err) {
        console.warn('Session check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [fetchAdminData]);

  const login = async (password: string, email: string = 'mmohab1997@gmail.com'): Promise<boolean> => {
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || 'فشل تسجيل الدخول. تحقق من كلمة المرور.');
        return false;
      }

      const user: AdminUser = {
        email: data.user.email,
        name: data.user.name,
        token: data.token,
      };
      setAdminUser(user);
      localStorage.setItem(TOKEN_KEY, data.token);
      await fetchAdminData();
      return true;
    } catch (err: any) {
      setAuthError('حدث خطأ في الاتصال بالخادم: ' + err.message);
      return false;
    }
  };

  const logout = () => {
    try {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: getHeaders(),
      });
    } catch {}
    setAdminUser(null);
    localStorage.removeItem(TOKEN_KEY);
  };

  /* Upload file as base64 */
  const uploadImageFile = async (file: File, folder: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const res = await fetch('/api/admin/upload', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
              fileData: base64Data,
              fileName: file.name,
              folder,
            }),
          });
          const result = await res.json();
          if (!res.ok || !result.url) {
            throw new Error(result.error || 'فشل رفع الملف');
          }
          resolve(result.url);
        } catch (err: any) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('فشل قراءة الملف من الجهاز'));
      reader.readAsDataURL(file);
    });
  };

  /* Project operations */
  const createProject = async (projectData: Partial<ProjectItem>): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(projectData),
      });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateProject = async (id: string, updates: Partial<ProjectItem>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const reorderProjects = async (orderedIds: string[]): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/projects/reorder', {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ orderedIds }),
      });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const bulkProjects = async (action: 'delete' | 'hide' | 'show' | 'feature' | 'unfeature', ids: string[]): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/projects/bulk', {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ action, ids }),
      });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  /* Gallery operations */
  const createGalleryItem = async (itemData: Partial<GalleryItem>): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(itemData),
      });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateGalleryItem = async (id: string, updates: Partial<GalleryItem>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteGalleryItem = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const reorderGallery = async (orderedIds: string[]): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/gallery/reorder', {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ orderedIds }),
      });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const bulkGallery = async (action: 'delete' | 'hide' | 'show', ids: string[]): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/gallery/bulk', {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ action, ids }),
      });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  /* Categories operations */
  const createCategory = async (nameAr: string, nameEn: string, slug?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ nameAr, nameEn, slug }),
      });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateCategory = async (id: string, updates: Partial<CategoryItem>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  /* Branding updates */
  const updateBranding = async (updates: { logo?: any; profile?: any; hero?: any }): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/branding', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  /* Backup export & import */
  const exportBackupJson = () => {
    const token = adminUser?.token;
    if (!token) return;
    const a = document.createElement('a');
    a.href = `/api/admin/backup/export`;
    // fetch with auth header or download
    fetch('/api/admin/backup/export', { headers: getHeaders() })
      .then((r) => r.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = `mohab_portfolio_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      });
  };

  const importBackupJson = async (jsonData: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/backup/import', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(jsonData),
      });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        isAuthenticated: !!adminUser,
        isLoading,
        authError,
        login,
        logout,
        projects,
        gallery,
        categories,
        branding,
        stats,
        fetchAdminData,
        createProject,
        updateProject,
        deleteProject,
        reorderProjects,
        bulkProjects,
        createGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        reorderGallery,
        bulkGallery,
        createCategory,
        updateCategory,
        deleteCategory,
        updateBranding,
        uploadImageFile,
        exportBackupJson,
        importBackupJson,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
