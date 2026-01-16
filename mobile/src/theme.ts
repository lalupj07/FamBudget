import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  default: {
    fontFamily: 'Roboto',
  },
};

// Light Theme
export const lightTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1565C0',
    primaryContainer: '#E3F2FD',
    secondary: '#2E7D32',
    secondaryContainer: '#E8F5E8',
    tertiary: '#00ACC1',
    tertiaryContainer: '#E0F7FA',
    error: '#D32F2F',
    errorContainer: '#FFCDD2',
    background: '#FAFBFF',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    surfaceContainer: '#F8F9FA',
    surfaceContainerHigh: '#F1F3F4',
    outline: '#6B7280',
    outlineVariant: '#E5E7EB',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onTertiary: '#FFFFFF',
    onBackground: '#1F2937',
    onSurface: '#1F2937',
    onSurfaceVariant: '#4B5563',
    
    // Custom colors for categories (consistent across themes)
    groceries: '#8BC34A',
    bills: '#FF9800',
    savings: '#00ACC1',
    personal: '#9C27B0',
    travel: '#FF7043',
    household: '#1565C0',
    emergency: '#D32F2F',
    investments: '#0D47A1',
    
    // Utility colors
    warning: '#FFB300',
    success: '#2E7D32',
    info: '#1976D2',
    
    // Chart colors
    chartPrimary: '#1565C0',
    chartSecondary: '#2E7D32',
    chartTertiary: '#FF9800',
    chartQuaternary: '#9C27B0',
  },
  roundness: 16,
};

// Dark Theme - Exact match to desktop app
export const darkTheme = {
  ...MD3DarkTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3DarkTheme.colors,
    // Primary colors matching desktop
    primary: '#1976d2',
    primaryContainer: '#1565c0',
    secondary: '#4caf50', // Green for income/positive
    secondaryContainer: '#2E7D32',
    tertiary: '#ff9800', // Orange/yellow accents
    tertiaryContainer: '#f57c00',
    error: '#f44336', // Red for expenses/negative
    errorContainer: '#d32f2f',
    
    // Background colors - exact desktop match
    background: '#121212', // Deep charcoal / near-black
    surface: '#2d2d2d', // Card background (slightly lighter dark gray)
    surfaceVariant: '#333', // Borders and dividers
    surfaceContainer: '#1e1e1e', // Header background
    surfaceContainerHigh: '#424242', // Secondary buttons
    
    // Text colors
    outline: '#555',
    outlineVariant: '#666',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onTertiary: '#FFFFFF',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#ccc',
    
    // Custom colors for categories (matching desktop)
    groceries: '#4caf50',
    bills: '#ff9800',
    savings: '#2196f3',
    personal: '#9c27b0',
    travel: '#ff7043',
    household: '#1976d2',
    emergency: '#f44336',
    investments: '#0d47a1',
    
    // Utility colors (matching desktop)
    warning: '#ff9800',
    success: '#4caf50', // Green for income
    info: '#1976d2',
    
    // Chart colors (matching desktop)
    chartPrimary: '#1976d2',
    chartSecondary: '#4caf50',
    chartTertiary: '#ff9800',
    chartQuaternary: '#9c27b0',
  },
  roundness: 12, // Matching desktop card border radius
};

// Default export for backward compatibility
export const theme = lightTheme;

export type AppTheme = typeof lightTheme;

