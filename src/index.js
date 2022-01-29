const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

//Record

// Global state
let mediaRecorder; // MediaRecorder instance to capture footage
const recordedChunks = [];

require('electron-reload')(__dirname)
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {

  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    // width: 3500,
    // height: 900,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: __dirname + "\\api.js",
      nodeIntegration: true
    },
    transparent: true,
    alwaysOnTop: true,
  });

  ipcMain.on('close-app', () => {
    app.quit()
  })

  ipcMain.on('start', () => {
    mainWindow.setIgnoreMouseEvents(true, { forward: true });

  })
  ipcMain.on('ignore', () => {
    mainWindow.setIgnoreMouseEvents(false, { forward: true });
  })
  ipcMain.on('allow', () => {
    mainWindow.setIgnoreMouseEvents(true, { forward: true });

  })



 
  ipcMain.on('record', () => {
    // Buttons
    selectSource()
  })




  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
