/*!
 *
 * App Util: util.log
 *
 * Simple wrapper for console logging
 *
 *
 */
(function ( window, app, undefined ) {


"use strict";


/******************************************************************************
 * Console fallback
*******************************************************************************/
window.console = window.console || {};
window.console.log = window.console.log || function () {};


/******************************************************************************
 * App Extensions
*******************************************************************************/
app.util = app.core.extend( app.util, {
	log: function () {
		var args = [].slice.call( arguments, 0 );
		
		if ( !args.length ) {
			args.push( app );
			
		} else {
			args.unshift( "[Appjs]:" );
		}
		
		console.log.apply( console, args );
	}
});


})( window, window.app );