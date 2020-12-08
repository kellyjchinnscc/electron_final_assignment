const electron = require('electron');
const {ipcRenderer} = electron;
let sqlite3 = require('sqlite3');
let knex = require('knex') ({
  client: "sqlite3",
  connection: { filename: "./exercises.db" },
  useNullAsDefault: true
})
const displayTableBody = document.querySelector('tbody');

function editStuff(e) {
  let idToUpdate = e.target.value;
  ipcRenderer.send('item:update', idToUpdate)
}

function deleteItem(e) {
    e.preventDefault();
    let idToDelete = e.target[0].value
    ipcRenderer.send('item:delete', idToDelete)
}

function populatePage(item) {
  const rowOfData = document.createElement('tr'); // represents an entire row of the database
    const dateCell = document.createElement('td');
    const dateText = document.createTextNode(item.Date);
    dateCell.appendChild(dateText);
    rowOfData.appendChild(dateCell);

    const descCell = document.createElement('td');
    const descText = document.createTextNode(item.Description);
    descCell.appendChild(descText);
    rowOfData.appendChild(descCell)

    const durationCell = document.createElement('td');
    const durationText = document.createTextNode(item.Duration);
    durationCell.appendChild(durationText);
    rowOfData.appendChild(durationCell);

    const difficultyCell = document.createElement('td');
    const difficultyText = document.createTextNode(item.Difficulty);
    difficultyCell.appendChild(difficultyText);
    rowOfData.appendChild(difficultyCell);

    const notesCell = document.createElement('td');
    const notesText = document.createTextNode(item.Notes);
    notesCell.appendChild(notesText);
    rowOfData.appendChild(notesCell);

    const editButtonCell = document.createElement('td');
    const editButton = document.createElement('button')
    editButton.setAttribute('value', item.id)
    const editButtonText = document.createTextNode('Edit');
    editButton.appendChild(editButtonText)
    editButtonCell.appendChild(editButton);
    editButton.addEventListener('click', editStuff)

    const deleteButtonCell = document.createElement('td');
    
    const deleteForm = document.createElement('form')
    const hiddenInputId = document.createElement('input')
    const deleteButton = document.createElement('button')
    const deleteButtonText = document.createTextNode('Delete');
    hiddenInputId.setAttribute('value', item.id)
    hiddenInputId.setAttribute('type', 'hidden')
    hiddenInputId.setAttribute('id', item.id)
    deleteForm.appendChild(hiddenInputId)
    deleteForm.appendChild(deleteButton)
    deleteButton.appendChild(deleteButtonText)
    deleteButtonCell.appendChild(deleteForm);
    deleteForm.addEventListener('submit', deleteItem)

    rowOfData.appendChild(editButtonCell)
    rowOfData.appendChild(deleteButtonCell)

    displayTableBody.appendChild(rowOfData)
}

// initial loading in of data from database
let result = knex.select("id", "Date","Description","Duration","Difficulty","Notes").from('exercise')
  result.then(function(items){
    items.forEach(item => {
        populatePage(item)
    })
  })

    ipcRenderer.on('item:clear', function() {// clearing out the current table so that it doesn't get added on
        displayTableBody.innerHTML = '';
    });

    ipcRenderer.on('item:add', function(e, items){
        items.forEach(item => {
            populatePage(item)
        })
    })