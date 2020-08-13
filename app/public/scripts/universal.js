'use strict';

//------------- FUNCTIONS USED ACROSS MULTIPLE PAGES -------------//
/**
* fetchFileAsText(url) - Fetches a file stored in the server & returns it as text.
* @param {text} url The url passed to locate the desired file in the server
* @return {text}
*/
async function fetchFileAsText(url) {
  const response = await fetch(url);
  return await response.text();
};

/**
* loadPageHeader() - Gets the applications page header & adds the necessary event listeners.
*/
async function loadPageHeader() {
  await getPageHeader();
  document.getElementById('openMenuNavigation').addEventListener("click", openMenu);
  document.getElementById('closeMenuNavigation').addEventListener("click", closeMenu);
  console.log("HUB: Page header loaded");
};

/**
* getPageHeader() - Fetches the application page header & adds it to the DOM.
*/
async function getPageHeader() {
  const pageHeader = document.getElementById("pageHeader");
  pageHeader.innerHTML = await fetchFileAsText("pageHeader.html");
  console.log("HUB: Page header recieved");
};

/**
* openMenu() - Styles the navigation menu to be visible.
*/
function openMenu() {
  document.getElementById("menuNavigation").style.left = "0px";
};

/**
* closeMenu() - Styles the navigation menu to be hidden.
*/
function closeMenu() {
  document.getElementById("menuNavigation").style.left = "-500px";
};

/**
* getFile(file) - Fetches the submitted file from the server & displays it in the #fileEditor element.
* @param {text} file The submitted file to be retrived from the server
*/
async function getFile(file) {
  const fileContainer = document.getElementById("fileEditor");
  const fileAsText = await fetchFileAsText('/displays/' + file);
  fileContainer.innerText = fileAsText;
  console.log("HUB: " + file + " has been recieved");
};

/**
* reloadPage() - Reloads the page from which the function was called from.
*/
function reloadPage() {
  location.reload(true);
};

/**
* deleteFile() - Deletes the selected file after user confirmation and then refreshes the page.
*/
async function deleteFile() {
  const fileToDelete = this.id;
  const filePath = fileToDelete.substr(3);
  const fileName = filePath.split("/");
  let type;

  if (filePath.substr(0, 3) === '/pa') {
    type = 'pages';
  } else if (filePath.substr(0, 3) === '/st') {
    type = 'styles';
  } else if (filePath.substr(0, 3) === '/sc') {
    type = 'scripts';
  } else if (filePath.substr(0, 3) === '/me') {
    type = 'medias';
  }

  if (window.confirm("Are you sure you want to delete the file " + filePath + " ? " + "This deletion could cause knock on effects to other files & live displays.")) {

    await fetch('/api/' + type + '/' + fileName[2], {
      method: 'DELETE',
      headers: { 'Content-Type' : 'application/json' }
    });
    // The page will be reloaded
    reloadPage();
  }
};
