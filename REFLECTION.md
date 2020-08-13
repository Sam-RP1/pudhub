# Reflection

## Contents

- **Designs Encountered**
- **Technologies Utilised**
- **Evaluation**

## Designs Encountered
Throughout the development of the P.U.D application I iterated through a number of designs. The design changes ranged from basic colour schemes, different layouts, font sizing's and the number of pages the application had. Each design change came as a result of analysing the applications interfaces in their entirety for how usable and accessible they would be for a diverse audience of users.
The final design used for the P.U.D application admins dashboard was primarily chosen due to how exceptionally well the interfaces could translate from large displays to small mobile displays whilst still retaining their full functionality, usability and accessibility. As well as exceeding in other areas too.

The final design has a colour scheme composed of three main colours. These colours are indigo(#621360), black(#212121) and white(#fff) with a gradient background. These colours were chosen due to how well they contrasted with each other. This contrast in turn not only made the application appealing to use and look at, but also made it modern and contemporary. The colours chosen allow text to be easily readable as the majority of the applications text content is black on a white background, enabling users with poorer sight to still use the application.

The applications final design incorporates any features and functionalities where possible to help accommodate users with conditions that may make the application more difficult to use. For example, all images have an alt tag attribute, buttons and icons are labelled with text and give visual feedback by having :hover stylings applied to them, text is most black on white backings.

The applications final layout was chosen, as mentioned, due to how well it resized to fit various devices that may be used to manage displays via the admins dashboard. The pages all contain some form of a column and row layout. While the columns and rows may change in size from interface to interface on the same display, they still maintain full usability and accessibility without compromising the applications functionality. This was achieved through using the flex suite of css styles and style properties with view width and view height to allow visual assets to resize and restructure fluidly when resolutions changed.

Overall, the final design used was a result of constant analysis on the interfaces with the criteria of needing to work on a wide range of display resolutions and be accessible by a diverse audience.


## Technologies Utilised
The P.U.D application makes use of a number of technologies. The technologies and a brief description of what they are used for is listed below...

- express:
The express web application framework has been used in developing the server for the P.U.D application to run on. Express was used for the development of the server as it is very minimalistic framework that is very easy to utilise while not obscuring any basic Node.js features that may have been required. The server developed handles all of the requests made to the P.U.D application and the responses given.

- body-parser:
The body-parser Node.js middleware package has been used for parsing incoming request bodies from connected clients that are not large multipart bodies, but are instead JSON, raw, text or url-encoded bodies. This has allowed the P.U.D server to parse incoming requests using req.body, meaning the code developed and implemented is shorter and cleaner.

- multer:
The multer Node.js middleware package is used for handling multipart/form-data. In the P.U.D application it has been used to handle the uploading of media files on to the application. In the server.js "storage = multer.diskStorage({...})" has been defined on line 16, this specifies the destination of the of the uploaded file and the files name. On line 24 the variable "upload" has been set as "multer({ storage: storage })" which defines where to store the files upon receiving them. On line 128 of the server.js the media files uploaded are given to "upload.array('media')".

- fs:
The file system Node.js module is used in the creation, appending and deletion of files on the P.U.D application. This can be seen in the file "api-pages.js" on line 53 where a file is created and written to using "fs.writeFile". On line 108 of the same file you can see "fs.unlinkSync" is being used to delete a file from the P.U.D application.

- util
The util Node.js module is used to create "const readFile = util.promisfy(fs.readFile);" in the "config.js" file on line 8. This is then used to create write streams on lines 10 to 13. These write streams are used in the functions for logging server information and errors, as seen on lines 29 to 32 of "config.js".

- mysql2
The mysql2 package is used for connecting the P.U.D application server to the MariaDB database where the applications information is stored for the displays, pages, styles, scripts and medias. This can be seen throughout the "mysql-model.js" file, specifically on lines 6 and 9 where the package is required and the database connection is created.


## Evaluation
While the P.U.D application has met most of what I initially set out to achieve when developing it, there have been a few areas identified in which it could definitely be improved upon with further development. Starting with the good, the P.U.D application does currently have a very simple, easy to understand and remember API which allows users to easily access information stored on the application. The applications design is minimalistic with bold contrasting colours that allow the application to be used and accessed by a diverse audience. The applications font is sized and coloured appropriately with icons and buttons giving visual feedback by either scaling in size or changing colour shades when hovered upon. This allows a diverse audience of users to navigate and utilise the application confidently without double questioning themselves. The application has an extensive amount of fully working features that offer the end user a number of ways to create and manage unattended displays with their own freedom.
However, the application does lack in certain areas of usability. Currently there is not a "Basic" and "Advanced" mode switch that can be toggled to allow users to swap between drop down menus with drag and drop options for creating the unattended displays rather than being forced to use the current text editor feature provided. Further more, if users were to have a large number of files and they wanted to sort them by character, date created or search box there is not a way of doing that currently. This makes it difficult to locate files when users have a vast number of them, thus wasting their time. Lastly, there is minimal feedback given to a user when a mistake or error occurs from their input. This may mean users could become easily confused if they repeat the same action a number of times and do not get the expected result. Fortunately, there is a minimal number of situations like this that could or can occur due to the scale of the application being small.
With further time and development these issues and flaws could be fixed and improved upon, which would result in a far more polished product.
