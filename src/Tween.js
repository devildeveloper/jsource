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


var defaults = {
    ease: Easing.swing,
    duration: 600,
    from: 0,
    to: 0,
    delay: 0
};


/**
 *
 * Tween function
 * @constructor Tween
 * @requires raf
 * @requires Easing
 * @param {object} options Tween animation settings
 * <ul>
 * <li>duration - How long the tween will last</li>
 * <li>from - Where to start the tween</li>
 * <li>to - When to end the tween</li>
 * <li>update - The callback on each iteration</li>
 * <li>complete - The callback on end of animation</li>
 * <li>ease - The easing function to use</li>
 * <li>delay - How long to wait before animation</li>
 * </ul>
 * @memberof! <global>
 *
 */
var Tween = function ( options ) {
    // Normalize options
    options = (options || {});

    // Normalize options
    for ( var i in options ) {
        if ( typeof defaults[ i ] !== undefined ) {
            options[ i ] = ( typeof options[ i ] !== undefined ) ? options[ i ] : defaults[ i ];
        }
    }

    var tweenDiff = (options.to - options.from),
        startTime,
        rafTimer;

    function animate() {
        var animDiff = (Date.now() - startTime),
            tweenTo = (tweenDiff * options.ease( animDiff / options.duration )) + options.from;

        if ( animDiff > options.duration ) {
            if ( typeof options.complete === "function" ) {
                options.complete( options.to );
            }

            cancelAnimationFrame( rafTimer );

            rafTimer = null;

            return false;
        }

        if ( typeof options.update === "function" ) {
            options.update( tweenTo );
        }

        rafTimer = requestAnimationFrame( animate );
    }

    setTimeout(function () {
        startTime = Date.now();
        animate();

    }, options.delay );
};


// Expose
window.Tween = Tween;


})( window );