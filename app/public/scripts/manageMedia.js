'use strict';

//------------- FUNCTIONS USED ON manageFiles.html -------------//

//------------- FUNCTIONS -------------//
/**
* loadScripts() - Calls the according functions to load the page.
*/
function loadScripts() {
  loadPageHeader();
  addEventListeners();
  getMedias();
};

/**
* getMedias() - Fetches the page files and submits them to generateFileList.
*/
async function getMedias() {
  const url = '/api/medias';
  const response = await fetch(url);
  const mediaFiles = await response.json();
  console.log("HUB: Media files have been recieved");
  generateMediaList("mediasList", "delMediasList", mediaFiles);
};

/**
* generateMediaList() - Takes the parameters needed to generate the lists of files.
* @param {text} ID The ID used to place the list inside the element
* @param {text} deleteID The ID used to place the list inside the element
* @param {array} files The files passed in an array structure to be placed in the lists
*/
async function generateMediaList(ID, deleteID, files) {
  const list = document.getElementById(ID);
  const deleteList = document.getElementById(deleteID);

  for (let i = 0; i < files.length; i++) {
    const elem = document.createElement("li");
    const delElem = document.createElement("li");
    const fileName = files[i].split("/");
    elem.textContent = fileName[2];
    elem.id = files[i];
    delElem.textContent = fileName[2];
    delElem.id = "del" + files[i];

    list.appendChild(elem);
    deleteList.appendChild(delElem);
    document.getElementById(elem.id).addEventListener("click", openPreview);
    document.getElementById(delElem.id).addEventListener("click", deleteFile);
  }
};

/**
* addInteraction() - Adds addEventListeners to the pages elements.
*/
function addEventListeners() {
  document.getElementById("uploadNewFile").addEventListener("click", openDialog);
  document.getElementById("dialogClose").addEventListener("click", closeDialog);
  document.getElementById("delete").addEventListener("click", openDeleteMedia);
  document.getElementById("fileViewerClose").addEventListener("click", closePreview);
  console.log("HUB: EventListeners have been loaded");
};

/**
* openDialog() - Handles the opening of the pages dialog box.
*/
function openDialog() {
  document.getElementById("uploadFileDialog").style.display = "flex";
};

/**
* closeDialog() - Handles the closing of the pages dialog box.
*/
function closeDialog() {
  document.getElementById("uploadFileDialog").style.display = "none";
};

/**
* openDeleteMedia() - Hides the normal display elements and unhides the elements for deleting.
* Also styles elements to allow for easier understanding by the user.
*/
function openDeleteMedia() {
  // Hide the normal lists
  document.getElementById("mediasList").style.display = "none";
  // Display the delete lists
  document.getElementById("delMediasList").style.display = "block";
  // Edit text
  document.getElementById("instructionText").childNodes[1].textContent = "Select a file to delete.";
  // Get delete button and change the event listener
  document.getElementById("delete").textContent = "Cancel";
  document.getElementById("delete").removeEventListener("click", openDeleteMedia)
  document.getElementById("delete").addEventListener("click", closeDeleteMedia)
  // Change background to show status change
  document.getElementById("pageContent").style.backgroundColor = "#ababab";
  document.getElementById("pageTitle").style.opacity = "0.4";
  document.getElementById("uploadNewFile").style.opacity = "0.4";
}

/**
* closeDeleteMedia() - Hides the elements for deleting and unhides the normal elements.
* Also styles elements to allow for easier understanding by the user.
*/
function closeDeleteMedia() {
  // Hide the delete lists
  document.getElementById("delMediasList").style.display = "none";
  // Display the edit lists
  document.getElementById("mediasList").style.display = "block";
  // Edit text
  document.getElementById("instructionText").childNodes[1].textContent = "To get started select an option from the buttons above.";
  // Get delete button and change the event listener
  document.getElementById("delete").textContent = "Delete Media";
  document.getElementById("delete").removeEventListener("click", closeDeleteMedia)
  document.getElementById("delete").addEventListener("click", openDeleteMedia)
  // Change background to show status change
  document.getElementById("pageContent").style.backgroundColor = "transparent";
  document.getElementById("pageTitle").style.opacity = "1";
  document.getElementById("uploadNewFile").style.opacity = "1";
}

/**
* openPreview() - Gets the medias file path from the clicked elements id. Check for file type.
* Then displays the correct preview window.
*/
function openPreview() {
  const file = this.id;
  let previewWindow;

  if (file.substr(-4) === ".mp4" || file.substr(-5) === ".webm" || file.substr(-4) === ".ogg") {
    previewWindow = document.getElementById("previewVideo");
    previewWindow.src = "../displays" + file;

  } else if (file.substr(-4) === ".jpg" || file.substr(-4) === ".png" || file.substr(-4) === ".gif" || file.substr(-4) === ".svg" || file.substr(-5) === ".jpeg") {
    previewWindow = document.getElementById("previewImage");
    previewWindow.src = "../displays" + file;
  } else {
    previewWindow = document.getElementById("previewError");
  }

  previewWindow.style.display = "block";
  document.getElementById("fileViewer").style.display = "flex";
  console.log("HUB: Preview loaded for " + file);
}

/**
* closePreview() - Hides the fileViewer dialog. hides the preview windows. Clears the preview windows.
*/
function closePreview() {
  const previewImage = document.getElementById("previewImage");
  const previewVideo = document.getElementById("previewVideo");
  const previewError = document.getElementById("previewError");

  document.getElementById("fileViewer").style.display = "none";

  previewImage.style.display = "none";
  previewVideo.style.display = "none";
  previewError.style.display = "none";
  previewImage.src = "";
  previewVideo.src = "";
  console.log("HUB: Preview closed");
}

window.addEventListener('load', loadScripts);
