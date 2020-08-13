'use strict';

//------------- GLOBAL VARIABLES -------------//
const mysql = require('mysql2/promise');
const config = require('./config');

const sqlPromise = mysql.createConnection(config.mysql);

const EMPTY = { status: 'empty' };
const SAME = { status: 'same' };
const EXISTS = { status: 'exists' };

//------------- FUNCTIONS -------------//
// The functions in this file have been developed to serve specific purposes.
// This should mean that they are easily comprehensible and maintainable.
// Thus, if needed they could be efficiently altered or expanded in the future.

//------------- DISPLAY FUNCTIONS -------------//
/**
* addDisplay(displayIP) -
* Inserts a new record in the 'displays' table using the displayIP paramter.
* @param {string} displayIP The displays IP address
*/
module.exports.addDisplay = async (displayIP) => {
  const sql = await sqlPromise;

  // New display preset record model
  const dbRecord = {
    dspy_ip: displayIP,
    dspy_name: 'New Display',
    dspy_file: '/pages/default-display.html',
    dspy_timer: 1,
    dspy_modified: Math.floor(Date.now() / 1000)
  };

  try {
    await sql.query(sql.format('INSERT INTO displays SET ?', dbRecord));
    config.logInfoDB(displayIP + ' record created and inserted in to "displays" table.');
  } catch (e) {
    config.logErrorDB(e);
  }
};

/**
* getDisplayData(displayIP) -
* Queries the database to find a record that contains the displayIP submitted.
* @param {string} displayIP The displays ip address
* @return {JSON} The displays data in a JSON object
*/
module.exports.getDisplayData = async (displayIP) => {
  const sql = await sqlPromise;

  try {
    const [result] = await sql.query(sql.format('SELECT * FROM displays WHERE dspy_ip = ?', [displayIP]));

    if (result.length > 0) {
      return { name: result[0].dspy_name, file: result[0].dspy_file, timer: result[0].dspy_timer, modified: result[0].dspy_modified };
    } else {
      config.logInfoDB(displayIP + ' not found in "displays" table.');
      return { name: 'DISPLAY NOT FOUND', file: 'REFRESH', timer: 5, modified: 1500000000 };
    }
  } catch (e) {
    config.logErrorDB(e);
    return { name: 'ERROR LOADING', file: 'REFRESH', timer: 5, modified: 1500000000 };
  }
};

/**
* getAllDisplayData(req) -
* Retrieves all records from the 'displays' table and pushes them to an array.
* @return {array} The pages data in an array
*/
module.exports.getAllDisplayData = async (req) => {
  const sql = await sqlPromise;
  let dataArray = [];

  try {
    const [results] = await sql.query(sql.format('SELECT * FROM displays'));

    for (let i = 0; i < results.length; i++) {
      dataArray.push(results[i].dspy_ip);
      dataArray.push(results[i].dspy_name);
      dataArray.push(results[i].dspy_file);
      dataArray.push(results[i].dspy_timer);
      dataArray.push(results[i].dspy_modified);
    }

    return dataArray;
  }
  catch (e) {
    config.logErrorDB(e);
    dataArray.push('ERROR');
    return dataArray;
  }
};

/**
* deleteDisplay(displayIP) -
* Queries the database table 'displays' for a record that matches the displayIP.
* If a match is found it is deleted.
* @param {string} displayIP The displays IP address
*/
module.exports.deleteDisplay = async (displayIP) => {
  const sql = await sqlPromise;

  const [result] = await sql.query(sql.format('Select * FROM displays WHERE dspy_ip = ?', [displayIP]));
  if (result.length < 1) {
    config.logErrorDB(displayIP + ' could not be delete. ' + displayIP + ' was not found in "displays" table. Queried from function "deleteDisplay".');
    throw EMPTY;
  }

  await sql.query(sql.format('DELETE FROM displays WHERE dspy_ip = ?', [displayIP]));
  config.logInfoDB(displayIP + ' deleted from "displays" table.');
};

/**
* searchDisplay(displayIP) -
* Queries the database for a record that matches the submitted displayIP.
* If a match is found it is returned.
* @param {string} displayIP The displays IP address
* @return {JSON} The pages data in a JSON object
*/
module.exports.searchDisplay = async (displayIP) => {
  const sql = await sqlPromise;

  try {
    const [result] = await sql.query(sql.format('SELECT * FROM displays WHERE dspy_ip = ?', [displayIP]));

    if (result.length < 1) {
      return { ip: '', name: '', file: '', timer: '', modified: '' };
    } else {
      return { ip: result[0].dspy_ip, name: result[0].dspy_name, file: result[0].dspy_file, timer: result[0].dspy_timer, modified: result[0].dspy_modified };
    }
  }
  catch (e) {
    config.logErrorDB(e);
    return { ip: '', name: '', file: '', timer: '', modified: '' };
  }
};

