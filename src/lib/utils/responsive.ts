// Mobile-first responsive utility functions

export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const isMobile = (width: number): boolean => width < 768;
export const isTablet = (width: number): boolean => width >= 768 && width < 1024;
export const isDesktop = (width: number): boolean => width >= 1024;

// Touch target sizes for mobile accessibility
export const TOUCH_TARGET_MIN_SIZE = 44; // 44px minimum for touch targets
export const TOUCH_TARGET_LARGE_SIZE = 88; // 88px for primary actions

// Safe area handling for devices with notches
export const getSafeAreaInsets = () => {
  if (typeof window === 'undefined') return { top: 0, bottom: 0, left: 0, right: 0 };
  
  const style = getComputedStyle(document.documentElement);
  return {
    top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0'),
    bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0'),
    left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0'),
    right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0'),
  };
};

// Mobile-first spacing utilities
export const spacing = {
  touch: `${TOUCH_TARGET_MIN_SIZE}px`,
  touchLarge: `${TOUCH_TARGET_LARGE_SIZE}px`,
  safe: 'env(safe-area-inset-top)',
  safeBottom: 'env(safe-area-inset-bottom)',
} as const;

// Animation durations for mobile interactions
export const animations = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
} as const;

// Z-index layers for mobile layering
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
} as const;
