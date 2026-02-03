const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  console.log('Creating test window...');
  
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  console.log('Loading index.html...');
  mainWindow.loadFile('index.html');

  mainWindow.once('ready-to-show', () => {
    console.log('Window ready to show');
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    console.log('Window closed');
  });
}

app.whenReady().then(() => {
  console.log('App ready, creating window...');
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

console.log('Test script loaded');
