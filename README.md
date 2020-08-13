# Portsmouth Unattended Displays

Welcome to the README for the Portsmouth Unattended Displays application, also known as P.U.D Hub. This application was developed to allow the creation, customisation and management of a vast network of unattended displays. All from one hub.


## Contents

- **Getting Started**
- **API Breakdown**
- **Application & Features**
- **Prerequisites**
- **Installation & Setting Up**


## Getting Started

Getting started with using the P.U.D application is simple and easy to do!
Below you will find a number of sections that discuss, break down or explain a key aspect of the application. All users are encouraged to read through all of these sections before you get hands on.

For new users to the P.U.D application you will need to read over all of the key features of the application and how they work before you begin creating and managing beautiful unattended displays. The Installation and Setting up section in this document will guide you through how to get the P.U.D application up and running on a local system. After which, when you are ready, the P.U.D application can then be fully deployed.

Most of all, please enjoy using the application to create and manage beautiful fully tailored unattended displays.


## API Breakdown

The P.U.D application has a simple and predictable application programming interface as a result of its design. When designing the P.U.D API the following were considered...

- Methods: Is the correct method used for the API request being made?
  - For the API to be created correctly, as well as be predictable and easy to understand, it was important to ensure that the right methods were being used for the appropriate requests. The methods used in the P.U.D API include "GET", "POST", "PUT" and "DELETE". GET is used for retrieving data and information. POST is used for creating files or uploading media. PUT is used when updating a resources properties. DELETE is used to delete a resource from the application. The mapping and use of these methods is inline with how to handle CRUD (Create, read, update, delete) actions with RESTful principles.

- Endpoints: Is the naming system logical and consistent?
  - The API required specific endpoints that would need to be predictable and consistent. The endpoints used are all plural, rather than mixing singular and plural endpoints together which would have meant users needing to learn and remember more than is necessary. The endpoints are named after the resources that are being made available and requested via the API, thus making the API request predictable. The endpoint names currently being used are "displays", "pages", "styles", "scripts" and "medias".

- Structure: Is the API structure consistent?
  - For the API to be easily remembered, as well as predictable, the structure needed to remain consistent across resources and requests. Therefore, the API follows the basic structure of "/api/ENDPOINT", from which you can the put further parameters to access specific resources or information. An example of a further parameter on an API request would be '/api/displays/:ip' to get a specific displays details.

- Modifiability: Would the API be able to expand in the future?
  - Due to how simplistically the API is designed and implemented, along with how the functions behind each request operate, it would be very easy to modify the current API to expand it or even overhaul it. To ensure it is modifiable the functions and components behind the API have been built to each serve a single purpose. This means the functions are easily understandable and independent of each other. Therefore changes can be made to individual functions without needing to make large scale changes else where as a result. Likewise, due to the functions and components being independent of each other, new functions for new API methods could be created and implemented seamlessly.

- Simplicity: Is the API easy to understand and remember?
  - As a result of the endpoints naming decision, the API structure chosen and the methods allocated to the appropriate requests the API is simplistic to use and remember.

- Portability: Will the API ever have to change?
  - Due to the scale, features and the amount of data the P.U.D application will be managing it is highly unlikely that the API currently implemented would ever need to change. However, if the fundamental design or implementation of the applications storage methods or its features were to be changed then the API may require updating.

- Idempotence: Does each API call maintain the same result for the same request?
  - To ensure that the API calls would be idempotent, return the same result if called in the exact same manner, the functions implemented are short and do not leave interpretation open. Therefore the API calls made are very precise, thus meaning the same results would be returned.

- RESTful principles

### The API

Many of the API documentations below will be similar. This is a result of the API's simplicity in its design.

