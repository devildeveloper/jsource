/*!
 *
 * App Util: app.util.throttle
 *
 * A handy way to put a rev limiter on your event callbacks
 *
 * @usage: el.addEventListener( "keyup", app.util.throttle( delay, cb ), false )
 *
 *
 */
(function ( window, app, undefined ) {


"use strict";


/******************************************************************************
 * App Extensions
*******************************************************************************/
app.util.throttle = function ( delay, callback ) {
	var timeout = null;
	
	return function () {
		var context = this,
			args = arguments;
		
		clearTimeout( timeout );
		
		timeout = setTimeout(function () {
			if ( typeof callback === "function" ) {
				callback.apply( context, args );
			}
			
		}, delay );
	};
};


})( window, window.app );