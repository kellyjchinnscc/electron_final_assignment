//imports
const path = require('path');
const url = require('url');
let sqlite3 = require('sqlite3');
let knex = require('knex') ({
  client: "sqlite3",
  connection: { filename: "./exercises.db" },
  useNullAsDefault: true
})

//deconstruct imports
const { app, BrowserWindow, Menu, ipcMain, globalShortcut, ipcRenderer } = require('electron');

//variables for windows
let mainWindow;
let addWindow;
let updateWindow;
let deleteWindow;

//function to create main window
function createWindow() {
  mainWindow = new BrowserWindow( {
    width: 800,
    height: 600,
    icon: __dirname + '/images/cardio_icon.png',
    webPreferences: {
      nodeIntegration: true // if this isn't set to true, entered data into the form won't appear.
    }
  })

  // Loading in the HTML File that corresponds to the mainWindow variable
  mainWindow.loadFile('mainwindow.html')

  mainWindow.on('closed', function() {
    app.quit();
  });

  let menu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(menu)
  // mainWindow.webContents.openDevTools()
}//end createWindow

//function to create window for Adding
function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 500,
    height: 500,
    title: 'Add Exercise Entry',
    webPreferences: {
      nodeIntegration: true
    }
  });

  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addwindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  addWindow.on('close', function() {
    addWindow = null;
  });
  // addWindow.webContents.openDevTools()
}//end create addWindow

function createUpdateWindow() {
  updateWindow = new BrowserWindow({
    width: 500,
    height: 500,
    title: 'Edit Exercise Entry',
    webPreferences: {
      nodeIntegration: true
    }
  });
  updateWindow.loadFile('update.html')
  updateWindow.webContents.openDevTools();
  updateWindow.on('close', function() {
    updateWindow = null;
  });
}//end createUpdateWindow

function createDeleteWindow(){
  deleteWindow = new BrowserWindow({
    width: 350,
    height: 200,
    title: 'Edit/Remove Item',
    webPreferences: {
      nodeIntegration: true
    },
  })

  deleteWindow.loadFile('delete.html')

  deleteWindow.on('close', function() {
    deleteWindow = null;
  });

}//end createDeleteWindow


function clearWindow()
{
    mainWindow.webContents.send('item:clear');
}//end function clearWindow



function readDB() {
  clearWindow();
  // select statement
  let result = knex.select("id", "Date","Description","Duration","Difficulty","Notes").from('exercise')
  result.then(function(rows){
    mainWindow.webContents.send('item:add', rows)
  })
}



//template for menu
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add New Exercise Entry',
        click() {createAddWindow()}
      },
      {
        label: 'Quit',
        click(){app.quit()}
      }
    ]
  }
];

app.on('ready', createWindow)

app.whenReady().then(() => {
  globalShortcut.register('Control+Q', () => {
    app.quit()
  })
})


// LISTENERS
// CREATE LISTENER - This listener is waiting for the item:add function and data to come from addwindow.html and addWindow.js
ipcMain.on('item:add', function(e, entryDate, entryDesc, entryDuration, entryDifficulty, entryNotes) {
  
  // 1) store to database
  knex("exercise") // choosing which table to use
    .insert({ // inserting data into each column of table
      Date: entryDate,
      Description: entryDesc,
      Duration: entryDuration,
      Difficulty: entryDifficulty,
      Notes: entryNotes,
    })
    .then(() => console.log(entryDesc + " inserted into database"))
    .catch(err => console.log(err))
  // 2) call to database to fetch all of the data and display on the main page. Effectively a "refresh"
    .then(() => {readDB()})
  addWindow.close();
});

// DELETE LISTENER - This Listener will wait for the ID to come from update.html and its corresponding js file
ipcMain.on('item:delete', (e, idToDelete) => {
  // Delete from Database
  knex('exercise').where( {"id": idToDelete} ).del()
    .catch(err => console.log(err))
    .then(() => {
      console.log(idToDelete + " deleted successfully");
      readDB();  // Refresh the page
    })
})

// UPDATE LISTENER - This Listener will wait for the ID to come from update.html and its corresponding js file
// Once received, it will send data back to the front-end to pre-populate the Update form with existing data.
ipcMain.on('item:update', (e, idToUpdate) => {
 
  let result = knex.select("id", "Date","Description","Duration","Difficulty","Notes").from('exercise').where( {id: idToUpdate} )
  result.then(function(rows){
    createUpdateWindow()
    setTimeout(() => {
      updateWindow.webContents.send('item:display', rows) // SEND BACK
    }, 800)
  })
})

// Receive the Updated Data and call the database to update data
ipcMain.on('item:updatedb', (e, idField, dateField, descField, durationField, difficultyField, notesField) => {
    knex('exercise').where( {"id": idField} )
    .update({
      Date: dateField,
      Description: descField,
      Duration: durationField,
      Difficulty: difficultyField,
      Notes: notesField
    })
    .then(() => console.log("Updated Data!"))
    .catch(err => console.log(err))
  // 2) call to database to fetch all of the data and display on the main page. Effectively a "refresh"
    .then(() => {readDB()})
    updateWindow.close();
})