**DISPLAYS**
#### GET     /api/displays
- retrieves a list of all displays and their properties stored in the database, returns a status code and array of [dspy_ip, dspy_name, dspy_file, dspy_timer, dspy_modified...]
#### GET     /api/displays/data
- retrieves a single displays properties, returns a status code and a JSON object of { ip: dspy_ip, name: dspy_name, file: dspy_file, timer: dspy_timer, modified: dspy_modified }
#### PUT     /api/displays/:ip
- updates a displays properties using the ip address given in the parameter ':ip', returns http status code only
#### DELETE  /api/displays/:ip
- deletes a display using the ip address given in the parameter ':ip', returns http status code only


**PAGES**
#### GET     /api/pages
- retrieves a list of all page paths, returns status code and array of [pagePath, pagePath, ...]
#### GET     /api/pages/:file
- retrieves a page using the files name sent as the parameter ':file', returns status code and JSON object of { path: pagePath, modified: pageModified }
#### POST    /api/pages
- creates a page from the submitted data, returns http status code only
#### PUT     /api/pages/:file
- updates a page using the files name sent as the parameter ':file', returns http status code only
#### DELETE  /api/pages/:file
- deletes a page using the files name sent as the parameter ':file', returns http status code only


**STYLES**
#### GET     /api/styles
- retrieves a list of all style paths, returns status code and array of [stylePath, stylePath, ...]
#### GET     /api/styles/:file
- retrieves a page using the files name sent as the parameter ':file', returns status code and JSON object of { path: stylePath, modified: styleModified }
#### POST    /api/styles
- creates a style from the submitted data, returns http status code only
#### PUT     /api/styles/:file
- updates a style using the files name sent as the parameter ':file', returns http status code only
#### DELETE  /api/styles/:file
- deletes a style using the files name sent as the parameter ':file', returns http status code only


**SCRIPTS**
#### GET     /api/scripts
- retrieves a list of all script paths, returns status code and array of [scriptPath, scriptPath, ...]
#### GET     /api/scripts/:file
- retrieves a script using the files name sent as the parameter ':file', returns status code and JSON object of { path: scriptPath, modified: scriptModified }
#### POST    /api/scripts
- creates a script from the submitted data, returns http status code only
#### PUT     /api/scripts/:file
- updates a script using the files name sent as the parameter ':file', returns http status code only
#### DELETE  /api/scripts/:file
- deletes a script using the files name sent as the parameter ':file', returns http status code only


**MEDIAS**
#### GET     /api/medias
- retrieves a list of all media paths, returns status code and array of [mediaPath, mediaPath, ...]
#### GET     /api/medias/:file
- retrieves a media using the files name sent as the parameter ':file', returns status code and JSON object of { path: mediaPath, modified: mediaModified }
#### POST    /api/medias
- creates media(s) uploaded by the user, returns redirect link
#### DELETE  /api/medias/:file
- deletes a media using the files name sent as the parameter ':file', returns http status code only


## Application & Features

### Application

The P.U.D application has two primary URLs to access its services. The first URL is used to access the applications admin dashboard. This admin dashboard is where the creation, customisation and management of unattended displays and their various resources on the P.U.D network can be done. The admin dashboard is accessible via the URL extension of '/dashboard', for example 'yourDomain.ext/dashboard' would take you to the admin dashboard.

The second URL is used to access the applications unattended displays service. This is the URL used to add displays to the P.U.D network as unattended displays. When a display connects for the first time it will be added to the displays database table, given the default settings for a new unattended display and served a default page to display whilst it waits to be setup properly via the admin dashboard. The unattended display service is accessible via the URL extension of '/' or '/display', for example 'yourDomain.ext/' or 'yourDomain.ext/display' would connect the display to the P.U.D network as an unattended display.

The admin dashboard is also fully functioning on mobile devices as well.

The admins dashboard offers four main pages; "Dashboard", "Manage Files", "Configure Displays" and "Manage Media". These pages are all accessible from one another using the navigational menu located in the top left of the user interface. Each of the pages serves a different purpose and has a number of unique features.

