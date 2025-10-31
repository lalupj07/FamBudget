const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron');
const path = require('path');

// Keep a global reference of the window object
let mainWindow;
let isDev = process.argv.includes('--dev');

// Create the main window
const createWindow = () => {
  
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
              message: 'FamBudget Desktop v2.0.1',
              detail: 'Advanced Family Budgeting Made Simple\n\nNew in v2.0.1:\n• Fixed Chart Visualization Issues\n• Enhanced Chart.js Integration\n• Improved Error Handling\n• Better Debugging & Logging\n• Comprehensive Demo Data\n• Multi-Currency Support (10+ currencies)\n• Income Tracker with Multiple Sources\n• Premium Dark Mode\n\nA complete desktop application for managing your family finances with beautiful charts, goal tracking, and expense management.'
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

ipcMain.handle('get-resources-path', () => {
  return process.resourcesPath;
});

ipcMain.handle('get-chartjs-path', () => {
  // Get path to Chart.js in extraResources
  const resourcesPath = process.resourcesPath;
  const chartJsPath = path.join(resourcesPath, 'vendor', 'chart.js', 'chart.umd.js');
  
  // Return the file:// URL for the path
  // Normalize path separators for Windows
  const normalizedPath = chartJsPath.replace(/\\/g, '/');
  
  // Handle Windows drive letters for file:// protocol
  if (/^[A-Za-z]:/.test(normalizedPath)) {
    // Windows: C:/path -> file:///C:/path (triple slash)
    return `file:///${normalizedPath}`;
  } else {
    // Unix: /path -> file:///path (triple slash)
    return `file://${normalizedPath}`;
  }
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