/**
* updateDisplayData(displayIP, name, file, timer) -
* Queries the database to see if there is a record with the displayIP submitted.
* If a match is found then the record is updated using the parameters submitted.
* @param {string} displayIP The displays IP address
* @param {string} name The displays user given name
* @param {string} file The page for the display to serve
* @param {string} timer The displays timer to refresh
*/
module.exports.updateDisplayData = async (displayIP, name, file, timer) => {
  const sql = await sqlPromise;
  const modified = Math.floor(Date.now() / 1000);

  const [result] = await sql.query(sql.format('Select * FROM displays WHERE dspy_ip = ?', [displayIP]));

  if (result.length < 1) {
    config.logErrorDB(displayIP + ' properties could not be updated. ' + displayIP + ' was not found in "displays" table.');
    throw EMPTY;
  } else {
    await sql.query(sql.format('UPDATE displays SET dspy_name = ?, dspy_file = ?, dspy_timer = ?, dspy_modified = ? WHERE dspy_ip = ?', [name, file, timer, modified, displayIP]));
    config.logInfoDB(displayIP + ' properties updated.\n# Updated Details for ' + displayIP + '\n# Name: ' + name + '\n# File: ' + file + '\n# Timer: ' + timer + '\n# Last modified: ' + modified);
  }
};


//------------- PAGE FUNCTIONS -------------//
/**
* getAllPages(req) -
* Retrieves all records from the 'pages' table and pushes them to an array.
* @return {array} The pages data in an array
*/
module.exports.getAllPages = async (req) => {
  const sql = await sqlPromise;
  let pageArray = [];

  try {
    const [results] = await sql.query(sql.format('SELECT * FROM pages'));

    for (let i = 0; i < results.length; i++) {
      pageArray.push(results[i].pages_path);
    }

    return pageArray;
  }
  catch (e) {
    config.logErrorDB(e);
    pageArray.push('ERROR');
    return pageArray;
  }
};

/**
* getPage(pagePath) -
* Queries the database to find a record that contains the pagePath submitted.
* @param {string} pagePath The pages file path
* @return {JSON} The pages data in a JSON object
*/
module.exports.getPage = async (pagePath) => {
  const sql = await sqlPromise;

  try {
    const [result] = await sql.query(sql.format('SELECT * FROM pages WHERE pages_path = ?', [pagePath]));

    return { path: result[0].pages_path, modified: result[0].pages_modified };
  }
  catch (e) {
    config.logErrorDB(e);
    return { path: 'PAGES ERROR', modified: 0 };
  }
};


//------------- STYLE FUNCTIONS -------------//
/**
* getAllStyles(req) -
* Retrieves all records from the 'styles' table and pushes them to an array.
* @return {array} The styles data in an array
*/
module.exports.getAllStyles = async (req) => {
  const sql = await sqlPromise;
  let styleArray = [];

  try {
    const [results] = await sql.query(sql.format('SELECT * FROM styles'));

    for (let i = 0; i < results.length; i++) {
      styleArray.push(results[i].styles_path);
    }

    return styleArray;
  }
  catch (e) {
    config.logErrorDB(e);
    styleArray.push('ERROR');
    return styleArray;
  }
};

/**
* getStyle(stylePath) -
* Queries the database to find a record that contains the stylePath submitted.
* @param {string} stylePath The style file path
* @return {JSON} The styles data in a JSON object
*/
module.exports.getStyle = async (stylePath) => {
  const sql = await sqlPromise;

  try {
    const [result] = await sql.query(sql.format('SELECT * FROM styles WHERE styles_path = ?', [stylePath]));

    return { path: result[0].styles_path, modified: result[0].styles_modified };
  }
  catch (e) {
    config.logErrorDB(e);
    return { path: 'STYLES ERROR', modified: 0 };
  }
};


//------------- JS FUNCTIONS -------------//
/**
* getAllScripts(req) -
* Retrieves all records from the 'scripts' table and pushes them to an array.
* @return {array} The scripts data in an array
*/
module.exports.getAllScripts = async (req) => {
  const sql = await sqlPromise;
  let scriptsArray = [];

  try {
    const [results] = await sql.query(sql.format('SELECT * FROM scripts'));

    for (let i = 0; i < results.length; i++) {
      scriptsArray.push(results[i].scripts_path);
    }

    return scriptsArray;
  }
  catch (e) {
    config.logErrorDB(e);
    scriptsArray.push('ERROR');
    return scriptsArray;
  }
};

/**
* getScript(scriptPath) -
* Queries the database to find a record that contains the scriptPath submitted.
* @param {string} scriptPath The script file path
* @return {JSON} The scripts data in a JSON object
*/
module.exports.getScript = async (scriptPath) => {
  const sql = await sqlPromise;

  try {
    const [result] = await sql.query(sql.format('SELECT * FROM scripts WHERE scripts_path = ?', [scriptPath]));

    return { path: result[0].scripts_path, modified: result[0].scripts_modified };
  }
  catch (e) {
    config.logErrorDB(e);
    return { path: 'SCRIPTS ERROR', modified: 0 };
  }
};


