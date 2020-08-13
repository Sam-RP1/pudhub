'use strict';

//------------- GLOBAL VARIABLES -------------//
const fs = require('fs');
const db = require('../mysql-model');
const config = require('../config');


//------------- SCRIPTS API FUNCTIONS -------------//
/**
* getScripts(request, response) -
* Queries the database for a list of all scripts.
* Responds with a status code and an array of the script file paths.
*/
module.exports.getScripts = async (req, res) => {
  try {
    const pages = await db.getAllScripts();
    res.status(200).json(pages);
  }
  catch (e) {
    config.error(res, e);
  }
};

/**
* getScript(request, response) -
* Queries the database for a specific script with the requested name. Retrieves the data.
* Responds with a JSON object of the data.
*/
module.exports.getScript = async (req, res) => {
  try {
    const file = '/scripts/' + req.params.file
    const fileData = await db.getScript(file);
    res.status(200).send(fileData);
  }
  catch (e) {
    config.error(res, e);
  }
};

/**
* createScript(request, response) -
* Creates a new script file with the submitted name.
* Responds with a status code and a redirect link.
*/
module.exports.createScript = async (req, res) => {
  try {
    const filePath = "/scripts/" + req.body.fileName + '.js';
    const defaultFileContent = await config.fetchFile('templates/script-template.js');

    await db.addFile('scripts', filePath);

    fs.writeFile('./app/displays' + filePath, defaultFileContent, function (err) {
      if (err) throw err;
    });

    config.logInfo(filePath + ' created and saved to the directory /app/displays/scripts.');
    res.status(201).redirect('/manageFiles');
  }
  catch (e) {
    if (e.status === 'exists') {
      res.status(200).redirect('/manageFiles')
    } else {
      config.error(res, e);
    }
  }
};

/**
* updateScript(request, response) -
* Updates an existing script using the submitted name and new contents to be written.
* Responds with a status code.
*/
module.exports.updateScript = async (req, res) => {
  try {
    const filePath = '/scripts/' + req.params.file;

    await db.updateFileData('scripts', filePath);
    fs.writeFile('./app/displays' + filePath, req.body.file.content, function (err) {
      if (err) throw err;
    });

    config.logInfo(filePath + ' properties updated.');
    res.sendStatus(204);
  }
  catch (e) {
    if (e.status === 'empty') {
      res.sendStatus(410);
    } else {
      config.error(res, e);
    }
  }
};

/**
* deleteScript(request, response) -
* Deletes a script using the submitted file name.
* Responds with a status code.
*/
module.exports.deleteScript = async (req, res) => {
  if (req.params.file === 'root.js') {
    res.sendStatus(405);
  } else {
    try {
      const filePath = '/scripts/' + req.params.file;

      await db.deleteFile('scripts', filePath)
      fs.unlinkSync('./app/displays' + filePath)

      config.logInfo(filePath + ' deleted.');
      res.sendStatus(204);
    }
    catch (e) {
      if (e.status === 'empty') {
        res.sendStatus(410);
      } else {
        config.error(res, e);
      }
    }
  }
};