Overall, the P.U.D application has an extensive number of features built in to it. These features range from the creation of files on the server to uploading media for use on unattended displays to managing all the displays connected to its network in one place.
The full list of features, separated into sub-sections, how to use them and how they work is below...

### Dashboard:
The dashboard page is the home screen of the admins dashboard for the P.U.D application. It contains basic informative features which show the number of unattended displays connected to the application, the number of pages, number of styles and number of scripts too. As well as the standard navigational menu and icons that are buttons to other pages.

### Manage Files:
The manage files page is where all of the pages, styles and scripts stored on the P.U.D application can be seen, accessed, edited, created and deleted.

#### Features
- **Create Files:**
    - Allows the user to create three different types of files, pages (HTML), styles (CSS) and scripts (JS) and give the new file its own name. User does this by clicking the "Create a file" button and filling in the form shown in the pop up box.
    - Works by the user submitting the form which has a post method and a action dynamically made on submission be the function setAction(). Server handles the request and creates a new file using the information submitted and the 'fs' package. The Manage Files page then reloads.
    - Each file created comes with default contents, different depending on the type of file created. This provides a framework for the user to build on top off.
- **Edit Files:**
    - Allows the user to edit any page, style or script file for unattended displays. User clicks the file they wish to edit on the Manage Files page. This opens the editing window for that file. Window contains a save button, a cancel button and a basic text editor.
    - Works by fetching the selected file from the server using the function getFile() which send a URL for the file to the function fetchFileAsTest(URL). This fetches the URL resource from the server and returns it as text to getFile(), then places the text into the file editor window, the user can then edit the page contents. Saving is done by taking the editing windows .innerHTML and placing it in a variable which is then PUT to the server along with the files name to update the files contents and its database record. Cancelling works by setting the editing windows display property to 'none'.
- **Delete Files:**
    - Allows the user to delete any page, style or script file for unattended displays one at a time. User activates the deletion tool by clicking the "delete" button. This causes the screens background to darken, giving visual feedback to the user that they are now deleting files. To delete a file the user must click on one of the file names from the lists and then press "ok" in the verification box to confirm they would like to delete that file.
    - Works by unhiding a list of identical html elements that have event listeners attached to them that call the deleteFile() function when they are clicked. The deleteFile() function takes the elements ID which is that files path and creates a API request for the DELETE method. The server then receives this request and data. The file is then deleted and removed from the database records.
- **Background Unattended Display Refresh:**
    - When a user edits a page file any unattended display showing that page file will need to be updated with the new content that has been saved. Otherwise the unattended display would be 'outdated' when changes are made.
    - This passive feature works by identifying if the file edited and saved is a "pages" file on the server. If the file is a "pages" file then a SQL query is constructed to search for any records in the "displays" table that contain this page file. If a record or records are found to contain this file then their dspy_modified is updated to match the pages_modified value. These two values are used for comparison on the unattended displays serverCheckIn() function, if the values match then the unattended display will refresh.

### Configure Displays:
The configure displays page is where all of the unattended displays that have connected to the P.U.D application can be found. For each unattended display shown you can see its name, ip address and the page it is displaying. You can also edit each display and removed each display individually too.

#### Features
- **View Displays:**
    - The user can see every unattended display connected to the P.U.D network that is stored in the database. For each unattended display the user can see its name, ip address and the page it is currently showing. For each display the user can click the "edit" button to open the editing window or the "remove" button to remove the display.
    - Works by generating the html elements for every single display in the database via the function loadDisplays(). This function fetches the URL "/api/displays" which retrieves an array of all the displays and their properties. This array is used to make the html elements and their properties then append them to the user interface.
