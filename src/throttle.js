/*!
 *
 * Throttle callbacks
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
 * @requires debounce
 * @memberof! <global>
 * @method throttle
 * @param {function} callback The method handler
 * @param {number} threshold The timeout delay in ms
 *
 */
var throttle = function ( callback, threshold ) {
    return debounce( callback, threshold );
};


// Expose
window.throttle = throttle;


})( window );