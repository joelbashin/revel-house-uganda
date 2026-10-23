export interface GalleryPhoto {
  id: string;
  image_path: string;
  aspect_ratio: 'landscape' | 'portrait';
  title: string;
  location: string;
  photo_date: string;
  category: string;
  credit: string;
  description: string;
  link: string | null;
  display_order: number;
  created_at?: unknown;
  updated_at?: unknown;
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  alt: string;
  title: string;
  category: string;
  description: string;
  thumbnail?: string;
  display_order: number;
  created_at?: unknown;
  updated_at?: unknown;
}
