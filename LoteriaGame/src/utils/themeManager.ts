/**
 * Gestor de temas para la aplicación de Lotería Día de Muertos
 * Maneja el cambio entre tema claro y oscuro con persistencia
 */

export type Theme = 'light' | 'dark' | 'auto';

export interface ThemeManager {
  currentTheme: Theme;
  systemTheme: 'light' | 'dark';
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

class ThemeManagerImpl implements ThemeManager {
  private _currentTheme: Theme = 'dark';
  private _systemTheme: 'light' | 'dark' = 'dark';
  private mediaQuery: MediaQueryList;

  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this._systemTheme = this.mediaQuery.matches ? 'dark' : 'light';
    
    // Escuchar cambios en la preferencia del sistema
    this.mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this));
  }

  get currentTheme(): Theme {
    return this._currentTheme;
  }

  get systemTheme(): 'light' | 'dark' {
    return this._systemTheme;
  }

  get effectiveTheme(): 'light' | 'dark' {
    if (this._currentTheme === 'auto') {
      return this._systemTheme;
    }
    return this._currentTheme;
  }

  setTheme(theme: Theme): void {
    this._currentTheme = theme;
    this.applyTheme();
    this.saveThemePreference();
  }

  toggleTheme(): void {
    const newTheme = this.effectiveTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  initializeTheme(): void {
    const savedTheme = this.loadThemePreference();
    if (savedTheme) {
      this._currentTheme = savedTheme;
    }
    this.applyTheme();
  }

  private handleSystemThemeChange(event: MediaQueryListEvent): void {
    this._systemTheme = event.matches ? 'dark' : 'light';
    if (this._currentTheme === 'auto') {
      this.applyTheme();
    }
  }

  private applyTheme(): void {
    const theme = this.effectiveTheme;
    document.documentElement.setAttribute('data-theme', theme);
    
    // Actualizar meta theme-color para dispositivos móviles
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const color = theme === 'dark' ? '#2D1B69' : '#FFF8E7';
      metaThemeColor.setAttribute('content', color);
    }

    // Disparar evento personalizado para componentes que necesiten reaccionar
    window.dispatchEvent(new CustomEvent('theme-changed', {
      detail: { theme, previousTheme: this._currentTheme }
    }));
  }

  private saveThemePreference(): void {
    try {
      localStorage.setItem('loteria-theme', this._currentTheme);
    } catch (error) {
      console.warn('No se pudo guardar la preferencia de tema:', error);
    }
  }

  private loadThemePreference(): Theme | null {
    try {
      const saved = localStorage.getItem('loteria-theme');
      if (saved && ['light', 'dark', 'auto'].includes(saved)) {
        return saved as Theme;
      }
    } catch (error) {
      console.warn('No se pudo cargar la preferencia de tema:', error);
    }
    return null;
  }
}

// Instancia singleton del gestor de temas
export const themeManager = new ThemeManagerImpl();

// Composable para Vue
export function useTheme() {
  const { ref, computed, onMounted } = require('vue');
  
  const currentTheme = ref<Theme>(themeManager.currentTheme);
  const systemTheme = ref<'light' | 'dark'>(themeManager.systemTheme);
  
  const effectiveTheme = computed(() => {
    if (currentTheme.value === 'auto') {
      return systemTheme.value;
    }
    return currentTheme.value;
  });

  const setTheme = (theme: Theme) => {
    currentTheme.value = theme;
    themeManager.setTheme(theme);
  };

  const toggleTheme = () => {
    const newTheme = effectiveTheme.value === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  onMounted(() => {
    themeManager.initializeTheme();
    currentTheme.value = themeManager.currentTheme;
    
    // Escuchar cambios de tema
    const handleThemeChange = (event: CustomEvent) => {
      currentTheme.value = themeManager.currentTheme;
      systemTheme.value = themeManager.systemTheme;
    };
    
    window.addEventListener('theme-changed', handleThemeChange as EventListener);
    
    return () => {
      window.removeEventListener('theme-changed', handleThemeChange as EventListener);
    };
  });

  return {
    currentTheme: computed(() => currentTheme.value),
    systemTheme: computed(() => systemTheme.value),
    effectiveTheme,
    setTheme,
    toggleTheme,
    isDark: computed(() => effectiveTheme.value === 'dark'),
    isLight: computed(() => effectiveTheme.value === 'light')
  };
}

// Utilidades para detectar características del tema
export const themeUtils = {
  /**
   * Obtiene el color CSS actual de una variable
   */
  getCSSVariable(variableName: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  },

  /**
   * Establece una variable CSS dinámicamente
   */
  setCSSVariable(variableName: string, value: string): void {
    document.documentElement.style.setProperty(variableName, value);
  },

  /**
   * Verifica si el usuario prefiere movimiento reducido
   */
  prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Verifica si el dispositivo soporta hover
   */
  supportsHover(): boolean {
    return window.matchMedia('(hover: hover)').matches;
  },

  /**
   * Obtiene el contraste apropiado para el tema actual
   */
  getContrastColor(backgroundColor: string): string {
    // Implementación simple de contraste
    const theme = themeManager.effectiveTheme;
    return theme === 'dark' ? '#F7F7F7' : '#2D1B69';
  }
};