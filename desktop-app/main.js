/**
 * FamBudget Desktop - Main Process
 * Clean, Standard Version
 */

const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// [FIX 1] Disable Hardware Acceleration - proven to help with blank screens
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-gpu-sandbox');
app.commandLine.appendSwitch('disable-software-rasterizer');

let mainWindow;
const isDev = process.argv.includes('--dev');

function createWindow() {
  // [FIX 2] Standard Window Configuration
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    center: true,
    show: false, // Wait for ready-to-show
    backgroundColor: '#f5f5f5',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    title: 'FamBudget'
  });

  // [FIX 3] Absolute Path Loading
  const indexPath = path.join(__dirname, 'index.html');
  console.log('Loading app from:', indexPath);
  console.log('__dirname:', __dirname);
  console.log('File exists:', fs.existsSync(indexPath));
  
  mainWindow.loadFile(indexPath);

  // [FIX 4] Reliable Window Showing
  mainWindow.once('ready-to-show', () => {
    console.log('ready-to-show fired');
    mainWindow.show();
    mainWindow.focus();
  });

  // [FIX 5] Timeout Fallback (just in case)
  setTimeout(() => {
    if (mainWindow && !mainWindow.isVisible()) {
      console.log('Timeout: forcing window show');
      mainWindow.show();
    }
  }, 3000);

  // ALWAYS open DevTools to debug white screen
  mainWindow.webContents.openDevTools();
  
  // Log any load errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Page failed to load:', errorCode, errorDescription);
  });
  
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page finished loading');
  });
  
  mainWindow.webContents.on('console-message', (event, level, message) => {
    console.log('Renderer:', message);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  createMenu();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

function createMenu() {
  const template = [{ role: 'fileMenu' }, { role: 'editMenu' }, { role: 'viewMenu' }, { role: 'windowMenu' }];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC Handlers for Chart.js and Versioning
ipcMain.handle('get-app-version', () => app.getVersion());

ipcMain.handle('get-resources-path', () => {
  // In dev mode, return the app directory; in production, return resources path
  if (isDev || !app.isPackaged) {
    return __dirname;
  }
  return process.resourcesPath;
});

ipcMain.handle('get-chartjs-path', () => {
  // In dev mode, Chart.js is in node_modules - return null to use fallback
  if (isDev || !app.isPackaged) {
    return null; // Let renderer use node_modules fallback
  }
  
  // In production, Chart.js is in extraResources
  const resourcesPath = process.resourcesPath;
  const chartJsPath = path.join(resourcesPath, 'vendor', 'chart.js', 'chart.umd.js');
  
  // Check if file exists
  if (!fs.existsSync(chartJsPath)) {
    console.log('Chart.js not found at:', chartJsPath);
    return null;
  }
  
  const normalizedPath = chartJsPath.replace(/\\/g, '/');
  return /^[A-Za-z]:/.test(normalizedPath) ? `file:///${normalizedPath}` : `file://${normalizedPath}`;
});

// Dialog IPC Handlers (required by preload.js)
ipcMain.handle('show-save-dialog', async (event, options) => {
  return await dialog.showSaveDialog(mainWindow, options);
});

ipcMain.handle('show-open-dialog', async (event, options) => {
  return await dialog.showOpenDialog(mainWindow, options);
});

ipcMain.handle('show-message-box', async (event, options) => {
  return await dialog.showMessageBox(mainWindow, options);
});
