import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ProjectItem, GalleryItem, CategoryItem, BrandAssetsConfig } from '../types';
import { defaultDatabase } from '../data/defaultDb';

interface BrandContextType {
  projects: ProjectItem[];
  featuredProjects: ProjectItem[];
  gallery: GalleryItem[];
  categories: CategoryItem[];
  branding: BrandAssetsConfig;
  isLoading: boolean;
  error: string | null;
  refreshContent: () => Promise<void>;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<ProjectItem[]>(defaultDatabase.projects);
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultDatabase.gallery);
  const [categories, setCategories] = useState<CategoryItem[]>(defaultDatabase.categories);
  const [branding, setBranding] = useState<BrandAssetsConfig>(defaultDatabase.branding);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const refreshContent = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/content/all');
      if (!res.ok) {
        throw new Error(`Failed to load content: ${res.status}`);
      }
      const data = await res.json();
      if (data.projects) setProjects(data.projects);
      if (data.gallery) setGallery(data.gallery);
      if (data.categories) setCategories(data.categories);
      if (data.branding) setBranding(data.branding);
      setError(null);
    } catch (err: any) {
      console.warn('Backend content fetch notice, using cached/default state:', err.message);
      // We keep existing default state so UI is always operational
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshContent();

    const handleLiveUpdate = () => {
      refreshContent();
    };

    window.addEventListener('mohab_content_updated', handleLiveUpdate);
    return () => {
      window.removeEventListener('mohab_content_updated', handleLiveUpdate);
    };
  }, [refreshContent]);

  const featuredProjects = useMemo(() => {
    return projects.filter((p) => p.featured === true && p.visible !== false);
  }, [projects]);

  return (
    <BrandContext.Provider
      value={{
        projects,
        featuredProjects,
        gallery,
        categories,
        branding,
        isLoading,
        error,
        refreshContent,
        activeCategory,
        setActiveCategory,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrandContent() {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrandContent must be used within a BrandProvider');
  }
  return context;
}
