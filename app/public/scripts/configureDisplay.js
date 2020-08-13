'use strict';

//------------- FUNCTIONS USED ON configureDisplay.html -------------//

//------------- GLOBAL VARIABLES -------------//
let selectedDisplayIP;
let originalDisplayName;
let originalDisplayFile;
let originalFileContent;
let originalDisplayTimer;

//------------- FUNCTIONS -------------//
/**
* loadScripts() - Calls the according functions to load the page.
*/
async function loadScripts() {
  loadPageHeader();
  await loadDisplays();
  addInteraction();
};

/**
* loadDisplays() - Creates the visual assets for the displays on the P.U.D network.
*/
async function loadDisplays() {
  const url = '/api/displays';
  const response = await fetch(url);
  const displayData = await response.json();

  const page = document.getElementById("displays");

  if (displayData.length > 0) {
    let displayNum = 0;
    // Creates the visual assets, the array is just a list of display info
    // every 5 indexes is a single displays info
    for (let i = 0; i < displayData.length; i+=5) {
      displayNum += 1;

      const displayBox = document.createElement("div");
      displayBox.id = displayNum;
      displayBox.classList.add("display-box");

      const internalContainer = document.createElement("div");
      internalContainer.classList.add("box-internal-container");

      const iconContainer = document.createElement("div");
      iconContainer.classList.add("icon-container");

      const icon = document.createElement("img");
      icon.setAttribute('src', 'images/icons/existing-icon.png');
      icon.classList.add("display-icon");

      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("button-container");
      buttonContainer.setAttribute("data-ip", displayData[i]);
      buttonContainer.setAttribute("data-name", displayData[i+1]);
      buttonContainer.setAttribute("data-file", displayData[i+2]);
      buttonContainer.setAttribute("data-timer", displayData[i+3]);
      buttonContainer.setAttribute("data-modified", displayData[i+4]);

      const editButton = document.createElement("button");
      editButton.classList.add("button", "button-edit");
      editButton.name = "edit";
      editButton.textContent = "Edit";

      const removeButton = document.createElement("button");
      removeButton.classList.add("button", "button-remove");
      removeButton.name = "remove";
      removeButton.textContent = "Remove";

      const infoContainer = document.createElement("div");
      infoContainer.classList.add("info-container");

      const infoIP = document.createElement("p");
      infoIP.textContent = displayData[i];

      const infoName = document.createElement("p");
      infoName.textContent = displayData[i+1];

      const infoFile = document.createElement("p");
      const file = displayData[i+2];
      const fileName = file.split("/");
      infoFile.textContent = fileName[2];

      iconContainer.appendChild(icon);
      buttonContainer.appendChild(editButton);
      buttonContainer.appendChild(removeButton);
      infoContainer.appendChild(infoName)
      infoContainer.appendChild(infoIP);
      infoContainer.appendChild(infoFile);
      internalContainer.appendChild(iconContainer);
      internalContainer.appendChild(buttonContainer);
      internalContainer.appendChild(infoContainer);
      displayBox.appendChild(internalContainer);

      page.appendChild(displayBox);
    };
    console.log("HUB: Displays in the P.U.D database have been loaded");
  } else {
    const msg = document.createElement("p");
    msg.textContent = "No displays currently connected";
    msg.classList.add("display-center", "general-title");

    page.appendChild(msg);
    console.log("HUB: No displays in the P.U.D database");
  }
};

/**
* addInteraction() - Adds addEventListeners to the pages buttons.
*/
function addInteraction() {
  const editButtons = document.getElementsByName("edit");
  const removeButtons = document.getElementsByName("remove");

  for (let i = 0; i < editButtons.length; i++) {
    editButtons[i].addEventListener('click', editDisplay);
    removeButtons[i].addEventListener('click', removeDisplay);
  };

  document.getElementById("save").addEventListener("click", saveEditing);
  document.getElementById("cancel").addEventListener("click", closeEditingWindow);
  console.log("HUB: EventListeners have been loaded");
};

/**
* editDisplay() - Hides the #displays window & unhides the #editDisplay window while loading details to be edited.
*/
async function editDisplay() {
  // Sets the selected displays details to their global variables
  const parentElement = this.parentElement;
  selectedDisplayIP = parentElement.getAttribute("data-ip");
  originalDisplayName = parentElement.getAttribute("data-name");
  originalDisplayFile = parentElement.getAttribute("data-file");
  originalDisplayTimer = parentElement.getAttribute("data-timer");
  const file = originalDisplayFile.split("/");

  await getFile(originalDisplayFile); // Calls getFile() to load the selected displays file for editing

  document.getElementById("pageTitle").childNodes[1].textContent = "Editing Display: " + selectedDisplayIP;
  document.getElementById("displayName").value = originalDisplayName;
  document.getElementById("displayTimer").value = originalDisplayTimer;
  document.getElementById("filePath").textContent = file[2];
  document.getElementById("filePath").setAttribute("data-file", originalDisplayFile);
  // sets loaded file to editable
  document.getElementById("fileEditor").contentEditable = "true";
  document.getElementById("displays").style.display = "none";
  document.getElementById("editDisplay").style.display = "block";
  originalFileContent = document.getElementById("fileEditor").innerText;
  await generateFileDropDown();
  console.log("HUB: Opening editing tool for display " + originalDisplayName + "(" + selectedDisplayIP + ") serving " + file[2]);
};

