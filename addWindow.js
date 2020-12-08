  // Imports
  const electron = require('electron')
  const {ipcRenderer} = electron

  // Event Listener Configurations
  const form = document.querySelector('form').addEventListener('submit', submitForm);
  // const redRadio = document.querySelector('#red').addEventListener('click', generateTypePicker);
  // const whiteRadio = document.querySelector('#white').addEventListener('click', generateTypePicker);
  // const dessertRadio = document.querySelector('#dessert').addEventListener('click', generateTypePicker);


  // FUNCTION DECLARATIONS AND IMPLEMENTATIONS

  // The submitForm button takes all of the data that the user has inputted and sends it to main.js to render to the mainWindow
  function submitForm(e) {
    e.preventDefault();
    const entryDate = document.querySelector('#date').value;
    const entryDesc = document.querySelector("#description").value;
    const entryDuration = document.querySelector('#duration').value;
    const entryDifficulty = document.querySelector('#difficulty').value;
    const entryNotes = document.querySelector('#notes').value;
   
    ipcRenderer.send('item:add', entryDate, entryDesc, entryDuration, entryDifficulty, entryNotes);//send to main.js
  }

  // The generateTypePicker takes the category chosen (red, white or dessert wine) and then displays an array as a select drop-down menu to the user to select the wine type.
  // function generateTypePicker(e) {
  //   const redTypesArray = ["Cabernet", "Cabernet Sauvignon", "Chardonnay", "Malbec", "Merlot", "Sirah / Shiraz", "Pinot Noir", "Port", "Other Red Varieties", "Red Blends"];
  //   const whiteTypesArray = ["Riesling", "Sauvignon Blanc", "Verdelho", "Semillon", "Chardonnay", "Pinot Gris / Pinot Grigio", "Other White Varieteis", "White Blends"]
  //   const dessertTypesArray = ["Eiswen (Ice Wine)", "Sauternes", "Other Dessert Varieties", "Dessert Blends"]

  //   const redRadioValue = document.getElementById('red')
  //   const whiteRadioValue = document.getElementById('white')
  //   const dessertRadioValue = document.getElementById('dessert')
  //   const typeArea = document.querySelector('#winetypearea')
  //   if(redRadioValue.checked){
  //     typeArea.innerHTML = " "
  //     const typePickerMenu = document.createElement('select')
  //     typePickerMenu.setAttribute("required", " ")
  //     typeArea.appendChild(typePickerMenu)
  //     for(let i = 0; i < redTypesArray.length; i++) {
  //       const redOption = document.createElement('option');
  //       redOption.setAttribute("value", redTypesArray[i]);
  //       redOption.innerHTML = redTypesArray[i]
  //       typePickerMenu.appendChild(redOption);
  //     }
  //   }else if (whiteRadioValue.checked){
  //     typeArea.innerHTML = " "
  //     const typePickerMenu = document.createElement('select')
  //     typePickerMenu.setAttribute("required", " ")
  //     typeArea.appendChild(typePickerMenu)
  //     for(let i = 0; i < whiteTypesArray.length; i++) {
  //       const whiteOption = document.createElement('option');
  //       whiteOption.setAttribute("value", whiteTypesArray[i]);
  //       whiteOption.innerHTML = whiteTypesArray[i]
  //       typePickerMenu.appendChild(whiteOption);
  //     }
  //   }else if (dessertRadioValue.checked){
  //     typeArea.innerHTML = " "
  //     const typePickerMenu = document.createElement('select')
  //     typePickerMenu.setAttribute("required", " ")
  //     typeArea.appendChild(typePickerMenu)
  //     for(let i = 0; i < dessertTypesArray.length; i++) {
  //       const dessertOption = document.createElement('option');
  //       dessertOption.setAttribute("value", dessertTypesArray[i]);
  //       dessertOption.innerHTML = dessertTypesArray[i]
  //       typePickerMenu.appendChild(dessertOption);
  //     }
  //   }
    
    
  // } // end of generateTypePicker function