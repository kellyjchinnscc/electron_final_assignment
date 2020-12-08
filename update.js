const {ipcRenderer} = require('electron')
const knex = require("knex")({
    client: "sqlite3",
    connection:{ filename:"./wine.db" },
    useNullAsDefault: true
});

const form = document.querySelector('form')
form.addEventListener('submit', editEntry)

// populate form with data for the ID
ipcRenderer.on('item:display', (e, items) => { 
    console.log(items)
    let idField = document.querySelector('#entryid').value = items[0].id
    let dateField = document.querySelector('#date').value = items[0].Date
    let descField = document.querySelector('#description').value = items[0].Description
    let durationField = document.querySelector('#duration').value = items[0].Duration
    let difficultyField = document.querySelector('#difficulty').value = items[0].Difficulty
    let notesField = document.querySelector('#notes').value = items[0].Notes
})

// Edit Wine
function editEntry(e) {
    e.preventDefault();
    let idField = document.querySelector('#entryid').value
    let dateField = document.querySelector('#date').value
    let descField = document.querySelector('#description').value
    let durationField = document.querySelector('#duration').value
    let difficultyField = document.querySelector('#difficulty').value
    let notesField = document.querySelector('#notes').value
    ipcRenderer.send('item:updatedb', idField, dateField, descField, durationField, difficultyField, notesField)
}