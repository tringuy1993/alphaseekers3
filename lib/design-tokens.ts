// AlphaSeekers Design Tokens - Command Center v2

export const colors = {
  // Layered dark surfaces
  surface: {
    primary: '#131722',
    secondary: '#1e222d',
    tertiary: '#242a35',
    elevated: '#2d3442',
    overlay: '#10141ebf',
  },

  // Readability-first text scale
  text: {
    primary: '#d8dde7',
    secondary: '#9aa3b5',
    muted: '#63708a',
  },

  // Accent signals
  accent: {
    blue: '#3d7dff',
    amber: '#ffb02e',
    cyan: '#31c6d4',
  },

  // Financial signals
  positive: '#26a69a',
  negative: '#ef5350',
  neutral: '#8e97aa',

  // Borders and dividers
  border: {
    default: '#2b3342',
    hover: '#384256',
    active: '#3d7dff',
    strong: '#4b5b77',
  },

  // Chart mark lines
  mark: {
    spot: '#ffde59',
    open: '#ef5350',
    close: '#26a69a',
  },

  // Semantic UI state
  state: {
    info: '#3d7dff',
    live: '#26a69a',
    warning: '#ffb02e',
    critical: '#ef5350',
  },

  // Backward-compatible aliases
  bg: {
    primary: '#131722',
    secondary: '#1e222d',
    tertiary: '#242a35',
    elevated: '#2d3442',
  },
  blue: '#3d7dff',
  amber: '#ffb02e',
} as const;

export const chartColors = {
  call: '#3d7dff',
  put: '#ef5350',
  total: '#c0c7d4',
  theo: '#ff9800',
  volumeCall: 'rgba(61, 125, 255, 0.2)',
  volumePut: 'rgba(239, 83, 80, 0.19)',

  // Series palette for multi-series charts
  series: ['#3d7dff', '#ef5350', '#c0c7d4', '#ff9800', '#26a69a', '#ffb02e'],

  // Heatmap diverging scale (negative red -> neutral -> positive blue)
  heatmapDiverging: [
    '#b71c1c',
    '#ef5350',
    '#ef535080',
    '#363a45',
    '#3d7dff80',
    '#3d7dff',
    '#2a5ec9',
  ],

  // Gamma heatmap (red-white-blue for compatibility)
  gammaHeatmap: [
    '#b71c1c',
    '#ef5350',
    '#ef9a9a',
    '#ffcdd2',
    '#363a45',
    '#bbdefb',
    '#90caf9',
    '#3d7dff',
    '#2a5ec9',
  ],

  // Volume heatmap (puts: teal gradient, calls: amber gradient)
  volumePutHeatmap: ['rgba(38, 166, 154, 0.2)', 'rgba(38, 166, 154, 0.8)'],
  volumeCallHeatmap: ['rgba(255, 152, 0, 0.15)', 'rgba(239, 83, 80, 0.5)'],
} as const;

// Light mode overrides (secondary priority)
export const lightColors = {
  surface: {
    primary: '#ffffff',
    secondary: '#f8f9fa',
    tertiary: '#edf1f7',
    elevated: '#ffffff',
    overlay: '#ffffffcc',
  },
  text: {
    primary: '#121826',
    secondary: '#4f5b73',
    muted: '#7f8aa2',
  },
  border: {
    default: '#dce3ef',
    hover: '#cfd8e8',
    active: '#3d7dff',
    strong: '#8a9cb8',
  },

  // Backward-compatible aliases
  bg: {
    primary: '#ffffff',
    secondary: '#f8f9fa',
    tertiary: '#edf1f7',
    elevated: '#ffffff',
  },
} as const;

// Mantine 10-shade color arrays
export const brandColors = [
  '#eaf0ff',
  '#d2deff',
  '#b7caff',
  '#9cb6ff',
  '#7ea0ff',
  '#3d7dff',
  '#346de0',
  '#2d5fc4',
  '#254fa8',
  '#1d3f8d',
] as const;

export const accentColors = [
  '#fff6e5',
  '#ffe8bf',
  '#ffd995',
  '#ffca6b',
  '#ffbc47',
  '#ffb02e',
  '#e49d27',
  '#c98a21',
  '#ae771a',
  '#926414',
] as const;

export const positiveColors = [
  '#e0f2f1',
  '#b2dfdb',
  '#80cbc4',
  '#4db6ac',
  '#26a69a',
  '#009688',
  '#00897b',
  '#00796b',
  '#00695c',
  '#004d40',
] as const;

export const negativeColors = [
  '#ffebee',
  '#ffcdd2',
  '#ef9a9a',
  '#e57373',
  '#ef5350',
  '#f44336',
  '#e53935',
  '#d32f2f',
  '#c62828',
  '#b71c1c',
] as const;

export const motion = {
  fast: '120ms',
  normal: '180ms',
  slow: '260ms',
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
} as const;
