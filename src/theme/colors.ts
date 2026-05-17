const base = {
  ink900: '#07090E',
  ink800: '#0B0F17',
  ink700: '#101622',
  ink600: '#171F2E',
  ink500: '#222B3B',
  graphite500: '#5E687B',
  graphite300: '#A9B2C3',
  graphite100: '#E8ECF4',
  white: '#FFFFFF',
  mint500: '#31F5A5',
  mint600: '#12C987',
  cyan500: '#58B7FF',
  iris500: '#8E7CFF',
  amber500: '#FFCE6A',
  rose500: '#FF5A7A',
  transparent: 'transparent'
} as const;

export const colors = {
  base,
  background: {
    app: base.ink900,
    screen: base.ink900,
    input: base.ink700,
    mapOverlay: 'rgba(7, 9, 14, 0.62)',
    scrim: 'rgba(0, 0, 0, 0.48)'
  },
  surface: {
    base: base.ink700,
    raised: base.ink600,
    panel: base.ink700,
    glass: 'rgba(17, 22, 34, 0.78)',
    glassStrong: 'rgba(23, 31, 46, 0.9)',
    inverse: base.white
  },
  text: {
    primary: '#F7F9FE',
    secondary: '#B8C1D3',
    tertiary: '#7F8A9F',
    inverse: '#091018',
    accent: base.mint500,
    danger: base.rose500
  },
  border: {
    subtle: 'rgba(255, 255, 255, 0.08)',
    strong: 'rgba(255, 255, 255, 0.16)',
    accent: 'rgba(49, 245, 165, 0.5)'
  },
  brand: {
    primary: base.mint500,
    primaryPressed: base.mint600,
    secondary: base.cyan500,
    electric: base.iris500
  },
  state: {
    success: base.mint500,
    warning: base.amber500,
    danger: base.rose500,
    info: base.cyan500
  },
  // Alias for convenience
  status: {
    success: base.mint500,
    warning: base.amber500,
    danger: base.rose500,
    info: base.cyan500
  },
  route: {
    private: base.cyan500,
    shared: base.mint500,
    candidate: base.iris500
  },
  legacy: {
    background: base.ink900,
    surface: base.ink700,
    surfaceElevated: base.ink600,
    textPrimary: '#F7F9FE',
    textSecondary: '#B8C1D3',
    accent: base.mint500,
    accentAlt: base.cyan500,
    warning: base.amber500,
    danger: base.rose500,
    border: base.ink500
  }
} as const;
