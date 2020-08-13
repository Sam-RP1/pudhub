'use strict';

//------------- GLOBAL VARIABLES -------------//
const fs = require('fs');
const db = require('../mysql-model');
const config = require('../config');


//------------- PAGES API FUNCTIONS -------------//
/**
* getPages(request, response) -
* Queries the database for a list of all pages.
* Responds with a status code and an array of the page file paths.
*/
module.exports.getPages = async (req, res) => {
  try {
    const pages = await db.getAllPages();
    res.status(200).json(pages);
  }
  catch (e) {
    config.error(res, e);
  }
};

/**
* getPage(request, response) -
* Queries the database for a specific page with the requested name. Retrieves the data.
* Responds with a JSON object of the data.
*/
module.exports.getPage = async (req, res) => {
  try {
    const file = '/pages/' + req.params.file
    const fileData = await db.getPage(file);
    res.status(200).json(fileData);
  }
  catch (e) {
    config.error(res, e);
  }
};

/**
* createPage(request, response) -
* Creates a new page file with the submitted name.
* Responds with a status code and a redirect link.
*/
module.exports.createPage = async (req, res) => {
  try {
    const filePath = "/pages/" + req.body.fileName + '.html';
    const defaultFileContent = await config.fetchFile('templates/page-template.html');

    await db.addFile('pages', filePath);

    fs.writeFile('./app/displays' + filePath, defaultFileContent, function (err) {
      if (err) throw err;
    });

    config.logInfo(filePath + ' created and saved to the directory /app/displays/pages.');
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
* updatePage(request, response) -
* Updates an existing page using the submitted name and new contents to be written.
* Responds with a status code.
*/
module.exports.updatePage = async (req, res) => {
  try {
    const filePath = '/pages/' + req.params.file;

    await db.updateFileData('pages', filePath);
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
* deletePage(request, response) -
* Deletes a page using the submitted file name.
* Responds with a status code.
*/
module.exports.deletePage = async (req, res) => {
  if (req.params.file === 'default-display.html') {
    res.sendStatus(405);
  } else {
    try {
      const filePath = '/pages/' + req.params.file;

      await db.deleteFile('pages', filePath)
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
