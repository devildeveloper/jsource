/*!
 *
 * Window scroll event controller
 *
 * @Scroller
 * @author: kitajchuk
 *
 *
 */
(function ( window, undefined ) {


"use strict";


// Current scroll position
var _currentY = null,

    // Singleton
    _instance = null;

/**
 *
 * Window scroll event controller
 * @constructor Scroller
 * @requires Controller
 * @memberof! <global>
 *
 */
var Scroller = function () {
    // Singleton
    if ( !_instance ) {
        _instance = this;

        // Call on parent cycle
        this.go(function () {
            var currentY = _instance.getScrollY(),
                isStill = (currentY === _currentY),
                isScroll = (currentY !== _currentY),
                isScrollUp = (currentY < _currentY),
                isScrollDown = (currentY > _currentY),
                isScrollMax = (currentY !== _currentY && _instance.isScrollMax()),
                isScrollMin = (currentY !== _currentY && _instance.isScrollMin());

            // Fire blanket scroll event
            if ( isScroll ) {
                _instance.fire( "scroll" );
            }

            // Fire scrollup and scrolldown
            if ( isScrollDown ) {
                _instance.fire( "scrolldown" );

            } else if ( isScrollUp ) {
                _instance.fire( "scrollup" );
            }

            // Fire scrollmax and scrollmin
            if ( isScrollMax ) {
                _instance.fire( "scrollmax" );

            } else if ( isScrollMin ) {
                _instance.fire( "scrollmin" );
            }

            _currentY = currentY;
        });
    }

    return _instance;
};

Scroller.prototype = new Controller();

Scroller.prototype.getScrollY = function () {
    return (window.scrollY || document.documentElement.scrollTop);
};

Scroller.prototype.isScrollMax = function () {
    return (this.getScrollY() >= (document.documentElement.offsetHeight - window.innerHeight));
};

Scroller.prototype.isScrollMin = function () {
    return (this.getScrollY() <= 0);
};


// Expose
window.Scroller = Scroller;


})( window );