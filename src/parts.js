const db = require('electron-db');
import {  ipcMain } from 'electron'

const entity = entity;



function updatePart(part, event) {
    let where = {
      "id": part.id
    };
    let set = {
      'name': part.name,
      'stock': parseInt(part.stock) + parseInt(part.update_stock),
      'last_modified': new Date()
    }
    db.updateRow(entity, where, set, (succ, msg) => {
      console.log("stock update: " + succ);
      if (succ) {
        console.log('succ', succ)
        //maintain part history
        setTimeout(() => {
          db.insertTableContent("partsHistory", { ...part, stock: part.update_stock, part_id: part.id, create_date: new Date() }, (succ, msg) => {
            console.log('history added', succ);
          });
        }, 20);
  
        //send update parts to renderer
        setTimeout(() => {
          db.getAll(entity, (succ, data) => {
            console.log('fetch parts');
            event.reply('getParts', data)
          });
        }, 40);
      }
    });
  }
  function deductParts(part, qty) {
    db.getRows(entity, {
      name: part
    }, (succ, result) => {
      let stock = result[0].stock;
      let where = {
        "name": part
      };
  
      let set = {
        "stock": stock - qty
      }
      db.updateRow(entity, where, set, (succ, msg) => {
        console.log("stock update: " + succ);
      });
    })
  
  }
  
  ipcMain.on('bringParts', (event, arg) => {
    db.getAll(entity, (succ, data) => {
      event.reply('getParts', data)
    });
  })
  
  ipcMain.on('bringCategoryParts', (event, arg) => {
    db.getRows(entity, {
      category: arg.category
    }, (succ, result) => {
      event.reply('getCategoryParts',result)
    })
  })
  ipcMain.on('savePart', (event, arg) => {
    db.getRows(entity, {
      category: arg.category,
      name: arg.name
    }, (succ, result) => {
      // succ - boolean, tells if the call is successful
      if(result.length == 0){
        db.insertTableContent(entity, arg, (succ, msg) => {
          if (succ) {
            db.getAll(entity, (succ, data) => {
              event.reply('getParts', data)
            });
          }
          event.reply('partResult', true)
        });
      }else {
        event.reply('partResult', false)
      }
    })  
  })
  ipcMain.on('updatePart', (event, arg) => {
    updatePart(arg, event);
  })
  
  ipcMain.on('bringPartsHistory', (event, arg) => {
    db.getRows("partsHistory", { part_id: arg }, (succ, data) => {
      event.reply('getPartsHistory', data)
    });
  })