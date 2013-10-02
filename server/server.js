/*
 * Basic Node.js Server
 *
 * Copyright (c) 2013 Brandon Kitajchuk
 * Licensed under the MIT license.
 *
 */

(function () {

var _app = require( "./lib/application" ).application,
	_server = require( "http" ).Server( _app ).listen( _app.get( "port" ) ),
	_router = require( "./lib/routing" ).router( _app );

})();