const { app, BrowserWindow, ipcMain, screen, globalShortcut, dialog } = require('electron');


const prompt = require('electron-prompt');


var fs = require('fs');
// var screenshot = require('electron-screenshot-service');



const path = require('path');
let ctrlBPressed = false;

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
    // width: 1000,
    // height: 900,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: __dirname + "\\api.js",

    },
    transparent: true,
    alwaysOnTop: true,
  });

  ipcMain.on('close-app', () => {
    app.quit()
  })
  ipcMain.on('passthru', () => {
    mainWindow.setIgnoreMouseEvents(true, { forward: true });
  })
  ipcMain.on('block', () => {
    mainWindow.setIgnoreMouseEvents(false);
  })
  ipcMain.on('blockHold', () => {
    mainWindow.setIgnoreMouseEvents(false);
  })
  ipcMain.on('UserPrompt', () => {

    //Handle HotKeys Allowance/Disallowance
    ctrlBPressed = false;
    mainWindow.setIgnoreMouseEvents(true, { forward: true });

    prompt({
      title: 'Prompt example',
      label: 'URL:',
      value: '',
      type: 'input'
    })
      .then((r) => {

        if (r === null) {
          console.log('user cancelled');
        } else {
          console.log('result', r);
        }
      })
      .catch(console.error);
  })


  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // // // // Open the DevTools.
  mainWindow.webContents.openDevTools();

  //Register Global Keyobard Events
  const ret = globalShortcut.register('Control+B', () => {
    console.log('Control+B is pressed')
    if (ctrlBPressed) {
      ctrlBPressed = false;
      mainWindow.setIgnoreMouseEvents(true, { forward: true });

    }
    else {
      ctrlBPressed = true;
      mainWindow.setIgnoreMouseEvents(false);
    }

  })

  if (!ret) {
    console.log('registration failed')
  }



}

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
// Importing dialog module using remote
