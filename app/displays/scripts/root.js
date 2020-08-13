'use strict';

//------------- FUNCTIONS used on all Unattended Displays -------------//
window.addEventListener("load", loadScripts);

//------------- GLOBAL VARIABLES -------------//
let displayName;
let displayFile;
let displayTimer;
let displayRefresh;
let displayModified;
let displayContents;

//------------- FUNCTIONS -------------//
/**
* loadScripts() - Calls the according functions to load and maintain the display.
*/
async function loadScripts() {
  await getDisplayData();
};

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
* getLocalTime() - instances a 'new Date()' & sets the text content of the element with the id '#localTime' to it.
*/
function getLocalTime() {
  const today = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const day = days[today.getDay()];
  const month = today.getMonth();
  const year = today.getFullYear();

  const time = today.getHours() + ':' + today.getMinutes();

  const element = document.getElementById("header-text");

  element.textContent = time + ' | ' + day + ' | ' + today.getDate() + '/' + month + '/' + year;
};

/**
* reloadDisplay() - Reloads the display from which the function was called from.
*/
function reloadDisplay() {
  location.reload(true);
};

/**
* getDisplayData() - On displays initialisation it GETS its data from the server.
* The data is used to set variables, properties and the refresh timer.
*/
async function getDisplayData() {
  const url = '/api/displays/data';
  const response = await fetch(url);
  const details = await response.json();

  displayContents = await fetchFileAsText('/displays/' + details.file);
  displayName = details.name;
  displayFile = details.file;
  displayTimer = (details.timer * 60) * 1000;
  displayModified = details.modified;

  document.title = displayName;
  displayRefresh = setInterval(serverCheckIn, displayTimer);

  console.log("HUB: Initial check in complete");
  console.log("HUB: Display is named '" + displayName + "'");
  console.log("HUB: Display is serving " + displayFile);
  console.log("HUB: Display check in timer set to " + details.timer + " minutes");
};

/**
* serverCheckIn() - Called on a timer. Used to fetch the newest data for the display and decide whether to refresh itself based on
* the results when comparing values stored in local variables to the data recieved.
*/
async function serverCheckIn() {
  console.log("HUB: Checking in with the P.U.D network");

  try {
    const currentFile = displayFile.split("/");
    const url = '/api/displays/data'; // Fetch newest data for display
    let response = await fetch(url);
    const newDetails = await response.json();

    if (displayFile !== newDetails.file) { // If the currently served file does not match the newly set file then reload.
      reloadDisplay();
    }

    if (displayModified < newDetails.modified) {
      console.log("HUB: Current information is outdated");

      const file = '/api/pages/' + currentFile[2]; // Fetch newest data for currently displayed file
      response = await fetch(file);
      const fileDetails = await response.json();

      const newTimer = (newDetails.timer * 60) * 1000;
      const newestFile = await fetchFileAsText('/displays/pages/' + currentFile[2]); // Fetches newest version of current file

      if (fileDetails.modified == newDetails.modified) { // If the modified time is equal then the file is outdated
        reloadDisplay();
      } else if (displayContents !== newestFile) { // Longer execute time but covers all scenarios where bugs could be introduced
        reloadDisplay();
      } else {
        if (displayTimer !== newTimer) {
          displayTimer = newTimer;
          clearInterval(displayRefresh);
          displayRefresh = setInterval(serverCheckIn, displayTimer);
          console.log("HUB: Check in timer updated to " + displayTimer);
        }
        if (displayName !== newDetails.name) {
          displayName = newDetails.name;
          document.title = displayName;
          console.log("HUB: Display name updated to " + displayName);
        }
        displayModified = newDetails.modified;
      }
    }
    console.log("HUB: Check in completed");
  } catch (e) {
    console.log("HUB: ERROR");
    console.log("HUB: P.U.D Network did not repsond");
    console.log("HUB: Will attempt to check in again in " + ((displayTimer / 1000) / 60) + " minutes");
  }
};
