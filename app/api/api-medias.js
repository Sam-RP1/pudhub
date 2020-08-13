'use strict';

//------------- GLOBAL VARIABLES -------------//
const fs = require('fs');
const db = require('../mysql-model');
const config = require('../config');


//------------- MEDIAS API FUNCTIONS -------------//
/**
* getMedias(request, response) -
* Queries the database for a list of all medias.
* Responds with a status code and an array of the media file paths.
*/
module.exports.getMedias = async (req, res) => {
  try {
    const pages = await db.getAllMedias();
    res.status(200).json(pages);
  }
  catch (e) {
    config.error(res, e);
  }
};

/**
* getMedia(request, response) -
* Queries the database for a specific media with the requested name. Retrieves the data.
* Responds with a JSON object of the data.
*/
module.exports.getMedia = async (req, res) => {
  try {
    const file = '/medias/' + req.params.file
    const fileData = await db.getMedia(file);
    res.status(200).send(fileData);
  }
  catch (e) {
    config.error(res, e);
  }
};

/**
* deleteMedia(request, response) -
* Deletes a media using the submitted file name.
* Responds with a status code.
*/
module.exports.deleteMedia = async (req, res) => {
  try {
    const filePath = '/medias/' + req.params.file;

    await db.deleteFile('medias', filePath)
    fs.unlinkSync('app/displays' + filePath)

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
};
