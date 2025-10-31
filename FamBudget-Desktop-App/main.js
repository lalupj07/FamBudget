const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Keep a global reference of the window object
let mainWindow;
let backendServer;
let isDev = process.argv.includes('--dev');

// Backend server setup
const startBackendServer = () => {
  const backendApp = express();
  
  // Middleware
  backendApp.use(helmet());
  backendApp.use(cors());
  backendApp.use(express.json());
  
  // API Routes
  backendApp.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'FamBudget Desktop API is running' });
  });
  
  backendApp.get('/api/dashboard', (req, res) => {
    // Mock dashboard data
    res.json({
      totalIncome: 5000,
      totalExpenses: 3200,
      netChange: 1800,
      savingsRate: 36,
      recentTransactions: [
        { id: 1, description: 'Grocery Shopping', amount: -150, category: 'Food', date: '2024-01-15' },
        { id: 2, description: 'Salary', amount: 5000, category: 'Income', date: '2024-01-14' },
        { id: 3, description: 'Gas Bill', amount: -80, category: 'Utilities', date: '2024-01-13' }
      ],
      budgetCategories: [
        { name: 'Food', budget: 800, spent: 450, remaining: 350 },
        { name: 'Utilities', budget: 300, spent: 280, remaining: 20 },
        { name: 'Entertainment', budget: 200, spent: 120, remaining: 80 }
      ]
    });
  });
  
  backendApp.get('/api/transactions', (req, res) => {
    res.json([
      { id: 1, description: 'Grocery Shopping', amount: -150, category: 'Food', date: '2024-01-15', account: 'Checking' },
      { id: 2, description: 'Salary', amount: 5000, category: 'Income', date: '2024-01-14', account: 'Checking' },
      { id: 3, description: 'Gas Bill', amount: -80, category: 'Utilities', date: '2024-01-13', account: 'Checking' },
      { id: 4, description: 'Movie Tickets', amount: -25, category: 'Entertainment', date: '2024-01-12', account: 'Checking' },
      { id: 5, description: 'Coffee', amount: -5, category: 'Food', date: '2024-01-11', account: 'Checking' }
    ]);
  });
  
  backendApp.get('/api/accounts', (req, res) => {
    res.json([
      { id: 1, name: 'Checking Account', type: 'checking', balance: 2500, color: '#1976d2' },
      { id: 2, name: 'Savings Account', type: 'savings', balance: 15000, color: '#388e3c' },
      { id: 3, name: 'Credit Card', type: 'credit', balance: -800, color: '#d32f2f' }
    ]);
  });
  
  backendApp.get('/api/goals', (req, res) => {
    res.json([
      { id: 1, name: 'Emergency Fund', target: 10000, current: 7500, deadline: '2024-12-31', priority: 'high' },
      { id: 2, name: 'Vacation', target: 3000, current: 1200, deadline: '2024-06-30', priority: 'medium' },
      { id: 3, name: 'New Car', target: 25000, current: 5000, deadline: '2025-03-31', priority: 'low' }
    ]);
  });
  
  backendApp.get('/api/reports', (req, res) => {
    res.json({
      monthlyIncome: 5000,
      monthlyExpenses: 3200,
      categoryBreakdown: {
        'Food': 450,
        'Utilities': 280,
        'Entertainment': 120,
        'Transportation': 200,
        'Healthcare': 150
      },
      trends: [
        { month: 'Jan', income: 5000, expenses: 3200 },
        { month: 'Feb', income: 5000, expenses: 3100 },
        { month: 'Mar', income: 5000, expenses: 3300 }
      ]
    });
  });
  
  // Start server
  const PORT = 3001;
  backendServer = backendApp.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
};

// Create the main window
const createWindow = () => {
  // Start backend server
  startBackendServer();
  
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  // Load the app
  mainWindow.loadFile('index.html');

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Open DevTools in development
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
};

// App event handlers
app.whenReady().then(() => {
  createWindow();
  
  // Create application menu
  createMenu();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Stop backend server
  if (backendServer) {
    backendServer.close();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Create application menu
const createMenu = () => {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Transaction',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-transaction');
          }
        },
        {
          label: 'Import Data',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [
                { name: 'CSV Files', extensions: ['csv'] },
                { name: 'All Files', extensions: ['*'] }
              ]
            });
            
            if (!result.canceled) {
              mainWindow.webContents.send('menu-import-data', result.filePaths[0]);
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About FamBudget',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About FamBudget',
              message: 'FamBudget Desktop v1.0.0',
              detail: 'Family Budgeting Made Simple\n\nA complete desktop application for managing your family finances with beautiful charts, goal tracking, and expense management.'
            });
          }
        },
        {
          label: 'Documentation',
          click: () => {
            shell.openExternal('https://github.com/fambudget/fambudget');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

// IPC handlers
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('show-save-dialog', async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle('show-open-dialog', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

ipcMain.handle('show-message-box', async (event, options) => {
  const result = await dialog.showMessageBox(mainWindow, options);
  return result;
});
