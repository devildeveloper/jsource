/*!
 *
 * Window resize / orientationchange event controller
 *
 * @ResizeController
 * @author: kitajchuk
 *
 *
 */
(function ( Controller ) {


"use strict";


// Break on no Controller
if ( !Controller ) {
    throw new Error( "ResizeController Class requires Controller Class" );
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
 * @constructor ResizeController
 * @augments Controller
 * @requires Controller
 * @memberof! <global>
 *
 * @fires resize
 * @fires resizedown
 * @fires resizeup
 * @fires orientationchange
 * @fires orientationportrait
 * @fires orientationlandscape
 *
 */
var ResizeController = function () {
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
                /**
                 *
                 * @event resize
                 *
                 */
                _instance.fire( "resize" );
            }

            // Fire resizeup and resizedown
            if ( isResizeDown ) {
                /**
                 *
                 * @event resizedown
                 *
                 */
                _instance.fire( "resizedown" );

            } else if ( isResizeUp ) {
                /**
                 *
                 * @event resizeup
                 *
                 */
                _instance.fire( "resizeup" );
            }

            // Fire blanket orientationchange event
            if ( isOrientation ) {
                /**
                 *
                 * @event orientationchange
                 *
                 */
                _instance.fire( "orientationchange" );
            }

            // Fire orientationportrait and orientationlandscape
            if ( isOrientationPortrait ) {
                /**
                 *
                 * @event orientationportrait
                 *
                 */
                _instance.fire( "orientationportrait" );

            } else if ( isOrientationLandscape ) {
                /**
                 *
                 * @event orientationlandscape
                 *
                 */
                _instance.fire( "orientationlandscape" );
            }

            _currentView = currentView;
        });
    }

    return _instance;
};

ResizeController.prototype = new Controller();

/**
 *
 * Returns the current window viewport specs
 * @memberof ResizeController
 * @method getViewport
 * @returns object
 *
 */
ResizeController.prototype.getViewport = function () {
    return {
        width: window.innerWidth,
        height: window.innerHeight,
        orient: ("orientation" in window) ? Math.abs( window.orientation ) : null
    };
};


// Expose
window.ResizeController = ResizeController;


})( (window.Controller || window.funpack.Controller) );