/*!
 *
 * App Util: app.util.eventender
 *
 * The ender of all events, or just for Window
 * events that don't have a proper onend handler
 *
 * @usage: var ender = app.util.eventender( "scroll", 300, cb )
 * @usage: ender.teardown();
 *
 *
 * @dependency: app.core.Class
 * @dependency: app.core.Evenger
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
            // Store some props yo
            this.delay = delay;
            this.eventName = event;
            
            this.Event = app.core.Evenger( this.event, window, app.util.throttle( this.delay, function () {
                if ( typeof callback === "function" ) {
                    callback();
                }
            }));
        },
        
        teardown: function () {
            this.Event.teardown();
            
            return this;
        }
    });


/******************************************************************************
 * App Extensions
*******************************************************************************/
// Supports event = "scroll"
// Supports event = "resize"
app.util.eventender = function ( event, delay, callback ) {
    return new EventEnder( event, delay, callback );
};


})( window, window.app );