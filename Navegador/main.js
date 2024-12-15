const { app, BrowserWindow, ipcMain, session, components } = require('electron');
const path = require('path');
const Store = require('electron-store');
const axios = require('axios');

const store = new Store();
const API_URL = 'http://84.46.249.121:3000/api';

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      plugins: true
    }
  });

  // Enable protected content
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    const url = webContents.getURL();
    if (permission === 'media' || permission === 'protected-media-identifier') {
      callback(true);
    } else {
      callback(false);
    }
  });

  mainWindow.loadFile('index.html');
}

// Handle account selection and cookie management
ipcMain.handle('get-accounts', async () => {
  try {
    const token = store.get('token');
    const response = await axios.get(`${API_URL}/accounts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return [];
  }
});

ipcMain.handle('select-account', async (event, accountId) => {
  try {
    const token = store.get('token');
    const response = await axios.get(`${API_URL}/accounts/${accountId}/cookies`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Set cookies for the account
    const cookies = response.data.cookies;
    const domain = response.data.domain;
    
    await session.defaultSession.clearStorageData({});
    
    for (const cookie of cookies) {
      await session.defaultSession.cookies.set({
        url: `https://${domain}`,
        ...cookie
      });
    }
    
    return { success: true, domain };
  } catch (error) {
    console.error('Error selecting account:', error);
    return { success: false, error: error.message };
  }
});

// Initialize app with Widevine support
app.whenReady().then(async () => {
  // Wait for Widevine CDM to be ready
  await components.whenReady();
  console.log('Components ready:', components.status());
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});