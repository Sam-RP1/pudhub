'use strict';

//------------- GLOBAL VARIABLES -------------//
const db = require('../mysql-model');
const config = require('../config');


//------------- DISPLAYS API FUNCTIONS -------------//
/**
* getAllDisplaysData(request, response) -
* Queries the database for all data stored in the 'displays' table.
* Responds with a status code and an array of the data.
*/
module.exports.getAllDisplaysData = async (req, res) => {
  try {
    const displayData = await db.getAllDisplayData();
    res.status(200).json(displayData);
  }
  catch (e) {
    config.error(res, e);
  }
};

/**
* getDisplaysData(request, response) -
* Queries the database for a displays IP & retrieves its associated data.
* Responds with a status code and a JSON object of the data.
*/
module.exports.getDisplaysData = async (req, res) => {
  let displayIP = req.ip;

  if (displayIP.substr(0, 7) == '::ffff:') { displayIP = displayIP.substr(7) };

  try {
    const displayData = await db.getDisplayData(displayIP);
    res.status(200).json(displayData);
  }
  catch (e) {
    config.error(res, e);
  }
};

/**
* updateDisplaysData(request, response) -
* Updates a displays record in the 'displays' table in the database.
* Responds with a status code.
*/
module.exports.updateDisplaysData = async (req, res) => {
  try {
    await db.updateDisplayData(req.params.ip, req.body.display.name, req.body.display.file, req.body.display.timer);
    config.logInfo(req.params.ip + ' properties updated.')
    res.sendStatus(204);
  }
  catch (e) {
    if (e.status === 'empty') {
      res.sendStatus(410);
    } else {
      config.error(res, e);
    }
  };
};

/**
* deleteDisplay(request, response) -
* Queries the database to delete a record that contains the submitted displays ip.
* Responds with a status code.
*/
module.exports.deleteDisplay = async (req, res) => {
  try {
    await db.deleteDisplay(req.params.ip);
    config.logInfo(req.params.ip + ' removed from the P.U.D network.')
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
