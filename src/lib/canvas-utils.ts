import { AlbumElement, Point } from '@/types/editor';

/**
 * Calculate the bounding box of an element
 */
export function calculateElementBounds(element: AlbumElement): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  return {
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height
  };
}

/**
 * Check if a point is inside an element
 */
export function isPointInElement(point: Point, element: AlbumElement): boolean {
  const bounds = calculateElementBounds(element);
  
  // Handle rotation if needed
  if (element.rotation && element.rotation !== 0) {
    // For rotated elements, we would need more complex collision detection
    // For now, we'll use simple bounding box
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;
    
    // Transform point to element's local coordinate system
    const cos = Math.cos(-element.rotation * Math.PI / 180);
    const sin = Math.sin(-element.rotation * Math.PI / 180);
    
    const localX = cos * (point.x - centerX) - sin * (point.y - centerY) + centerX;
    const localY = sin * (point.x - centerX) + cos * (point.y - centerY) + centerY;
    
    return localX >= bounds.x && 
           localX <= bounds.x + bounds.width && 
           localY >= bounds.y && 
           localY <= bounds.y + bounds.height;
  }
  
  // Simple bounding box check for non-rotated elements
  return point.x >= bounds.x && 
         point.x <= bounds.x + bounds.width && 
         point.y >= bounds.y && 
         point.y <= bounds.y + bounds.height;
}

/**
 * Snap a point to grid
 */
export function snapToGrid(point: Point, gridSize: number): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
}

/**
 * Calculate the distance between two points
 */
export function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.hypot(dx, dy);
}

/**
 * Constrain a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Convert degrees to radians
 */
export function degToRad(degrees: number): number {
  return degrees * Math.PI / 180;
}

/**
 * Convert radians to degrees
 */
export function radToDeg(radians: number): number {
  return radians * 180 / Math.PI;
}

/**
 * Get the center point of an element
 */
export function getElementCenter(element: AlbumElement): Point {
  return {
    x: element.x + element.width / 2,
    y: element.y + element.height / 2
  };
}

/**
 * Check if two rectangles overlap
 */
export function rectsOverlap(
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
): boolean {
  return !(
    rect1.x + rect1.width < rect2.x ||
    rect2.x + rect2.width < rect1.x ||
    rect1.y + rect1.height < rect2.y ||
    rect2.y + rect2.height < rect1.y
  );
}

/**
 * Calculate the bounding box that contains all given elements
 */
export function calculateSelectionBounds(elements: AlbumElement[]): {
  x: number;
  y: number;
  width: number;
  height: number;
} | null {
  if (elements.length === 0) return null;
  
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  
  for (const element of elements) {
    const bounds = calculateElementBounds(element);
    minX = Math.min(minX, bounds.x);
    minY = Math.min(minY, bounds.y);
    maxX = Math.max(maxX, bounds.x + bounds.width);
    maxY = Math.max(maxY, bounds.y + bounds.height);
  }
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}
