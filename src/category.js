const db = require('electron-db');
import {  ipcMain } from 'electron'

const entity = 'categories';

ipcMain.on('bringCategories', (event, arg) => {
    db.getAll(entity, (succ, data) => {
      event.reply('getCategories', data)
    });
  })
  
  ipcMain.on('saveCategory', (event, arg) => {
    db.insertTableContent(entity, arg, (succ, msg) => {
      if (succ) {
        db.getAll(entity, (succ, data) => {
          event.reply('getCategories', data)
        });
      }
      event.returnValue = true;
    });
  })