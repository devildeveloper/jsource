/*!
 *
 * Window resize / orientationchange event controller
 *
 * @Resizer
 * @author: kitajchuk
 *
 *
 */
(function ( window, undefined ) {


"use strict";


// Break on no Controller
if ( !window.Controller ) {
    throw new Error( "Resizer Class requires Controller Class" );
}


// Current window viewport
var _currentView = {
        width: null,
        height: null,
        orient: null
    },

    // Singleton
    _instance = null;

/**
 *
 * Window resize / orientationchange event controller
 * @constructor Resizer
 * @memberof! <global>
 *
 */
var Resizer = function () {
    // Singleton
    if ( !_instance ) {
        _instance = this;

        // Call on parent cycle
        this.go(function () {
            var currentView = _instance.getViewport(),
                isStill = (currentView.width === _currentView.width && currentView.height === _currentView.height),
                isResize = (currentView.width !== _currentView.width || currentView.height !== _currentView.height),
                isResizeUp = (currentView.width > _currentView.width || currentView.height > _currentView.height),
                isResizeDown = (currentView.width < _currentView.width || currentView.height < _currentView.height),
                isOrientation = (currentView.orient !== _currentView.orient),
                isOrientationPortrait = (currentView.orient !== _currentView.orient && currentView.orient !== 90),
                isOrientationLandscape = (currentView.orient !== _currentView.orient && currentView.orient === 90);

            // Fire blanket resize event
            if ( isResize ) {
                _instance.fire( "resize" );
            }

            // Fire resizeup and resizedown
            if ( isResizeDown ) {
                _instance.fire( "resizedown" );

            } else if ( isResizeUp ) {
                _instance.fire( "resizeup" );
            }

            // Fire blanket orientationchange event
            if ( isOrientation ) {
                _instance.fire( "orientationchange" );
            }

            // Fire orientationportrait and orientationlandscape
            if ( isOrientationPortrait ) {
                _instance.fire( "orientationportrait" );

            } else if ( isOrientationLandscape ) {
                _instance.fire( "orientationlandscape" );
            }

            _currentView = currentView;
        });
    }

    return _instance;
};

Resizer.prototype = new Controller();

Resizer.prototype.getViewport = function () {
    return {
        width: window.innerWidth,
        height: window.innerHeight,
        orient: ("orientation" in window) ? Math.abs( window.orientation ) : null
    };
};


// Expose
window.Resizer = Resizer;


})( window );