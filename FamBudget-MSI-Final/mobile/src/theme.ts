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

// Dark Theme
export const darkTheme = {
  ...MD3DarkTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#64B5F6',
    primaryContainer: '#0D47A1',
    secondary: '#81C784',
    secondaryContainer: '#1B5E20',
    tertiary: '#4DD0E1',
    tertiaryContainer: '#006064',
    error: '#EF5350',
    errorContainer: '#B71C1C',
    background: '#0F1419',
    surface: '#1A1F24',
    surfaceVariant: '#2A2F34',
    surfaceContainer: '#242930',
    surfaceContainerHigh: '#2E3338',
    outline: '#6B7280',
    outlineVariant: '#374151',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onTertiary: '#000000',
    onBackground: '#F9FAFB',
    onSurface: '#F9FAFB',
    onSurfaceVariant: '#D1D5DB',
    
    // Custom colors for categories (adjusted for dark mode)
    groceries: '#A5D6A7',
    bills: '#FFB74D',
    savings: '#4DD0E1',
    personal: '#BA68C8',
    travel: '#FF8A65',
    household: '#64B5F6',
    emergency: '#EF5350',
    investments: '#42A5F5',
    
    // Utility colors
    warning: '#FFCA28',
    success: '#66BB6A',
    info: '#42A5F5',
    
    // Chart colors (adjusted for dark mode)
    chartPrimary: '#64B5F6',
    chartSecondary: '#81C784',
    chartTertiary: '#FFB74D',
    chartQuaternary: '#BA68C8',
  },
  roundness: 16,
};

// Default export for backward compatibility
export const theme = lightTheme;

export type AppTheme = typeof lightTheme;

