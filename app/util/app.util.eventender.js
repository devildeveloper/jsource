/*!
 *
 * App Util: util.eventender
 *
 * The ender of all events, or just for Window
 * events that don't have a proper onend handler
 *
 * @usage: var ender = app.util.eventender( "scroll", 300, cb )
 * @usage: ender.teardown();
 *
 *
 * @dependency: app.core.Class
 * @dependency: app.util.throttle
 *
 *
 */
(function ( window, app, undefined ) {


"use strict";


// Keep track of handlers so we can tear them down
var _enders = {},
	
	EventEnder = app.core.Class.extend({
		init: function ( event, delay, callback ) {
			var ender = this,
				timeout,
				handler;
			
			// Store some props yo
			this.event = event;
			this.delay = delay;
			this.handler = callback;
			this.timestamp = +new Date();
			
			// Keep handler private
			_enders[ this.timestamp ] = handler = app.util.throttle( delay, function () {
				if ( typeof callback === "function" ) {
					callback();
				}
			});
			
			// Figure out how we can bind the event
			if ( window.addEventListener ) {
				window.addEventListener( event, handler, false );
				
			} else if ( window.attachEvent ) {
				event = "on"+event;
				
				window.attachEvent( event, handler );
				
			} else {
				event = "on"+event;
				
				window[ event ] = handler;
			}
			
			// In case we had to add the "on"
			this.event = event;
		},
		
		teardown: function () {
			if ( window.removeEventListener ) {
				window.removeEventListener( this.event, _enders[ this.timestamp ], false );
				
			} else if ( window.detachEvent ) {
				window.detachEvent( this.event, _enders[ this.timestamp ] );
				
			} else {
				window[ this.event ] = _enders[ this.timestamp ] = null;
			}
			
			// Completely remove the handler reference
			delete _enders[ this.timestamp ];
		}
	});


/******************************************************************************
 * App Extensions
*******************************************************************************/
app.util = app.core.extend( app.util, {
	// Supports event = "scroll"
	// Supports event = "resize"
	eventender: function ( event, delay, callback ) {
		return new EventEnder( event, delay, callback );
	}
});


})( window, window.app );