- **Edit Displays:**
    - The user can edit the properties of any unattended display by clicking its "edit" button. This opens the editing tool for the selected unattended display. The user can edit the displays name, refresh timer from 1 minutes upwards, the file the display is showing and edit that files contents too. The user can click the "save" button to save any changes made or click the "cancel" button to not make any changes and close the editing window.
    - Works by taking the selected unattended displays properties from html data-attributes. These attribute values are then used to set elements in the editing tool. The selected unattended displays file is fetched from the server using the function getFile() which takes the user selected HTML elements ID and creates the file path URL. This URL is then sent to the function fetchFileAsTest(URL), this fetches the URL resource from the server and returns it as text to the getFile() function which then places the text into the file editor window. The ability to save is done by the function saveEditing() taking all of the displays properties set by the user and the displays IP and creating a PUT request that is then sent to the server.
- **Remove Displays:**
    - The user can remove any unattended display by clicking its "remove" button. This opens a verification pop up that makes sure the user wants to remove that unattended display from the application. The display is then removed after user confirmation.
    - This feature works by taking the data-attribute for the unattended displays ip address. The ip address is then put in to a delete request that is sent to the server. The unattended display is then deleted from the displays table in the database.

### Manage Media:
The manage media page is where all of the media store on the P.U.D application can be previewed, uploaded and deleted.

#### Features
- **Upload Media:**
    - The user can upload multiple media files at once. The user will click the "Upload Media" button. This will then result in a pop up opening where the user can click a "Choose Files" files button to open their local file explorer and select media files to upload.
    - Works using a html form with the property enctype="multipart/form-data" and the "Choose Files" button being set as type="file". The form action is set to "/api/medias" and the  method is set to "post". Once the user clicks the "Upload" button the files will then be POST'd to the URL set as the form action. On the server side the multer package handles the storage and database entry of the files.
- **Remove Media:**
    - Allows the user to delete any media file one at a time. User activates the deletion tool by clicking the "Delete Media" button. This results in the screens background to darken, giving visual feedback to the user that they are now able to delete media files. To delete a media file the user must click on one of them from the lists and then press "ok" in the verification box that appears to confirm they would like to delete that media.
    - Works by unhiding a list of identical html elements that have different event listeners attached to them that call the deleteFile() function when they are clicked. The deleteFile() function takes the elements ID which is that medias file path and creates a API request for the DELETE method. The server then receives this request and data. The media file is then found using its path. It is then deleted and removed from the database records.
- **Preview Media:**
    - This is a unique feature where the user is able to preview the media on the application. The user has to click on one of the media files from the list on their user interface. If the media selected is a valid media type then it will be displayed in a preview window. The user can leave the preview window by clicking the X icon in the top left.
    - Works by the taking the id of media item clicked by the user. The id is the file path for the media. This file path is then used to create the url for the media selected. This url is then set as an src for either the video preview window or the image preview window. The according window is the made visible with the media selected by the user.
    - The media mime types that are preview-able by the user are mp4, webm, ogg, jpg, png, gif, svg and jpeg.
    - If the media selected is not one of the file types listed then an error message is put in its place.

### Unattended Displays:
- **Self Maintaining:**
    - Once an unattended display is connected to the P.U.D application correctly, the only maintenance that it will ever require is the user updating its properties like its file contents when they want to.
    - The unattended display root.js script maintains the unattended displays. When an unattended display loads it will request its properties using /api/displays/data in the function getDisplayData(), this gets the displays name, page to be shown, refresh timer and when it was last modified. A setInterval function is then made to call the function serverCheckIn() based on the refresh timer received.
    - When the serverCheckIn() function is called it makes an identical request to /api/displays/data. The data received is then used to compare old and new values to see if the unattended display needs to refresh to get the newest version of the file it is showing, a new file or it just needs to change its refresh timer length or name. Therefore the amount of refreshing the unattended display does is minimal as it only does it when a page file change occurs.
    - This means if a page file is updated by the user then all the displays with that page file will reload automatically when their refresh timer runs out.

### Server:

These are features which are either built into the server to ensure the unattended displays service does not encounter unexpected errors as a result of user input done on the admin dashboard or can be used to monitor the systems health and help find potential issues.

