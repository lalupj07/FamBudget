# 📊 How to Add PostgreSQL Database in Railway

## 🎯 Where to Add It

After you've created your Railway project and deployed the backend service:

### Step-by-Step Location Guide

1. **Look at your Railway project dashboard**
   - You should see your project name at the top
   - Below it, you'll see one or more services (boxes/cards)
   - One service will be your backend (named something like "fambudget" or "web" or your repo name)

2. **Find the "New" button**
   - Look at the **top right corner** of your Railway project dashboard
   - You'll see a button that says **"New"** or **"+"** or has a **plus icon**
   - This button is usually in the same row as your project name

3. **Click "New" button**
   - When you click it, a dropdown menu or modal will appear
   - Look for these options:
     - "Service" (to add another service)
     - **"Database"** ← This is what you want!
     - "Empty Service"
     - etc.

4. **Select "Database"**
   - Click on **"Database"** from the menu

5. **Choose PostgreSQL**
   - Another menu or screen will appear
   - Select **"PostgreSQL"**
   - Railway will automatically create and configure it

## 📍 Visual Guide

```
Railway Dashboard Layout:
┌─────────────────────────────────────────┐
│  FamBudget Project           [New] [+] │ ← New button here!
├─────────────────────────────────────────┤
│  ┌──────────────┐                      │
│  │  Backend     │                      │ ← Your backend service
│  │  Service     │                      │
│  └──────────────┘                      │
│                                         │
│  (After clicking New → Database):     │
│  ┌──────────────┐  ┌──────────────┐    │
│  │  Backend     │  │  Postgres   │    │ ← New database appears here
│  │  Service     │  │  Database   │    │
│  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────┘
```

## ✅ What Happens After Adding Database

1. Railway will create a PostgreSQL database service
2. It will appear as a new service card/box on your dashboard
3. Railway will automatically name it (usually "Postgres" or similar)
4. The database will be configured automatically
5. Railway will provide connection variables automatically

## ⚠️ Important Notes

- **Name matters**: Railway will name it something like "Postgres" - remember this name!
- **You'll use this name** in environment variables: `${{Postgres.PGHOST}}`
- If Railway names it differently (like "postgres" or "PostgreSQL"), adjust the variables accordingly
- The database is automatically linked to your project

## 🔗 After Adding Database

Once the database is added, you need to:
1. Go back to your **backend service**
2. Go to **"Variables"** tab
3. Add the database connection variables (they'll use the database service name)

---

**Still can't find it?** The "New" button is usually at the **top right** of your Railway project dashboard!

