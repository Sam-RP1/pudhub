'use strict';

//------------- FUNCTIONS used on info-display-vertical.html -------------//
window.addEventListener("load", loadExtraScripts);

const clock = setInterval(getLocalTime, 60000)

//------------- FUNCTIONS -------------//
/**
* loadExtraScripts() - Calls the further functions to load the display.
*/
async function loadExtraScripts() {
  getLocalTime();
};
