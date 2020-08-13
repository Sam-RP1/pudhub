'use strict';

//------------- FUNCTIONS USED ON manageFiles.html -------------//

//------------- GLOBAL VARIABLES -------------//
let selectedFileName;
let selectedFile;

//------------- FUNCTIONS -------------//
/**
* loadScripts() - Calls the according functions to load the page.
*/
function loadScripts() {
  loadPageHeader();
  getPages();
  getStyles();
  getScripts();
  addEventListeners();
};

/**
* getPages() - Fetches the page files and submits them to generateFileList.
*/
async function getPages() {
  const url = '/api/pages';
  const response = await fetch(url);
  const pageFiles = await response.json();

  console.log("HUB: Page files have been recieved");
  generateFileList("pagesList", "delPagesList", pageFiles);
};

/**
* getStyles() - Fetches the style files and submits them to generateFileList.
*/
async function getStyles() {
  const url = '/api/styles';
  const response = await fetch(url);
  const styleFiles = await response.json();

  console.log("HUB: Style files have been recieved");
  generateFileList("stylesList", "delStylesList", styleFiles);
};

/**
* getScripts() - Fetches the script files and submits them to generateFileList.
*/
async function getScripts() {
  const url = '/api/scripts';
  const response = await fetch(url);
  const scriptFiles = await response.json();

  console.log("HUB: Script files have been recieved");
  generateFileList("scriptsList", "delScriptsList", scriptFiles);
};

/**
* generateFileList() - Takes the parameters needed to generate the lists of files.
* @param {text} editID The ID used to place the list inside the element
* @param {text} deleteID The ID used to place the list inside the element
* @param {array} files The files passed in an array structure to be placed in the lists
*/
async function generateFileList(editID, deleteID, files) {
  const editList = document.getElementById(editID);
  const deleteList = document.getElementById(deleteID);

  for (let i = 0; i < files.length; i++) {
    const editElem = document.createElement("li");
    const delElem = document.createElement("li");
    const fileName = files[i].split("/");
    editElem.textContent = fileName[2];
    editElem.id = files[i];
    delElem.textContent = fileName[2];
    delElem.id = "del" + files[i];

    editList.appendChild(editElem);
    deleteList.appendChild(delElem);
    document.getElementById(editElem.id).addEventListener("click", editFile);
    document.getElementById(delElem.id).addEventListener("click", deleteFile);
  }
};

/**
* addInteraction() - Adds addEventListeners to the pages elements.
*/
function addEventListeners() {
  document.getElementById("createNewFile").addEventListener("click", openDialog);
  document.getElementById("dialogClose").addEventListener("click", closeDialog);
  document.getElementById("save").addEventListener("click", saveEditing);
  document.getElementById("delete").addEventListener("click", openDeleteLists);
  document.getElementById("cancelBtn").addEventListener("click", closeEditingWindow);
  document.getElementById("createFileButton").addEventListener("click", setAction);

  console.log("HUB: EventListeners have been loaded");
};

/**
* openDialog() - Handles the opening of the pages dialog box.
*/
function openDialog() {
  document.getElementById("createFileDialog").style.display = "flex";
};

/**
* closeDialog() - Handles the closing of the pages dialog box.
*/
function closeDialog() {
  document.getElementById("createFileDialog").style.display = "none";
};

/**
* openDeleteLists() - Hides the elements for editing and unhides the elements for deleting.
* Also styles elements to allow for easier understanding by the user.
*/
function openDeleteLists() {
  // Hide the edit lists
  document.getElementById("pagesList").style.display = "none";
  document.getElementById("stylesList").style.display = "none";
  document.getElementById("scriptsList").style.display = "none";
  // Display the delete lists
  document.getElementById("delPagesList").style.display = "block";
  document.getElementById("delStylesList").style.display = "block";
  document.getElementById("delScriptsList").style.display = "block";
  // Edit text
  document.getElementById("instructionText").childNodes[1].textContent = "Select a file to delete.";
  // Get delete button and change the event listener
  document.getElementById("delete").textContent = "Cancel";
  document.getElementById("delete").removeEventListener("click", openDeleteLists)
  document.getElementById("delete").addEventListener("click", openEditLists)
  // Change background to show status change
  document.getElementById("pageContent").style.backgroundColor = "#ababab";
  document.getElementById("pageTitle").style.opacity = "0.4";
  document.getElementById("createNewFile").style.opacity = "0.4";

  console.log("HUB: Deletion tool active");
};

