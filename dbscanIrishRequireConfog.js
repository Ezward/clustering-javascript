
//
// bootstrap the project using requirejs
//
// modules load by default from /lib folder.
// application files (those that start with './') load from /src/main/js
//
requirejs.config({
    baseUrl: 'lib',             // look in /lib first 
    paths: {
        app: '../src/main/js'   // then look in our own js folder
    }
});

// load the application.
requirejs(['app/dbscanIrisMain']);
