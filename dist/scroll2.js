/*!
 *
 * A simple tween class using requestAnimationFrame
 *
 * @Tween
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Tween function
 * @constructor Tween
 * @param {number} duration How long the tween will last
 * @param {number} from Where to start the tween
 * @param {number} to When to end the tween
 * @param {function} tween The callback on each iteration
 * @param {function} ease The easing function to use
 * @memberof! <global>
 *
 */
var Tween = function ( duration, from, to, tween, ease ) {
    console.log( arguments );
    
    ease = (ease || function ( t ) {
        return t;
    });
    
    var time = (duration || 1000),
        animDiff = (to - from),
        startTime = new Date(),
        timer;
    
    function animate() {
        var diff = new Date() - startTime,
            animTo = (animDiff * ease( diff / time )) + from;
        
        if ( diff > time ) {
            tween( to );
            cancelAnimationFrame( timer );
            timer = null;
            return false;
        }
        
        tween( animTo );
        timer = requestAnimationFrame( animate );
    }
    
    // Start the tween
    animate();
};


// Expose
window.Tween = Tween;


})( window );
/*!
 *
 * A basic scrollto function without all the fuss
 *
 * @scroll2
 * @author: kitajchuk
 * @require: Tween
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Window scroll2 function
 * @method scroll2
 * @param {number} to Where are we scrolling
 * @param {number} duration How long will it take
 * @param {function} ease The easing function to use
 * @param {function} callback The callback on complete
 * @memberof! <global>
 *
 */
var scroll2 = function ( to, duration, ease, callback ) {
    console.log( arguments );
    
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
window.scroll2 = scroll2;


})( window );