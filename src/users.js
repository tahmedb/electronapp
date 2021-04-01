const db = require('electron-db');
import {  ipcMain } from 'electron'

const entity = 'users';
db.createTable(entity, (succ, msg) => {
    // succ - boolean, tells if the call is successful
    if(succ){
        db.insertTableContent(entity, {name:'khalil',password:'passpass'}, (succ, msg) => {
           
          }); 
    }
    console.log("Success: " + succ);
    console.log("Message: " + msg);
  })


  ipcMain.on('bringUsers', (event, arg) => {
    db.getAll(entity, (succ, data) => {
      event.reply('getUsers', data)
    });
  })
  
  ipcMain.on('saveUser', (event, arg) => {
    db.insertTableContent(entity, arg, (succ, msg) => {
      if (succ) {
        db.getAll(entity, (succ, data) => {
          event.reply('getUsers', data)
        });
      }
      event.returnValue = true;
    });
  })
  

  ipcMain.on('authenticate', (event, arg) => {
    db.getRows(entity, {
      name: arg.name,
      password: arg.password
    }, (succ, result) => {
      event.reply('authentication_event',result)
    })
  })