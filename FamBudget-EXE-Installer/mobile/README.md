# FamBudget Mobile App

React Native mobile application for FamBudget family budgeting system.

## Tech Stack

- **Framework**: React Native (Expo)
- **UI Library**: React Native Paper (Material Design 3)
- **Navigation**: React Navigation v6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Storage**: AsyncStorage
- **Language**: TypeScript

## Project Structure

```
mobile/
├── src/
│   ├── screens/           # Screen components
│   │   ├── auth/          # Authentication screens
│   │   │   ├── OnboardingScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   └── main/          # Main app screens
│   │       ├── DashboardScreen.tsx
│   │       ├── BudgetScreen.tsx
│   │       ├── TransactionsScreen.tsx
│   │       ├── GoalsScreen.tsx
│   │       └── SettingsScreen.tsx
│   ├── navigation/        # Navigation configuration
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── services/          # API services
│   │   └── api.ts
│   ├── components/        # Reusable components
│   ├── theme.ts           # Material Design theme
│   └── types/             # TypeScript types
├── App.tsx                # Root component
├── app.json               # Expo configuration
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript config
```

## Features

### Authentication
- Beautiful onboarding flow
- Email/password registration
- Secure login with JWT
- Persistent sessions

### Dashboard
- Combined balance overview
- Budget vs. spent visualization
- Category breakdown with progress bars
- Quick actions

### Budget Planner
- Interactive envelope cards
- Real-time percentage sliders
- Visual allocation feedback
- Default category templates

### Transactions
- Timeline view with filters
- Quick add with modal
- Category-based filtering
- Color-coded categories

### Goals
- Visual progress tracking
- Multiple contributors support
- Deadline monitoring
- Achievement celebrations

### Settings
- Profile management
- Household settings
- Security options (biometric, 2FA)
- Data export
- Member invitations

## Design System

### Colors

```typescript
primary: '#1565C0'        // Strong Blue
success: '#2E7D32'        // Green
warning: '#FFB300'        // Amber
error: '#D32F2F'          // Red
background: '#FAFBFF'     // Soft off-white

// Category Colors
groceries: '#8BC34A'      // Light Green
bills: '#FF9800'          // Orange
savings: '#00ACC1'        // Cyan
personal: '#9C27B0'       // Purple
travel: '#FF7043'         // Deep Orange
```

### Typography

- **Roboto** font family
- Headlines: 20-24px
- Body: 14-16px
- UI labels: 12-13px

### Components

- Cards with 16px border radius
- Soft elevation shadows
- Ample padding (16-24px)
- 44px minimum touch targets

## Development

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
npm install
```

### Running

```bash
# Start Expo DevTools
npm start

# Run on iOS Simulator
npm run ios

# Run on Android Emulator
npm run android

# Run on web
npm run web
```

### Configuration

Update API URL in `src/services/api.ts`:

```typescript
// For iOS Simulator
const API_URL = 'http://localhost:3000';

// For Android Emulator
const API_URL = 'http://10.0.2.2:3000';

// For Physical Device (use your IP)
const API_URL = 'http://192.168.1.XXX:3000';
```

## Building

### Development Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build for iOS
eas build --platform ios --profile development

# Build for Android
eas build --platform android --profile development
```

### Production Build

```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

## State Management

### Auth Context

Manages user authentication state:
- User profile
- JWT token
- Household data
- Login/logout functions

```typescript
const { user, household, login, logout } = useAuth();
```

## API Integration

All API calls go through the centralized `api.ts` service:

```typescript
import { api } from '@/services/api';

// Authenticated requests automatically include JWT
const response = await api.get('/household/dashboard');
```

## Navigation Structure

```
Root Navigator
├── Auth Stack (if not logged in)
│   ├── Onboarding
│   ├── Login
│   └── Register
└── Main Tabs (if logged in)
    ├── Dashboard
    ├── Budget
    ├── Transactions
    ├── Goals
    └── Settings
```

## Performance

- Lazy loading of screens
- Image optimization
- List virtualization with FlatList
- Memoized components
- Efficient re-renders with React.memo

## Accessibility

- Screen reader support
- High contrast mode
- Large text support
- Keyboard navigation
- Semantic HTML elements

## License

MIT

