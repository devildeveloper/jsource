/*!
 *
 * A basic scrollto function without all the fuss
 *
 * @scrollTo
 * @author: kitajchuk
 * @require: Tween
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Window scrollTo function
 * @method scrollTo
 * @param {number} to Where are we scrolling
 * @param {number} duration How long will it take
 * @param {function} ease The easing function to use
 * @param {function} callback The callback on complete
 * @memberof! <global>
 *
 */
var scrollTo = function ( to, duration, ease, callback ) {
    var from = (window.scrollY || window.pageYOffset),
        hand = function ( t ) {
            window.scrollTo( 0, t );
            
            if ( t === to && typeof callback === "function" ) {
                callback();
            }
        };
    
    to = (to || 0);
    duration = (duration || 400);
    ease = (ease || function ( t ) {
        return t;
    });
    
    return new Tween( duration, from, to, hand, ease );
};


// Expose
window.scrollTo = scrollTo;


})( window );