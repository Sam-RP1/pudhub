'use strict';

//------------- GLOBAL VARIABLES -------------//
const fs = require('fs');
const db = require('../mysql-model');
const config = require('../config');


//------------- STYLES API FUNCTIONS -------------//
/**
* getStyles(request, response) -
* Queries the database for a list of all styles.
* Responds with a status code and an array of the style file paths.
*/
module.exports.getStyles = async (req, res) => {
  try {
    const pages = await db.getAllStyles();
    res.status(200).json(pages);
  }
  catch (e) {
    config.error(res, e);
  }
};

/**
* getStyle(request, response) -
* Queries the database for a specific style with the requested name. Retrieves the data.
* Responds with a JSON object of the data.
*/
module.exports.getStyle = async (req, res) => {
  try {
    const file = '/styles/' + req.params.file
    const fileData = await db.getStyle(file);
    res.status(200).send(fileData);
  }
  catch (e) {
    config.error(res, e);
  }
};

/**
* createStyle(request, response) -
* Creates a new style file with the submitted name.
* Responds with a status code and a redirect link.
*/
module.exports.createStyle = async (req, res) => {
  try {
    const filePath = "/styles/" + req.body.fileName + '.css';
    const defaultFileContent = await config.fetchFile('templates/style-template.css');

    await db.addFile('styles', filePath);

    fs.writeFile('./app/displays' + filePath, defaultFileContent, function (err) {
      if (err) throw err;
    });

    config.logInfo(filePath + ' created and saved to the directory /app/displays/styles.');
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
* updateStyle(request, response) -
* Updates an existing style using the submitted name and new contents to be written.
* Responds with a status code.
*/
module.exports.updateStyle = async (req, res) => {
  try {
    const filePath = '/styles/' + req.params.file;

    await db.updateFileData('styles', filePath);
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
* deleteStyle(request, response) -
* Deletes a style using the submitted file name.
* Responds with a status code.
*/
module.exports.deleteStyle = async (req, res) => {
  if (req.params.file === 'root.css') {
    res.sendStatus(405);
  } else {
    try {
      const filePath = '/styles/' + req.params.file;

      await db.deleteFile('styles', filePath)
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
