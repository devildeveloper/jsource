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
 * </ul>
 * @memberof! <global>
 *
 */
var Tween = function ( options ) {
    // Normalize options
    options = (options || {});

    // Normalize easing method
    options.ease = (options.ease || Easing.swing);

    // Normalize duration
    options.duration = (options.duration || 600);

    // Normalize from
    options.from = (options.from || 0);

    // Normalize to
    options.to = (options.to || 0);
    
    var tweenDiff = (options.to - options.from),
        startTime = Date.now(),
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

    animate();
};


// Expose
window.Tween = Tween;


})( window );