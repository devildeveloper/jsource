/*!
 *
 * App Core: core.Evenger
 *
 * An event application Class
 *
 *
 * @dependency: app.core.Class
 *
 *
 */
(function ( window, app, undefined ) {


"use strict";


var _events = {},

	Evenger = app.core.Class.extend({
		init: function ( event, element, callback, delay ) {
			var handler;
			
			// Store some props yo
			this.element = element;
			this.event = event;
			this.timestamp = +new Date();
			
			// Keep handler private
			_events[ this.timestamp ] = handler = function () {
				if ( typeof callback === "function" ) {
					callback.apply( element, arguments );
				}
			};
			
			// Figure out how we can bind the event
			if ( this.element.addEventListener ) {
				this.element.addEventListener( this.event, handler, false );
				
			} else if ( element.attachEvent ) {
				this.event = "on"+event;
				
				this.element.attachEvent( this.event, handler );
				
			} else {
				this.event = "on"+event;
				
				this.element[ this.event ] = handler;
			}
		},
		
		teardown: function () {
			if ( this.element.removeEventListener ) {
				this.element.removeEventListener( this.event, _events[ this.timestamp ], false );
				
			} else if ( window.detachEvent ) {
				this.element.detachEvent( this.event, _events[ this.timestamp ] );
				
			} else {
				this.element[ this.event ] = _events[ this.timestamp ] = null;
			}
			
			// Completely remove the handler reference
			delete _events[ this.timestamp ];
		}
	});


/******************************************************************************
 * App Extensions
*******************************************************************************/
app.core = app.core.extend( app.core, {
	Evenger: function ( event, element, callback ) {
		return new Evenger( event, element, callback );
	}
});


})( window, window.app );