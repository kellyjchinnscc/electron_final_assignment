const {ipcRenderer} = require('electron')
const knex = require("knex")({
    client: "sqlite3",
    connection:{ filename:"./wine.db" },
    useNullAsDefault: true
});

// Delete Wine
function deleteWine(){
    let wineId = parseInt(document.getElementById("wine_id").value);
    console.log(wineId);
	ipcRenderer.send('item:delete', wineId) //call to main.js
}

// Edit Pasta
function editWine() {
    // Stub - students to code
}


// Submit Buttons
const deleteButton = document.getElementById("deleteButton");

// Button event listeners
deleteButton.addEventListener('click', deleteWine);