/**
* removeDisplay() - Submits the display IP to be removed from the P.U.D network.
*/
async function removeDisplay() {
  // Gets the IP to be submitted for removal
  const parentElement = this.parentElement;
  const ipAddress = parentElement.getAttribute("data-ip");
  const name = parentElement.getAttribute("data-name");

  // Asks for confirmation of current action
  if (window.confirm("Are you sure you want to remove " + ipAddress + ", '" + name +  "', from the P.U.D network?")) {
    await fetch('/api/displays/' + ipAddress, { method: 'DELETE' });
    // The page will be reloaded to update the visual details
    reloadPage();
  };
};

/**
* generateFileDropDown() - Creates the drop down menu used to chose a file to be shown on the currently selected display.
*/
async function generateFileDropDown() {
  // Gets an array of all files from the server
  const url = '/api/pages';
  const response = await fetch(url);
  const fileList = await response.json();
  // Gets the menu element
  const menu = document.getElementById("dropDownMenu");
  deleteChildren(menu);
  // Creates drop down items & appends them to the menu
  for (let i = 0; i < fileList.length; i++) {
    const aElem = document.createElement("a");
    const file = fileList[i].split("/")
    aElem.textContent = file[2];
    aElem.id = fileList[i];

    menu.appendChild(aElem);
    document.getElementById(fileList[i]).addEventListener("click", changeFile);
  };
  document.getElementById("dropDownBtn").addEventListener("click", dropMenu);
};

/**
* changeFile() - Changes the file currently being displayed in the #filePath element.
*/
async function changeFile() {
  const fileClicked = this.id;
  const file = fileClicked.split("/");
  // Calls the getFile() function for the file selected here by the user
  await getFile(fileClicked);
  document.getElementById("filePath").textContent = file[2];
  document.getElementById("filePath").setAttribute("data-file", fileClicked);
};

/**
* saveEditing() - Saves the editing changes the user has made to the selected display.
*/
async function saveEditing() {
  // Gets the currently selected file from #filePath & that files contents from #fileEditor
  const userSelectedFile = document.getElementById("filePath").getAttribute("data-file");
  const selectedFileContent = document.getElementById("fileEditor").innerText;
  const selectedDisplayName = document.getElementById("displayName").value;
  const selectedDisplayTimer = document.getElementById("displayTimer").value;
  const storedContent = await fetchFileAsText('/displays' + userSelectedFile);

  // Asks for confirmation of current action
  if (window.confirm("Are you sure you want to save the changes made to " + selectedDisplayIP + " & any changes made to  " + userSelectedFile + " ?\nThese changes will take effect when the display next refreshes.")) {

    if (userSelectedFile !== originalDisplayFile || selectedDisplayName !== originalDisplayName || selectedDisplayTimer !== originalDisplayTimer) {
      await fetch('/api/displays/' + selectedDisplayIP, {
        method: 'PUT',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({
          display: {
            name: selectedDisplayName,
            file: userSelectedFile,
            timer: selectedDisplayTimer
          }
        })
      });
    }

    // If the selected files contents does not match what is currently stored for it then update it
    if (storedContent !== selectedFileContent) {
      const fileName = userSelectedFile.split('/');

      await fetch('/api/pages/' + fileName[2], {
        method: 'PUT',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({
          file: {
            content: selectedFileContent
          }
        })
      })
    }
    // The page will be reloaded to update the visual details
    reloadPage();
  }
};

/**
* closeEditingWindow() - Hides the editDisplay window and unhides the displays window.
*/
function closeEditingWindow() {
  document.getElementById("editDisplay").style.display = "none";
  document.getElementById("pageTitle").childNodes[1].textContent = "Displays";
  document.getElementById("displays").style.display = "block";
};

/**
* dropmenu() - Toggles the class 'show' when called.
*/
function dropMenu() {
  document.getElementById("dropDownMenu").classList.toggle("show");
};

/**
* deleteChildren(parent) - Delete children elements from parent element.
* @param {element} parent The element to delete the children from
* @return {element}
*/
function deleteChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.lastChild);
  }
  return parent;
};

/**
* Closes the dropdown menu if the user clicks outside of it.
*/
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    const dropdowns = document.getElementsByClassName("dropdown-content");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

window.addEventListener("load", loadScripts);
