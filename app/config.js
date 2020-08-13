'use strict';

//------------- GLOBAL VARIABLES -------------//
const path = require('path');
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const generalInfoStream = fs.createWriteStream(__dirname + '/logs/info.txt', { flags: 'a+' });
const generalErrorStream = fs.createWriteStream(__dirname + '/logs/error.txt', { flags: 'a+' });
const dbInfoStream = fs.createWriteStream(__dirname + '/logs/db.txt', { flags: 'a+' });
const dbErrorStream = fs.createWriteStream(__dirname + '/logs/db-error.txt', { flags: 'a+' });


//------------- CONFIG -------------//
module.exports.mysql = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'pudhub_DB'
};

/**
* logInfo(msg) -
* Takes a message and logs the information with a time stamp in a log file.
* @param {text} msg The message text to be used when logging info
*/
module.exports.logInfo = function(msg) {
  const log = new Date().toISOString() + ": " + msg + "\n";
  generalInfoStream.write(log);
};

/**
* logError(msg) -
* Takes a message and logs the error information with a time stamp in a log file.
* @param {text} msg The message text to be used when logging errors
*/
module.exports.logError = function(msg) {
  const log = new Date().toISOString() + ": " + msg + "\n";
  generalErrorStream.write(log);
};

/**
* logInfoDB(msg) -
* Takes a message and logs the database information with a time stamp in a log file.
* @param {text} msg The message text to be used when logging database information
*/
module.exports.logInfoDB = function(msg) {
  const log = new Date().toISOString() + ": " + msg + "\n";
  dbInfoStream.write(log);
};

/**
* logErrorDB(msg) -
* Takes a message and logs the database errors information with a time stamp in a log file.
* @param {text} msg The message text to be used when logging database error information
*/
module.exports.logErrorDB = function(msg) {
  const log = new Date().toISOString() + ": " + msg + "\n";
  dbErrorStream.write(log);
};

/**
* error(response, msg) -
* Logs the error using the msg recieved.
* Responds with a status code & error file to display.
* @param {string} msg The msg to be used in error logging
*/
module.exports.error = async (res, msg) => {
  const log = new Date().toISOString() + ": Error occured -\n" + msg + "\n";
  generalErrorStream.write(log);
  res.status(500).sendFile(__dirname + '/public/error.html');
};

/**
* fetchFile(filePath) -
* Locates a stored file and reads its contents.
* @param {text} url The url passed to locate the desired file in the server
* @return {text}
*/
module.exports.fetchFile = async (filePath) => {
  try {
    const fileContents = await readFile(__dirname + '/displays/' + filePath);
    return fileContents;
  }
  catch (e) {
    console.log(e);
  }
};