//------------- MEDIA FUNCTIONS -------------//
/**
* getAllMedias(req) -
* Retrieves all records from the 'medias' table and pushes them to an array.
* @return {array} The medias paths in an array
*/
module.exports.getAllMedias = async (req) => {
  const sql = await sqlPromise;
  let mediasArray = [];

  try {
    const [results] = await sql.query(sql.format('SELECT * FROM medias'));

    for (let i = 0; i < results.length; i++) {
      mediasArray.push(results[i].medias_path);
    }

    return mediasArray;
  }
  catch (e) {
    config.logErrorDB(e);
    mediasArray.push('ERROR');
    return mediasArray;
  }
};

/**
* getMedia(mediaPath) -
* Queries the database to find a record that contains the mediaPath submitted.
* @param {string} mediaPath The medias file path
* @return {JSON} The medias data in a JSON object
*/
module.exports.getMedia = async (mediaPath) => {
  const sql = await sqlPromise;

  try {
    const [result] = await sql.query(sql.format('SELECT * FROM medias WHERE medias_path = ?', [mediaPath]));

    return { path: result[0].medias_path, modified: result[0].medias_modified };
  }
  catch (e) {
    config.logErrorDB(e);
    return { path: 'MEDIAS ERROR', modified: 0 };
  }
};


//------------- FILE FUNCTIONS -------------//
/**
* addFile(table, filePath) -
* Queries the database to find a record that contains the path submitted for the table submitted.
* If nothing is returned, a new record is inserted for filePath in the table submitted.
* @param {string} table The table to query
* @param {string} filePath The files path
*/
module.exports.addFile = async (table, filePath) => {
  const sql = await sqlPromise;
  const modifiedTime = Math.floor(Date.now() / 1000);
  const path = table + '_path';
  const modified = table + '_modified';

  const [result] = await sql.query(sql.format('Select * FROM ' + table + ' WHERE ' + path + ' = ?', [filePath]));

  if (result.length === 1) {
    config.logErrorDB(filePath + ' already exists in "' + table + '" table. ' + filePath + ' cannot be added again. Queried from function "addFile".');
    throw EXISTS;
  } else {
    await sql.query(sql.format('INSERT INTO ' + table + '(' + path + ', ' + modified + ') VALUES ("' + filePath + '", ' + modifiedTime + ')'));
    config.logInfoDB(filePath + ' record inserted in to "' + table + '" table.');
  }
};

/**
* updateFileData(table, filePath) -
* Queries the database to find a record that contains the path submitted for the table submitted.
* If a record is returned then it is updated. If table is pages then displays table is updated accordingly.
* @param {string} table The table to query
* @param {string} filePath The files path
*/
module.exports.updateFileData = async (table, filePath) => {
  const sql = await sqlPromise;
  const modifiedTime = Math.floor(Date.now() / 1000);
  const path = table + '_path';
  const modified = table + '_modified';

  const [result] = await sql.query(sql.format('Select * FROM ' + table + ' WHERE ' + path + ' = ?', [filePath]));

  if (result.length < 1) {
    config.logErrorDB(filePath + ' could not be updated. ' + filePath + ' was not found in "' + table + '" table. Queried from function "updateFileData".');
    throw EMPTY;
  } else {
    await sql.query(sql.format('UPDATE ' + table + ' SET ' + modified + ' = ? WHERE ' + path + ' = ?', [modifiedTime, filePath]));
    config.logInfoDB(filePath + ' updated in "' + table + '" table.');
    if (table === "pages") {
      await sql.query(sql.format('UPDATE displays SET dspy_modified = ? WHERE dspy_file = ?', [modifiedTime, filePath]));
    }
  }
};

/**
* deleteFile(table, filePath) -
* Queries the database to find a record that contains the path submitted for the table submitted.
* If a record is returned it is deleted. If table is pages then displays table is updated accordingly.
* @param {string} table The table to query
* @param {string} filePath The files path
*/
module.exports.deleteFile = async (table, filePath) => {
  const sql = await sqlPromise;
  const path = table + '_path';
  const modifiedTime = Math.floor(Date.now() / 1000);

  const [result] = await sql.query(sql.format('Select * FROM ' + table + ' WHERE ' + path + ' = ?', [filePath]));

  if (result.length < 1) {
    config.logErrorDB(filePath + ' could not be delete. ' + filePath + ' was not found in "' + table + '" table. Queried from function "deleteFile".');
    throw EMPTY;
  } else {
    await sql.query(sql.format('DELETE FROM ' + table + ' WHERE ' + path + ' = ?', [filePath]));
    config.logInfoDB(filePath + ' deleted from "' + table + '" table.');

    if (table === "pages") {
      const [pages] = await sql.query(sql.format('SELECT * FROM pages'));
      if (pages.length > 0) {
        // If the file deleted was a page on display(s) then change to a page that still exists
        await sql.query(sql.format('UPDATE displays SET dspy_file = ?, dspy_modified = ? WHERE dspy_file = ?', [pages[0].pages_path, modifiedTime, filePath]));
      } // Else do nothing and leave the removed file being displayed as it wont fault until a manual refresh occurs
    }
  }
};