/**
* openEditLists() - Hides the elements for deleting and unhides the elements for editing.
* Also styles elements to allow for easier understanding by the user.
*/
function openEditLists() {
  // Hide the delete lists
  document.getElementById("delPagesList").style.display = "none";
  document.getElementById("delStylesList").style.display = "none";
  document.getElementById("delScriptsList").style.display = "none";
  // Display the edit lists
  document.getElementById("pagesList").style.display = "block";
  document.getElementById("stylesList").style.display = "block";
  document.getElementById("scriptsList").style.display = "block";
  // Edit text
  document.getElementById("instructionText").childNodes[1].textContent = "To get started select a file from the menus below, from there you can then edit the file.";
  // Get delete button and change the event listener
  document.getElementById("delete").textContent = "Delete a file";
  document.getElementById("delete").removeEventListener("click", openEditLists)
  document.getElementById("delete").addEventListener("click", openDeleteLists)
  // Change background to show status change
  document.getElementById("pageContent").style.backgroundColor = "transparent";
  document.getElementById("pageTitle").style.opacity = "1";
  document.getElementById("createNewFile").style.opacity = "1";

  console.log("HUB: Deletion tool deactivated");
};

/**
* editFile() - Hides the #displays window & unhides the #editDisplay window while loading details to be edited.
*/
async function editFile() {
  selectedFile = this.id;
  const fileName = selectedFile.split("/");
  selectedFileName = fileName[2];

  // Calls getFile() to load the selected file for editing
  await getFile(selectedFile);

  document.getElementById("pageTitle").childNodes[1].textContent = "Editing File: " + selectedFileName;
  // sets loaded file to editable
  document.getElementById("fileEditor").contentEditable = "true";
  document.getElementById("fileBrowser").style.display = "none";
  document.getElementById("fileEditing").style.display = "block";

  console.log("HUB: Opening editing tool for " + fileName[2]);
};

/**
* saveEditing() - Saves the editing changes the user has made to the selected file.
*/
async function saveEditing() {
  // Gets the files contents from #fileEditor
  const selectedFileContent = document.getElementById("fileEditor").innerText;
  let type;

  if (selectedFile.substr(0, 3) === '/pa') {
    type = 'pages';
  } else if (selectedFile.substr(0, 3) === '/st') {
    type = 'styles';
  } else if (selectedFile.substr(0, 3) === '/sc') {
    type = 'scripts';
  }

  // Asks for confirmation of current action
  if (window.confirm("Are you sure you want to save the changes made to " + selectedFile + " ? " + "These changes could cause knock on effects to other pages and files being used on live displays.")) {

    // The selectedFileContent will be saved to the selectedFile
    await fetch('/api/' + type + '/' + selectedFileName, {
      method: 'PUT',
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify({
        file: {
          content: selectedFileContent
        }
      })
    });
    // The page will be reloaded
    reloadPage();
  }
};

/**
* closeEditingWindow() - Hides the fileEditing window and unhides the fileBrowser window.
*/
function closeEditingWindow() {
  document.getElementById("fileEditing").style.display = "none";
  document.getElementById("pageTitle").childNodes[1].textContent = "Files";
  document.getElementById("fileBrowser").style.display = "block";

  console.log("HUB: Closing editing tool");
};

/**
* setAction() - Dynamically set the form action when the user submits the form, based on the inputs selected.
*/
function setAction() {
  const type = document.getElementById("fileTypes").value;
  console.log(type);
  console.log(document.getElementById("createFileForm").action = "/api/" + type)
  document.getElementById("createFileForm").action = "/api/" + type;
}

window.addEventListener('load', loadScripts);
