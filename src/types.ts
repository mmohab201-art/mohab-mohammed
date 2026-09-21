export type Language = 'ar' | 'en';

export interface ServiceItem {
  id: string;
  iconName: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  badgeAr: string;
  badgeEn: string;
}

export type ProjectCategory = 'all' | 'social' | 'advertising' | 'print' | 'branding' | 'ai' | 'photoshop' | 'illustration' | string;

export interface ProjectItem {
  id: string;
  title?: string;
  titleAr: string;
  titleEn: string;
  category: string;
  categoryAr: string;
  categoryEn: string;
  image: string;
  images?: string[];
  descAr: string;
  descEn: string;
  description?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  tools: string[];
  tags?: string[];
  clientAr?: string;
  clientEn?: string;
  year?: string;
  featured?: boolean;
  visible?: boolean;
  order?: number;
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryItem {
  id: string;
  title?: string;
  titleAr: string;
  titleEn: string;
  description?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  image: string;
  category?: string;
  categoryAr: string;
  categoryEn: string;
  tags?: string[];
  aspect?: string;
  featured?: boolean;
  visible?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryItem {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  order: number;
  isActive?: boolean;
}

export interface LogoConfig {
  activeUrl: string;
  altText: string;
  widthDesktop: number; // in pixels, default e.g. 240
  widthMobile: number;  // in pixels, default e.g. 170
  position: 'left' | 'center' | 'right';
  previousUrls?: string[];
}

export interface ProfileConfig {
  activeUrl: string;
  altText: string;
  width: number;
  height: number;
  objectFit: 'cover' | 'contain';
  positionX: number; // 0 - 100%
  positionY: number; // 0 - 100%
  previousUrls?: string[];
}

export interface HeroConfig {
  activeUrl: string;
  altText: string;
  previousUrls?: string[];
  desktopPosition: { x: number; y: number };
  desktopSize: 'cover' | 'contain' | 'custom';
  tabletPosition: { x: number; y: number };
  tabletSize: 'cover' | 'contain' | 'custom';
  mobilePosition: { x: number; y: number };
  mobileSize: 'cover' | 'contain' | 'custom';
  objectFit?: 'cover' | 'contain';
  heroHeightDesktop: number; // e.g. 740
  heroHeightTablet: number;  // e.g. 620
  heroHeightMobile: number;  // e.g. 660
  overlayEnabled: boolean;
  overlayOpacity: number;    // 0 - 100
  overlayDirection?: 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top';
  gradientDirection?: 'right' | 'left' | 'bottom';
  textPositionDesktop?: { x: number; y: number };
  textPositionTablet?: { x: number; y: number };
  textPositionMobile?: { x: number; y: number };
  textMaxWidth: number; // e.g. 620
}

export interface BrandAssetsConfig {
  logo: LogoConfig;
  profile: ProfileConfig;
  hero: HeroConfig;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface AdminUser {
  email: string;
  name: string;
  token: string;
}

export interface DatabaseSchema {
  projects: ProjectItem[];
  gallery: GalleryItem[];
  categories: CategoryItem[];
  branding: BrandAssetsConfig;
  updatedAt: string;
}
