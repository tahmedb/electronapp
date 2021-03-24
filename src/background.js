'use strict'

import { app, protocol, BrowserWindow, ipcMain ,shell} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const db = require('electron-db');
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

db.createTable('categories', (succ, msg) => {
  // succ - boolean, tells if the call is successful
  console.log("Success: " + succ);
  console.log("Message: " + msg);
})
db.createTable('products', (succ, msg) => {
  // succ - boolean, tells if the call is successful
  console.log("Success: " + succ);
  console.log("Message: " + msg);
})

db.createTable('parts', (succ, msg) => {
  // succ - boolean, tells if the call is successful
  console.log("Success: " + succ);
  console.log("Message: " + msg);
})


async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      conheaderIsolation: false,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      //nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  })
  win.setMenuBarVisibility(false);
  ipcMain.on('bringProducts', (event, arg) => {
    db.getAll("products", (succ, data) => {
      event.reply('getProducts', data)
    });
  })

  ipcMain.on('saveProducts', (event, arg) => {
    db.insertTableContent("products", arg, (succ, msg) => {
      if (succ) {
        db.getAll("products", (succ, data) => {
          event.reply('getProducts', data)
        });
      }
      event.returnValue = true;
    });
  })

  ipcMain.on('bringCategories', (event, arg) => {
    db.getAll("categories", (succ, data) => {
      event.reply('getCategories', data)
    });
  })

  ipcMain.on('saveCategory', (event, arg) => {
    db.insertTableContent("categories", arg, (succ, msg) => {
      if (succ) {
        db.getAll("categories", (succ, data) => {
          event.reply('getCategories', data)
        });
      }
      event.returnValue = true;
    });
  })

  ipcMain.on('bringParts', (event, arg) => {
    db.getAll("parts", (succ, data) => {
      event.reply('getParts', data)
    });
  })

  ipcMain.on('savePart', (event, arg) => {
    db.insertTableContent("parts", arg, (succ, msg) => {
      if (succ) {
        db.getAll("parts", (succ, data) => {
          event.reply('getParts', data)
        });
      }
      event.returnValue = true;
    });
  })

  ipcMain.on('exportExcel', (event, arg) => {
    createNewExcelFile(arg);
    event.returnValue = true;
  })
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    //if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    //win.webContents.openDevTools()
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

function createNewExcelFile(products) {
  //console.log('products',products);
  var Excel = require('exceljs');
  // A new Excel Work Book
  var workbook = new Excel.Workbook();

  // Some information about the Excel Work Book.
  workbook.creator = 'Khalil';
  workbook.lastModifiedBy = '';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Create a sheet
  var sheet = workbook.addWorksheet('Sheet1');
  // A table header
  sheet.columns = [
    {
      header: "Id",
      key: "id",
    },
    { header: "Name", key: "name" },
    { header: "Line", key: "line" },
    { header: "Machine No.", key: "machine" },
    { header: "Part Name", key: "part_name" },
    { header: "Qty", key: "quantity" },
    { header: "Category", key: "category" },
    { header: "Create Date", key: "create_date" },
  ]

  // Add rows in the above header
  products.forEach(product => {
    sheet.addRow(product);
  })


  // Save Excel on Hard Disk
  let date = Date.now();
  // Save Excel on Hard Disk
  workbook.xlsx.writeFile(date+"Excel.xlsx")
  .then(function() {
    shell.openPath(date+'Excel.xlsx');
  });
}