# FamBudget - Setup Guide

This guide will help you get FamBudget up and running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Expo CLI** (for mobile development)
- **Git** - [Download](https://git-scm.com/)

### Optional
- **Xcode** (for iOS development on Mac)
- **Android Studio** (for Android development)

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd FamBudget
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your settings:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=fambudget

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d

# Application
PORT=3000
NODE_ENV=development

# Encryption (32 characters minimum for AES-256)
ENCRYPTION_KEY=your-32-character-encryption-key-here-change-this
```

#### Set Up PostgreSQL Database

**Option 1: Using psql command line**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE fambudget;

# Exit psql
\q
```

**Option 2: Using pgAdmin**

1. Open pgAdmin
2. Right-click on "Databases"
3. Select "Create" → "Database"
4. Enter "fambudget" as the database name
5. Click "Save"

#### Start the Backend Server

```bash
npm run start:dev
```

You should see:
```
🚀 FamBudget API running on http://localhost:3000
```

The database tables will be automatically created on first run (thanks to TypeORM's `synchronize: true` in development).

### 3. Mobile App Setup

#### Install Dependencies

Open a new terminal window:

```bash
cd mobile
npm install
```

#### Configure API URL

Edit `mobile/src/services/api.ts`:

```typescript
// For iOS Simulator
const API_URL = 'http://localhost:3000';

// For Android Emulator
// const API_URL = 'http://10.0.2.2:3000';

// For Physical Device (use your computer's IP)
// const API_URL = 'http://192.168.1.XXX:3000';
```

To find your computer's IP:
- **macOS/Linux**: `ifconfig | grep "inet "`
- **Windows**: `ipconfig` and look for IPv4 Address

#### Start Expo

```bash
npm start
```

This will open Expo DevTools in your browser.

#### Run on Device/Simulator

**iOS Simulator (Mac only):**
```bash
npm run ios
```

**Android Emulator:**
```bash
npm run android
```

**Physical Device:**
1. Install "Expo Go" app from App Store/Play Store
2. Scan the QR code shown in the terminal
3. The app will load on your device

### 4. Create Your First Account

1. Open the mobile app
2. Tap "Get Started"
3. Fill in the registration form:
   - Your Name
   - Email
   - Household Name (e.g., "Smith Family")
   - Password (minimum 8 characters)
4. Tap "Create Account"
5. You'll be logged in automatically!

### 5. Set Up Your Budget

1. Navigate to the **Budget** tab
2. Tap "Create Default Categories"
3. This creates 5 default envelopes:
   - Household (40%)
   - Bills (20%)
   - Groceries (15%)
   - Personal (15%)
   - Savings (10%)
4. Tap the edit button (pencil icon) to adjust percentages
5. Use sliders to customize your budget split
6. Tap "Save Changes"

## Troubleshooting

### Backend Issues

**Problem: Database connection error**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
- Ensure PostgreSQL is running: `brew services start postgresql` (Mac) or check Windows services
- Verify credentials in `.env` file
- Check if database exists: `psql -U postgres -l`

**Problem: Port 3000 already in use**

**Solution:**
- Change PORT in `.env` to a different port (e.g., 3001)
- Or stop the process using port 3000

### Mobile Issues

**Problem: Cannot connect to backend**
```
Network Error
```

**Solution:**
- Ensure backend is running (`npm run start:dev` in backend folder)
- Check API_URL in `mobile/src/services/api.ts`
- For physical devices, use your computer's IP address, not `localhost`
- Ensure firewall allows connections on port 3000

**Problem: Metro bundler errors**

**Solution:**
```bash
cd mobile
rm -rf node_modules
npm install
npm start -- --reset-cache
```

**Problem: Expo Go app not loading**

**Solution:**
- Ensure phone and computer are on the same WiFi network
- Check if port 19000-19001 are not blocked by firewall
- Try tunnel mode: `npm start -- --tunnel`

## Development Workflow

### Running Both Backend and Mobile

**Terminal 1 (Backend):**
```bash
cd backend
npm run start:dev
```

**Terminal 2 (Mobile):**
```bash
cd mobile
npm start
```

### Making Changes

- Backend changes are hot-reloaded automatically
- Mobile changes trigger a reload in Expo
- Database schema changes require server restart

### Testing API Endpoints

Use tools like:
- **Postman** - [Download](https://www.postman.com/)
- **Insomnia** - [Download](https://insomnia.rest/)
- **curl** (command line)

Example:
```bash
# Register a user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "householdName": "Test Family"
  }'
```

## Next Steps

1. **Add Income Sources** - Set up your salary/income
2. **Track Expenses** - Start adding transactions
3. **Set Goals** - Create savings goals
4. **Invite Family** - Add partner or family members
5. **Explore Reports** - View your spending analytics

## Production Deployment

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md) (coming soon).

Key considerations:
- Set `NODE_ENV=production`
- Use strong, unique secrets
- Disable TypeORM `synchronize` (use migrations)
- Set up proper SSL/TLS
- Configure cloud database (AWS RDS, etc.)
- Use environment-specific configurations

## Support

Having issues? Check:
- [README.md](./README.md) for feature overview
- [GitHub Issues](your-repo/issues) for known issues
- [API Documentation](./API.md) for endpoint details

Happy budgeting! 💰

