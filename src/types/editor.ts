export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Transform {
  x: number;
  y: number;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  rotation: number;
}

export interface AlbumElement {
  id: string;
  type: 'photo' | 'text' | 'sticker' | 'background' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  layerIndex: number;
  
  // Photo properties
  url?: string;
  opacity?: number;
  filter?: string;
  
  // Text properties
  text?: string;
  font?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  
  // Shape properties
  shapeType?: 'rectangle' | 'circle' | 'triangle' | 'line';
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  
  // General styling
  borderRadius?: number;
  shadow?: {
    offsetX: number;
    offsetY: number;
    blur: number;
    color: string;
  };
}

export interface PageBackground {
  type: 'color' | 'gradient' | 'image' | 'pattern';
  value: string;
  opacity?: number;
}

export interface PageDimensions {
  width: number;
  height: number;
  unit: 'px' | 'in' | 'cm' | 'mm';
}

export interface AlbumPage {
  _id: string;
  albumId: string;
  pageNumber: number;
  pageType: 'cover' | 'content' | 'back';
  layoutTemplate?: string;
  elements: AlbumElement[];
  pageBackground: PageBackground;
  dimensions: PageDimensions;
  createdAt: string;
  updatedAt: string;
}

export interface EditorSettings {
  canvasWidth: number;
  canvasHeight: number;
  unit: 'px' | 'in' | 'cm' | 'mm';
  dpi: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  showGuides: boolean;
  snapToGuides: boolean;
}

export interface ExportSettings {
  format: 'pdf' | 'jpg' | 'png';
  quality: 'low' | 'medium' | 'high' | 'print';
  colorProfile: 'sRGB' | 'CMYK' | 'Adobe RGB';
  bleed: number;
}

export interface Collaborator {
  userId: string;
  role: 'owner' | 'editor' | 'viewer';
  invitedAt: string;
  lastActiveAt?: string;
}

export interface EditorProject {
  _id: string;
  userId: string;
  albumId: string;
  projectName: string;
  description?: string;
  thumbnail?: string;
  editorSettings: EditorSettings;
  lastEditedPageId?: string;
  totalPages: number;
  status: 'draft' | 'published' | 'archived';
  version: number;
  collaborators: Collaborator[];
  exportSettings: ExportSettings;
  createdAt: string;
  updatedAt: string;
}

export interface EditorState {
  currentPage: AlbumPage | null;
  selectedElements: string[];
  clipboard: AlbumElement[];
  zoom: number;
  tool: 'select' | 'text' | 'shape' | 'photo';
  isGridVisible: boolean;
  isSnapToGrid: boolean;
}

export interface DragState {
  isDragging: boolean;
  dragType: 'move' | 'resize' | 'rotate' | 'pan';
  startPosition: Point;
  originalTransform: Transform;
  element?: AlbumElement;
}

export interface HistoryState {
  past: AlbumPage[];
  present: AlbumPage | null;
  future: AlbumPage[];
}

// Canvas utility types
export interface ViewportState {
  scale: number;
  translateX: number;
  translateY: number;
}

export interface SelectionBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Font types
export interface GoogleFont {
  family: string;
  variants: string[];
  subsets: string[];
  files: Record<string, string>;
}

// Asset types
export interface AssetLibraryItem {
  id: string;
  type: 'photo' | 'sticker' | 'background';
  url: string;
  thumbnail: string;
  title: string;
  category: string;
  tags: string[];
  size?: Size;
}

// Layout template types
export interface LayoutTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  elements: Omit<AlbumElement, 'id' | 'url'>[];
  description?: string;
}

// Export types
export interface ExportOptions extends ExportSettings {
  pages?: number[];
  includeBleed: boolean;
  cropMarks: boolean;
}
