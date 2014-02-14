/*!
 *
 * Throttle methods
 *
 * @throttle
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Limit method calls
 * @memberof! <global>
 * @method throttle
 * @param {number} threshold The timeout delay in ms
 * @param {function} callback The method handler
 *
 */
var throttle = function ( threshold, callback ) {
    var timeout = null;
    
    return function throttled() {
        var args = arguments,
            context = this;
        
        function delayed() {
            callback.apply( context, args );
            
            timeout = null;
        }
        
        if ( timeout ) {
            clearTimeout( timeout );
        }
        
        timeout = setTimeout( delayed, (threshold || 100) );
    };
};


// Expose
window.throttle = throttle;


})( window );