#### Features
- **Log Files:**
    - In the applications folder path './app/logs' are four log files. The first log folder is "info.txt", this contains general system information. The second is "error.txt", this contains any errors and the error messages given when they occur. The third is "db.txt", this contains general information on the database systems. The last is "db-error.txt", this contains any errors and their error message relating to the database. All four of the log files have time stamps for every log written to them. Log entries are made when certain functions are executed, requests are made or data is accessed.
- **Automatic File Correction:**
    - When a user deletes a page file the server will check if that page file deleted was being shown on any unattended displays by checking querying the displays table in the database. If any unattended displays were showing that page file then their records are updated with a different page file that does exist. This prevents displays from encountering errors when their severCheckIn() function is called.

## Prerequisites

To install and run the application you will need to have the following pieces of software...

- [NodeJS](https://nodejs.org/en/) LTS Version Recommended
- [MariaDB Server](https://mariadb.com/downloads/) Latest 'GA' Version for your systems OS is Recommended

If you do not have the above software's, please download, install and set them up where necessary **before** proceeding to the Installation section below.

## Installation & Setting Up

Whilst following the installation guide below you will need to use one of the following interfaces for entering code...
- For windows based systems you will need to the Windows Powershell as administrator
- For mac based systems you will need to use the Terminal
- For any other systems you will need to use a UNIX command line/shell

Also, after typing each line of code you should press the 'Enter' key to run the code before progressing to entering the next line of code, saying this now saves some repetition!
It is assumed in this installation guide that you have basic knowledge of navigating directories and files using command line interfaces.

### 1. Verifying Installations

Firstly, we will need to ensure you have either successfully installed and setup the software's specified in the section titled "Prerequisites" or already have these software's setup on your system.
To do so enter the following lines of code one after the other into your command line interface.

```
node --version
```

```
npm --version
```

```
mysql --version
```

After entering each line of code, if you were given the version number or a string containing a version number then good job! We are good to progress on to the next stage.

If not then you will need to attempt to install and setup the software's in the section titled "Prerequisites" that did not return a version number again.

### 2. Installing the Application

We will now be installing the application.

Firstly, create the directory where you wish to store the application with all of its associated files and data.

Using a command line interface, you can create a new directory using the following command...
```
mkdir NAMEHERE
```

Next, you will need to install the application in to the directory you have just created.

To install the application in this directory you will need to unpack/unzip the contents of the UP863457.zip folder.

Once the contents have been unpacked in the correct directory you can move on to stage 3.

### 3. Setting up the Application

Finally, we will now be setting up the application.

**Step 1. Getting Dependencies**

In the directory you have installed the application in, run the following command.

```
npm install
```

This command will install the packages and dependencies required to run the application.

**Step 2. Running the Setup**

Before reading further, if your username and password is not 'root' for the MariaDB software then you will need to amend these details in the **package.json** file, on line 8, and the **config.js** file, on lines 14 and 15.

In the directory you have installed the application in, run the following command.

```
npm run setup
```

This command will log in to the MariaDB software you have using the username 'root' and the password 'root', unless amended. Then it will generate a database called "pudhub_DB" inside the MariaDB software that is installed on the system. This database will contain all the necessary tables and records required for the application to work.

**Step 3. Starting the Application**

Next, we need to start the application.

To do so navigate to the directory in which the application is installed using your command line and run the following...

```
npm start
```

You should then see the following...

```
P.U.D hub started on port 8080
```

...which means that the application is running on port 8080.

**Step 4. Accessing the Application**

Finally, the application has two main ways of accessing it.

If you wish to access the Dashboard of the application where you can customise and manage unattended displays then go to...

```
localhost:8080/dashboard
```

If you wish to connect a display to the network as an unattended display then go to...
```
localhost:8080/
```

**OR**

```
localhost:8080/display
```
