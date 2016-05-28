Mobil Policy App
=================

This repository contains an AngularJS App.

Used technologies for development:

* JS Framework: AngularJS
* CSS Preprocessor: Stylus
* Build System: Gulp

# Installation instructions

First make sure Gulp is globally installed, by running:

    npm install -g gulp

After cloning the project, run the following command:

    npm start
    
This command will install all needed npm packages, bower components and start the development server with live reload.
The development version will be created in 'dev' folder. The App will be opened automatically in your
browser and should be available at the following url:

[http://localhost:8000/dev/index.html](http://localhost:8000/dev/index.html)

If you'd like to re-build development version (for any reason), please clean the 'dev' folder
before this (it prevents unnecessary gulp errors) by running:

    gulp clean

Production version will be created after running the following command:

    gulp prod

Before re-build of production version again it is necessary to clean 'prod' folder. Just launch:

    gulp clean-prod