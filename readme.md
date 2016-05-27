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
    
Production version will be created after running the following command:

    gulp prod

