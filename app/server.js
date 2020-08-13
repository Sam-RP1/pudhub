'use strict';

//------------- GLOBAL VARIABLES -------------//
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const db = require('./mysql-model');
const config = require('./config');
const displayAPI = require('./api/api-displays.js');
const pageAPI = require('./api/api-pages.js');
const styleAPI = require('./api/api-styles.js');
const scriptAPI = require('./api/api-scripts.js');
const mediaAPI = require('./api/api-medias.js');

const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'app/displays/medias')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });


//------------- SERVER -------------//
// set the port for the application
app.set('port', 8080);

// static directories
app.use('/public', express.static(__dirname + '/public'));
app.use('/displays', express.static(__dirname + '/displays'));

// set body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// start the server
app.listen(app.get('port'), () => console.log(`P.U.D hub started on port ${app.get('port')}`));


//------------- ROUTES & GETS -------------//
app.get('/', function(req, res) {
  res.redirect('/display');
});

app.get('/display', function(req, res) {
  let displayIP = req.ip;

  // converts a IPv4 address formatted as IPv6 back to IPv4
  if (displayIP.substr(0, 7) == '::ffff:') { displayIP = displayIP.substr(7) };
  config.logInfo(displayIP + ' sending request to the P.U.D network');
  manageDisplays(displayIP, res);
});

app.get('/dashboard', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/manageFiles', function(req, res) {
  res.sendFile(__dirname + '/public/manageFiles.html');
});

app.get('/configureDisplay', function(req, res) {
  res.sendFile(__dirname + '/public/configureDisplays.html');
});

app.get('/manageMedia', function(req, res) {
  res.sendFile(__dirname + '/public/manageMedias.html');
});


//------------- API -------------//
//   DISPLAYS
//   GET     /api/displays        - retrieves a list of all displays and their associated data, returns status code and [dspy_ip, dspy_name, dspy_file, dspy_timer, dspy_modified...]
//   GET     /api/displays/data   - retrieves a single displays data, returns status code and { ip: dspy_ip, name: dspy_name, file: dspy_file, timer: dspy_timer, modified: dspy_modified }
//   PUT     /api/displays/x      - updates display x's associated data, returns http status code only
//   DELETE  /api/displays/x      - deletes display x, returns http status code only
app.get('/api/displays', displayAPI.getAllDisplaysData);
app.get('/api/displays/data', displayAPI.getDisplaysData);
app.put('/api/displays/:ip', displayAPI.updateDisplaysData);
app.delete('/api/displays/:ip', displayAPI.deleteDisplay);

//   PAGES
//   GET     /api/pages           - retrieves a list of all pages, returns status code and [pagePath, pagePath, ...]
//   GET     /api/pages/x         - retrieves a page of file name x, returns status code and { path: pagePath, modified: pageModified }
//   POST    /api/pages           - creates a page from the submitted data, returns http status code only
//   PUT     /api/pages/x         - updates a page of file name x, returns http status code only
//   DELETE  /api/pages/x         - deletes a page of file name x, returns http status code only
app.get('/api/pages', pageAPI.getPages);
app.get('/api/pages/:file', pageAPI.getPage);
app.post('/api/pages', pageAPI.createPage);
app.put('/api/pages/:file', pageAPI.updatePage);
app.delete('/api/pages/:file', pageAPI.deletePage);

//   STYLES
//   GET     /api/styles          - retrieves a list of all styles, returns status code and [stylePath, stylePath, ...]
//   GET     /api/styles/x        - retrieves a page of file name x, returns status code and { path: stylePath, modified: styleModified }
//   POST    /api/styles          - creates a style from the submitted data, returns http status code only
//   PUT     /api/styles/x        - updates a style of file name x, returns http status code only
//   DELETE  /api/styles/x        - deletes a style of file name x, returns http status code only
app.get('/api/styles', styleAPI.getStyles);
app.get('/api/styles/:file', styleAPI.getStyle);
app.post('/api/styles', styleAPI.createStyle);
app.put('/api/styles/:file', styleAPI.updateStyle);
app.delete('/api/styles/:file', styleAPI.deleteStyle);

//   SCRIPTS
//   GET     /api/scripts         - retrieves a list of all scripts, returns status code and [scriptPath, scriptPath, ...]
//   GET     /api/scripts/x       - retrieves a script of file name x, returns status code and { path: scriptPath, modified: scriptModified }
//   POST    /api/scripts         - creates a script from the submitted data, returns http status code only
//   PUT     /api/scripts/x       - updates a script of file name x, returns http status code only
//   DELETE  /api/scripts/x       - deletes a script of file name x, returns http status code only
app.get('/api/scripts', scriptAPI.getScripts);
app.get('/api/scripts/:file', scriptAPI.getScript);
app.post('/api/scripts', scriptAPI.createScript);
app.put('/api/scripts/:file', scriptAPI.updateScript);
app.delete('/api/scripts/:file', scriptAPI.deleteScript);

//   MEDIAS
//   GET     /api/medias          - retrieves a list of all medias, returns status code and [mediaPath, mediaPath, ...]
//   GET     /api/medias/x        - retrieves a media of file name x, returns status code and { path: mediaPath, modified: mediaModified }
//   POST    /api/medias          - creates media(s) uploaded by the user, returns redirect link
//   DELETE  /api/medias/x        - deletes a media of file name x, returns http status code only
app.get('/api/medias', mediaAPI.getMedias);
app.get('/api/medias/:file', mediaAPI.getMedia);
app.post('/api/medias', upload.array('media'), async (req, res, next) => {
  const files = req.files

  if (!files) {
    const error = ('No media submitted');
    config.error(res, error);
  } else {
    try {
      for (let i = 0; i < files.length; i++) {
        await db.addFile('medias', '/medias/' + files[i].originalname);
        config.logInfo(files[i].originalname + ' uploaded to media.')
      }
      res.status(200).redirect('/manageMedia');
    } catch (e) {
      if (e.status === 'exists') {
        res.status(200).redirect('/manageMedia'); // already done
      } else {
        config.error(res, e);
      }
    };
  }
});
app.delete('/api/medias/:file', mediaAPI.deleteMedia);


//------------- DISPLAY CONNECTION MANAGEMENT -------------//
/**
* manageDisplays(displayIP, response) -
* Queries the database for an existing record with a matching IP.
* Either adds the displayIP to the database OR finds a matching record, then responds with the appropriate file.
* @param {string} displayIP The displays IP address
*/
async function manageDisplays(displayIP, res) {
  try {
    const displayData = await db.searchDisplay(displayIP);

    if (displayData.ip === '') {
      await db.addDisplay(displayIP);
      config.logInfo(displayIP + ' not found in database. Added ' + displayIP + ' to database. Serving default presets.');
      res.status(201).sendFile(__dirname + '/displays/pages/default-display.html');
    } else {
      config.logInfo(displayIP + ' found in database. Serving ' + displayData.file + '.');
      config.logInfo(displayIP + ' checked in. \n# Current Details for ' + displayIP + '\n# Name: ' + displayData.name + '\n# File: ' +
      displayData.file + '\n# Timer: ' + displayData.timer + '\n# Last modified: ' + displayData.modified);
      res.status(200).sendFile(__dirname + '/displays/' + displayData.file);
    }
  }
  catch (e) {
    config.error(res, e);
  }
};


//------------- ERROR HANDLING -------------//
// Method for handling 404 requests
app.use(function (req, res, next) {
  config.logError('Error occured - Request does not exist, 404.');
  res.status(404).sendFile(__dirname + '/public/error.html');
});
