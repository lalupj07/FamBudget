# FamBudget - Deployment Guide

Guide for deploying FamBudget to production.

## 🚀 Production Deployment Options

### Backend Deployment

#### Option 1: Heroku (Easiest)

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
cd backend
heroku create fambudget-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set ENCRYPTION_KEY=$(openssl rand -base64 32)

# Deploy
git push heroku main

# Run migrations
heroku run npm run typeorm migration:run
```

#### Option 2: AWS EC2

```bash
# 1. Launch EC2 instance (Ubuntu)
# 2. SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# 5. Clone and setup
git clone your-repo
cd FamBudget/backend
npm install
npm run build

# 6. Setup PM2
sudo npm install -g pm2
pm2 start dist/main.js --name fambudget-api
pm2 startup
pm2 save

# 7. Setup Nginx reverse proxy
sudo apt-get install nginx
# Configure nginx to proxy port 3000
```

#### Option 3: DigitalOcean App Platform

```bash
# 1. Create App Platform project
# 2. Connect GitHub repository
# 3. Configure:
#    - Build Command: npm install && npm run build
#    - Run Command: npm run start
#    - Port: 3000
# 4. Add PostgreSQL database
# 5. Set environment variables
# 6. Deploy
```

### Mobile App Deployment

#### iOS (App Store)

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Configure
cd mobile
eas build:configure

# 3. Update app.json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.fambudget",
      "buildNumber": "1.0.0"
    }
  }
}

# 4. Build for iOS
eas build --platform ios --profile production

# 5. Submit to App Store
eas submit --platform ios
```

#### Android (Play Store)

```bash
# 1. Build for Android
eas build --platform android --profile production

# 2. Submit to Play Store
eas submit --platform android
```

## 🔐 Production Security Checklist

### Backend

- [ ] Change all default secrets in `.env`
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS only
- [ ] Set secure CORS origins
- [ ] Disable TypeORM `synchronize` (use migrations)
- [ ] Enable rate limiting
- [ ] Set up logging (Winston, Sentry)
- [ ] Configure helmet.js for security headers
- [ ] Enable CSRF protection
- [ ] Set up database backups

### Mobile

- [ ] Update API_URL to production domain
- [ ] Enable code obfuscation
- [ ] Remove console.log statements
- [ ] Set up crash reporting (Sentry)
- [ ] Configure analytics
- [ ] Set up deep linking
- [ ] Test on real devices
- [ ] Optimize images and assets

## ⚙️ Environment Variables

### Backend Production `.env`

```env
# Database (from hosting provider)
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password
DB_DATABASE=fambudget_prod

# Security (generate strong secrets)
JWT_SECRET=your-super-long-random-secret-min-32-chars
JWT_EXPIRATION=7d
ENCRYPTION_KEY=your-32-character-aes-256-key

# App
PORT=3000
NODE_ENV=production

# Optional: AWS S3 for receipts
AWS_REGION=us-east-1
AWS_S3_BUCKET=fambudget-receipts
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret

# Optional: Email (SendGrid, SES, etc.)
EMAIL_FROM=noreply@fambudget.com
SENDGRID_API_KEY=your-key

# Optional: Monitoring
SENTRY_DSN=your-sentry-dsn
```

### Mobile Production Config

Update `mobile/src/services/api.ts`:

```typescript
const API_URL = __DEV__ 
  ? 'http://localhost:3000' 
  : 'https://api.fambudget.com';
```

## 📊 Database Migrations

**Important:** In production, disable `synchronize` and use migrations.

**Update `backend/src/app.module.ts`:**

```typescript
TypeOrmModule.forRoot({
  // ...
  synchronize: false, // NEVER true in production
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,
}),
```

**Generate migration:**

```bash
cd backend
npm run typeorm migration:generate -- -n InitialSchema
```

**Run migrations:**

```bash
npm run typeorm migration:run
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "fambudget-api"
          heroku_email: "your@email.com"
          appdir: "backend"

  deploy-mobile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd mobile && npm install
      - name: Build
        run: cd mobile && eas build --platform all --non-interactive
```

## 📈 Monitoring & Logging

### Backend Monitoring

```bash
# Install Sentry
cd backend
npm install @sentry/node

# Add to main.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Mobile Monitoring

```bash
# Install Sentry
cd mobile
npx expo install sentry-expo

# Configure in App.tsx
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'your-dsn',
  enableInExpoDevelopment: false,
  debug: false,
});
```

## 💾 Backup Strategy

### Database Backups

```bash
# Automated daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump fambudget_prod > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://fambudget-backups/
```

### User Data Export

Provide users with data export in the app:
- CSV exports (already implemented)
- PDF reports (already implemented)
- Full data dump option

## 🌍 CDN & Assets

### Setup CloudFront (AWS) for Static Assets

1. Create S3 bucket for assets
2. Setup CloudFront distribution
3. Update mobile app to use CDN URLs
4. Enable compression

## 📱 App Store Optimization

### iOS App Store

- **Screenshots:** 6.5" and 5.5" displays
- **App Preview Video:** 30 seconds max
- **Keywords:** Budget, Family, Finance, Money
- **Description:** Clear, benefit-focused

### Google Play Store

- **Feature Graphic:** 1024x500
- **Screenshots:** Minimum 2, maximum 8
- **Video:** YouTube link
- **Category:** Finance

## 🔧 Post-Deployment

- [ ] Test all features in production
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Set up alerts
- [ ] Test on multiple devices
- [ ] Verify backups working
- [ ] Document deployment process
- [ ] Train support team

## 📞 Support

After deployment, set up:
- Support email
- In-app feedback
- Bug reporting system
- User documentation
- FAQ page

## 🎉 Launch Checklist

- [ ] Backend deployed and tested
- [ ] Database secured and backed up
- [ ] Mobile apps submitted to stores
- [ ] Analytics configured
- [ ] Monitoring active
- [ ] Support channels ready
- [ ] Marketing materials prepared
- [ ] Beta testers approved
- [ ] Legal/privacy policy published
- [ ] Launch announcement ready

---

**Good luck with your deployment! 🚀**

For questions, see [README.md](./README.md) or [CONTRIBUTING.md](./CONTRIBUTING.md)

