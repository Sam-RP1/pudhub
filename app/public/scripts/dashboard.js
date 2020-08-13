'use strict';

//------------- FUNCTIONS USED ON index.html -------------//

//------------- GLOBAL VARIABLES -------------//
// Updates the dashboardClock once every 1000ms resulting in a digital clock
let dashboardClock = setInterval(getLocalTime, 1000);
let refreshDashboard = setInterval(dashboardInfo, 300000);

//------------- FUNCTIONS -------------//
/**
* loadScripts() - Calls the according functions to load the page.
*/
function loadScripts() {
  loadPageHeader();
  getLocalTime();
  dashboardInfo();
};

/**
* getLocalTime() - Instances a 'new Date()' & sets the text content of the element with the id '#localTime' to it.
*/
function getLocalTime() {
  const localTime = new Date().toLocaleTimeString('en-GB');
  const timeAsText = document.getElementById("localTime");
  timeAsText.textContent = localTime;
};

/**
* dashboardInfo() - Calls the according functions to get the number of x's on the P.U.D network.
*/
async function dashboardInfo() {
  const numDisplays = await numOfDisplays();
  const numPages = await numOfPages();
  const numStyles = await numOfStyles();
  const numScripts = await numOfScripts();

  document.getElementById("numDisplays").textContent = numDisplays;
  document.getElementById("numPages").textContent = numPages;
  document.getElementById("numStyles").textContent = numStyles;
  document.getElementById("numScripts").textContent = numScripts;
  console.log("HUB: Dashboard information loaded");
};

/**
* numOfDisplays() - Fetches the submitted url from the server which returns an array used to find the length.
* @return {integer}
*/
async function numOfDisplays() {
  const url = '/api/displays';
  const response = await fetch(url);
  const displays = await response.json();

  const numDisplays = displays.length / 5;
  console.log("HUB: Displays Connected " + numDisplays);
  return numDisplays;
};

/**
* numOfPages() - Fetches the submitted url from the server which returns an array used to find the length.
* @return {integer}
*/
async function numOfPages() {
  const url = '/api/pages';
  const response = await fetch(url);
  const pageData = await response.json();

  const numPages = pageData.length;
  console.log("HUB: Pages stored " + numPages);
  return numPages;
};

/**
* numOfStyles() - Fetches the submitted url from the server which returns an array used to find the length.
* @return {integer}
*/
async function numOfStyles() {
  const url = '/api/styles';
  const response = await fetch(url);
  const styleFiles = await response.json();

  const numStyles = styleFiles.length;
  console.log("HUB: Styles stored " + numStyles);
  return numStyles;
};

/**
* numOfScripts() - Fetches the submitted url from the server which returns an array used to find the length.
* @return {integer}
*/
async function numOfScripts() {
  const url = '/api/scripts';
  const response = await fetch(url);
  const scriptFiles = await response.json();

  const numScripts = scriptFiles.length;
  console.log("HUB: Scripts stored " + numScripts);
  return numScripts;
};

window.addEventListener('load', loadScripts);
