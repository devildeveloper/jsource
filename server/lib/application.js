/*
 * grunt-nautilus-test express app
 * https://github.com/kitajchuk/grunt-nautilus
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 */
(function ( exports ) {

var express = require( "express" ),

    app = express(),
    
    path = require( "path" );

app.configure(function () {
    app.use( app.router );
    app.use( express.static( path.join( __dirname, "../../" ) ) );
});

app.set( "port", 5050 );

exports.application = app;

})( exports );