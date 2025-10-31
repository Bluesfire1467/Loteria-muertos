/**
 * Composable para manejo de diseño responsive
 * Proporciona utilidades para detectar tamaños de pantalla y adaptar la UI
 */

import { ref, computed, onMounted, onUnmounted } from 'vue';

export type BreakpointName = 'mobile' | 'tablet' | 'desktop' | 'wide';

export interface Breakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

export interface ResponsiveState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  breakpoint: BreakpointName;
  orientation: 'portrait' | 'landscape';
  isTouchDevice: boolean;
  supportsHover: boolean;
}

const defaultBreakpoints: Breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1440
};

export function useResponsive(customBreakpoints?: Partial<Breakpoints>) {
  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints };
  
  const width = ref(0);
  const height = ref(0);
  
  const updateDimensions = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  };
  
  const isMobile = computed(() => width.value < breakpoints.tablet);
  const isTablet = computed(() => 
    width.value >= breakpoints.tablet && width.value < breakpoints.desktop
  );
  const isDesktop = computed(() => 
    width.value >= breakpoints.desktop && width.value < breakpoints.wide
  );
  const isWide = computed(() => width.value >= breakpoints.wide);
  
  const breakpoint = computed<BreakpointName>(() => {
    if (isMobile.value) return 'mobile';
    if (isTablet.value) return 'tablet';
    if (isDesktop.value) return 'desktop';
    return 'wide';
  });
  
  const orientation = computed<'portrait' | 'landscape'>(() => 
    height.value > width.value ? 'portrait' : 'landscape'
  );
  
  const isTouchDevice = computed(() => 
    'ontouchstart' in window || navigator.maxTouchPoints > 0
  );
  
  const supportsHover = computed(() => 
    window.matchMedia('(hover: hover)').matches
  );
  
  const state = computed<ResponsiveState>(() => ({
    width: width.value,
    height: height.value,
    isMobile: isMobile.value,
    isTablet: isTablet.value,
    isDesktop: isDesktop.value,
    isWide: isWide.value,
    breakpoint: breakpoint.value,
    orientation: orientation.value,
    isTouchDevice: isTouchDevice.value,
    supportsHover: supportsHover.value
  }));
  
  onMounted(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
  });
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateDimensions);
  });
  
  return {
    ...state,
    breakpoints: computed(() => breakpoints)
  };
}

/**
 * Composable para configuraciones responsive específicas del juego
 */
export function useGameResponsive() {
  const responsive = useResponsive();
  
  // Configuraciones específicas para el tablero de juego
  const gameConfig = computed(() => {
    const { isMobile, isTablet, breakpoint } = responsive;
    
    return {
      // Tamaño de cartas
      cardSize: isMobile.value ? 60 : isTablet.value ? 80 : 100,
      
      // Espaciado entre cartas
      cardGap: isMobile.value ? 4 : isTablet.value ? 6 : 8,
      
      // Número de tableros de bots visibles
      visibleBotBoards: isMobile.value ? 0 : isTablet.value ? 2 : 4,
      
      // Posición de tableros de bots
      botBoardPosition: isMobile.value ? 'bottom' : 'sides',
      
      // Tamaño de tableros de bots
      botBoardScale: isMobile.value ? 0.3 : isTablet.value ? 0.4 : 0.5,
      
      // Mostrar información adicional
      showPlayerNames: !isMobile.value,
      showStatistics: breakpoint.value !== 'mobile',
      showAnimations: breakpoint.value !== 'mobile',
      
      // Layout del juego
      gameLayout: isMobile.value ? 'stack' : isTablet.value ? 'compact' : 'full',
      
      // Controles
      showFullControls: !isMobile.value,
      useSwipeGestures: isMobile.value,
      
      // Papel picado
      papelPicadoCount: isMobile.value ? 3 : isTablet.value ? 5 : 8,
      
      // Elementos culturales
      showCulturalElements: breakpoint.value !== 'mobile',
      culturalElementsIntensity: isMobile.value ? 'subtle' : 'medium'
    };
  });
  
  // Configuraciones para diferentes vistas
  const viewConfig = computed(() => ({
    home: {
      showBackground: !responsive.isMobile.value,
      buttonSize: responsive.isMobile.value ? 'large' : 'medium',
      showDecorations: responsive.breakpoint.value !== 'mobile'
    },
    
    game: {
      layout: gameConfig.value.gameLayout,
      showSidePanels: !responsive.isMobile.value,
      compactMode: responsive.isMobile.value || responsive.isTablet.value
    },
    
    statistics: {
      chartType: responsive.isMobile.value ? 'simple' : 'detailed',
      showGraphs: !responsive.isMobile.value,
      columnsCount: responsive.isMobile.value ? 1 : responsive.isTablet.value ? 2 : 3
    },
    
    achievements: {
      gridColumns: responsive.isMobile.value ? 1 : responsive.isTablet.value ? 2 : 3,
      showDescriptions: !responsive.isMobile.value,
      compactCards: responsive.isMobile.value
    }
  }));
  
  return {
    ...responsive,
    gameConfig,
    viewConfig
  };
}

/**
 * Utilidades para clases CSS responsive
 */
export function useResponsiveClasses() {
  const { isMobile, isTablet, isDesktop, breakpoint } = useResponsive();
  
  const classes = computed(() => ({
    // Clases base
    'is-mobile': isMobile.value,
    'is-tablet': isTablet.value,
    'is-desktop': isDesktop.value,
    [`breakpoint-${breakpoint.value}`]: true,
    
    // Clases de utilidad
    'touch-device': 'ontouchstart' in window,
    'no-hover': !window.matchMedia('(hover: hover)').matches
  }));
  
  const getResponsiveClass = (
    mobileClass: string,
    tabletClass?: string,
    desktopClass?: string
  ) => {
    if (isMobile.value) return mobileClass;
    if (isTablet.value && tabletClass) return tabletClass;
    if (desktopClass) return desktopClass;
    return tabletClass || mobileClass;
  };
  
  return {
    classes,
    getResponsiveClass
  };
}

/**
 * Hook para detectar cambios de orientación
 */
export function useOrientation() {
  const orientation = ref<'portrait' | 'landscape'>('portrait');
  
  const updateOrientation = () => {
    orientation.value = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  };
  
  onMounted(() => {
    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);
  });
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateOrientation);
    window.removeEventListener('orientationchange', updateOrientation);
  });
  
  return {
    orientation: computed(() => orientation.value),
    isPortrait: computed(() => orientation.value === 'portrait'),
    isLandscape: computed(() => orientation.value === 'landscape')
  };
}

/**
 * Utilidades para viewport
 */
export const viewportUtils = {
  /**
   * Obtiene el viewport height real (útil para móviles)
   */
  getRealViewportHeight(): number {
    return window.visualViewport?.height || window.innerHeight;
  },
  
  /**
   * Establece la altura del viewport como variable CSS
   */
  setViewportHeight(): void {
    const vh = this.getRealViewportHeight() * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  },
  
  /**
   * Verifica si el teclado virtual está visible (móviles)
   */
  isVirtualKeyboardVisible(): boolean {
    if (!window.visualViewport) return false;
    return window.visualViewport.height < window.innerHeight * 0.75;
  }
};