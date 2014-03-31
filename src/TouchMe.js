/*!
 *
 * A lightweight, singleton touch event api
 *
 * @TouchMe
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


// Singleton
var _instance = null;


/**
 *
 * A lightweight, singleton touch event api. Events:
 * <ul>
 * <li>touchmove</li>
 * <li>touchtap</li>
 * <li>touchdoubletap</li>
 * <li>touchpinch</li>
 * <li>touchpull</li>
 * <li>touchswipeleft</li>
 * <li>touchswiperight</li>
 * <li>touchswipeup</li>
 * <li>touchswipedown</li>
 * </ul>
 * @constructor TouchMe
 * @memberof! <global>
 *
 */
var TouchMe = function () {
    return (_instance || this.init.apply( this, arguments ));
};

TouchMe.prototype = {
    constructor: TouchMe,
    
    /**
     *
     * TouchMe init constructor method
     * @memberof TouchMe
     * @method TouchMe.init
     * @param {object} options Settings for event handling
     * <ul>
     * <li>preventDefault - boolean - default is true</li>
     * <li>preventMouseEvents - boolean - default is false</li>
     * <li>touchThreshold - milliseconds - default is 60</li>
     * <li>touchHoldThreshold - milliseconds - default is 300</li>
     * <li>touchPinchThreshold - number - default is 150</li>
     * <li>touchPullThreshold - number - default is 150</li>
     * <li>touchDoubleTapThreshold - number - default is 300</li>
     * </ul>
     *
     */
    init: function ( options ) {
        var self = this;
        
        _instance = this;
        
        /**
         *
         * TouchMe touches tracking object
         * @memberof TouchMe
         * @member TouchMe._touches
         *
         */
        this._touches = {};
        
        /**
         *
         * TouchMe timeout for tapping
         * @memberof TouchMe
         * @member TouchMe._tapTimeout
         *
         */
        this._tapTimeout = null;
        this._tapList = [];
        
        /**
         *
         * TouchMe gestures array
         * @memberof TouchMe
         * @member TouchMe._gestures
         *
         */
        this._gestures = [];
        
        /**
         *
         * TouchMe event handlers object
         * @memberof TouchMe
         * @member TouchMe._handlers
         *
         */
        this._handlers = {};
        
        /**
         *
         * TouchMe the last swipe registered
         * @memberof TouchMe
         * @member TouchMe._lastSwipe
         *
         */
        this._lastSwipe = "";
        
        /**
         *
         * TouchMe the last touch registered
         * @memberof TouchMe
         * @member TouchMe._lastTouch
         *
         */
        this._lastTouch = 0;
        
        /**
         *
         * TouchMe timestamp of when touchstart happened
         * @memberof TouchMe
         * @member TouchMe._tapStart
         *
         */
        this._tapStart = null;
        
        /**
         *
         * TouchMe window.scrollY at time of touchstart
         * @memberof TouchMe
         * @member TouchMe._windowScrollY
         *
         */
        this._windowScrollY = 0;
        
        /**
         *
         * TouchMe Flag if touch is happening
         * @memberof TouchMe
         * @member TouchMe._isTouchDown
         *
         */
        this._isTouchDown = false;
        
        /**
         *
         * TouchMe Origin distance on multitouchstart
         * @memberof TouchMe
         * @member TouchMe._multiOriginDistance
         *
         */
        this._multiOriginDistance = 0;
        
        /**
         *
         * TouchMe Store user options
         * @memberof TouchMe
         * @member TouchMe._options
         *
         */
        this._options = {
            preventDefault: true,
            preventMouseEvents: false,
            touchThreshold: 60,
            touchHoldThreshold: 300,
            touchPinchThreshold: 150,
            touchPullThreshold: 150,
            touchDoubleTapThreshold: 300
        };
        
        /**
         *
         * TouchMe unique ID
         * @memberof TouchMe
         * @member TouchMe._uid
         *
         */
        this._uid = 0;
        
        // Merge options with defaults
        for ( var i in this._options ) {
            if ( options && (typeof options[ i ] !== undefined) ) {
                this._options[ i ] = options[ i ];
            }
        }
        
        // Apply touch events
        document.addEventListener( "touchstart", function ( e ) { self._onTouchStart( this, e ); }, false );
        document.addEventListener( "touchmove", function ( e ) { self._onTouchMove( this, e ); }, false );
        document.addEventListener( "touchend", function ( e ) { self._onTouchEnd( this, e ); }, false );
        
        // Apply mouse events if we can
        if ( !this._options.preventMouseEvents ) {
            document.addEventListener( "mousedown", function ( e ) { self._onTouchStart( this, e ); }, false );
            document.addEventListener( "mousemove", function ( e ) { self._onTouchMove( this, e ); }, false );
            document.addEventListener( "mouseup", function ( e ) { self._onTouchEnd( this, e ); }, false );
        }
    },
    
    /**
     *
     * TouchMe add event handler
     * @memberof TouchMe
     * @method TouchMe.on
     * @param {string} event the gesture event to listen for
     * @param {string} selector the selector to match on event
     * @param {function} handler the handler to call
     *
     */
    on: function ( event, selector, handler ) {
        if ( typeof handler === "function" ) {
            if ( !this._handlers[ event ] ) {
                this._handlers[ event ] = [];
            }
            
            handler._touchmeID = this.getUID();
            handler._touchmeSelector = selector;
            handler._touchmeEvent = event;
            
            this._handlers[ event ].push( handler );
        }
    },
    
    /**
     *
     * TouchMe remove event handler
     * @memberof TouchMe
     * @method TouchMe.off
     * @param {string} event the gesture event to remove handler for
     * @param {function} handler the handler to remove
     *
     */
    off: function ( event, handler ) {
        if ( !this._handlers[ event ] ) {
            return this;
        }
        
        for ( var i = 0, len = this._handlers[ event ].length; i < len; i++ ) {
            if ( handler._touchmeID === this._handlers[ event ][ i ]._touchmeID ) {
                this._handlers[ event ].splice( i, 1 );
                
                break;
            }
        }
    },
    
    /**
     *
     * Get a unique ID
     * @memberof TouchMe
     * @method getUID
     * @returns number
     *
     */
    getUID: function () {
        this._uid = (this._uid + 1);
        
        return this._uid;
    },
    
    /**
     *
     * TouchMe get the swipe direction
     * @memberof TouchMe
     * @method TouchMe.getSwipe
     * @param {number} x1 the last x position
     * @param {number} x2 the current x position
     * @param {number} y1 the last y position
     * @param {number} y2 the current y position
     * @returns string
     *
     */
    getSwipe: function ( x1, x2, y1, y2 ){
        var xDelta = Math.abs( x1 - x2 ),
            yDelta = Math.abs( y1 - y2 ),
            ret;
        
        if ( xDelta >= yDelta ) {
            ret = (x1 - x2 > 0 ? "left" : "right");
            
        } else {
            ret = (y1 - y2 > 0 ? "up" : "down");
        }
        
        return ret;
    },
    
    /**
     *
     * TouchMe get the angle of swipe from touchstart point to current touchmove
     * @memberof TouchMe
     * @method TouchMe.getSwipeAngle
     * @param {number} x1 the last x position
     * @param {number} x2 the current x position
     * @param {number} y1 the last y position
     * @param {number} y2 the current y position
     * @returns string
     *
     */
    getSwipeAngle: function ( x1, x2, y1, y2 ) {
        var dy = y1 - y2,
            dx = x1 - x2,
            ret;
            
        ret = Math.atan2( dy, dx );
        ret *= 180 / Math.PI;
        
        return ret;
    },
    
    /**
     *
     * TouchMe get the distance between 2 touch points
     * @memberof TouchMe
     * @method TouchMe.getDistance
     * @param {number} t1 the first touch
     * @param {number} t2 the second touch
     * @returns number
     *
     */
    getDistance: function ( t1, t2 ) {
        var x = t1.pageX - t2.pageX,
            y = t1.pageY - t2.pageY;
        
        return Math.sqrt( (x * x) + (y * y) );
    },
    
    /**
     *
     * TouchMe determine if an event should fire
     * @memberof TouchMe
     * @method TouchMe.isDelegate
     * @param {object} e the event object
     * @param {string} selector the selector to match
     * @returns element OR null
     *
     */
    isDelegate: function ( e, selector ) {
        return this._matchElement( e.target, selector );
    },
    
    /**
     *
     * TouchMe determine an absolute angle is less than 45deg on horizontal axis
     * @memberof TouchMe
     * @method TouchMe.is45ish
     * @param {number} a the angle to calculate with
     *
     */
    is45ish: function ( a ) {
        a = Math.abs( a );
        
        // Less than a 45deg angle on horizontal axis
        return (
            (a < 180 && a > 135) ||
            (a > 0 && a < 45)
        );
    },
    
    /**
     *
     * TouchMe call handlers for a gesture event
     * @memberof TouchMe
     * @method TouchMe._call
     * @param {string} eventName the gesture event to fire
     * @param {object} eventElement the element that triggered the event
     * @param {object} eventObject the event object to pass along
     *
     */
    _call: function ( eventName, eventElement, eventObject ) {
        if ( !this._handlers[ eventName ] ) {
            return this;
        }
        
        for ( var i = this._handlers[ eventName ].length; i--; ) {
            var element = this.isDelegate( eventObject, this._handlers[ eventName ][ i ]._touchmeSelector );
            
            if ( element ) {
                this._handlers[ eventName ][ i ].call( element, eventObject );
                
            } else {
                //console.log( "[TouchMe] Target element did not match this selector" );
            }
        }
    },
    
    /**
     *
     * TouchMe look at all handlers and see if we should fire
     * @memberof TouchMe
     * @method TouchMe._isDelegated
     * @param {object} e the event object
     * @returns element OR null
     *
     */
    _isDelegated: function ( e ) {
        var ret = null;
        
        for ( var i in this._handlers ) {
            for ( var j = this._handlers[ i ].length; j--; ) {
                ret = this.isDelegate( e, this._handlers[ i ][ j ]._touchmeSelector );
                
                if ( ret ) {
                    break;
                }
            }
        }
        
        return ret;
    },
    
    /**
     *
     * TouchMe match an element to a selector
     * @memberof TouchMe
     * @method TouchMe._matchElement
     * @param {object} el the element
     * @param {string} selector the selector to match
     * @returns element OR null
     *
     */
    _matchElement: function ( el, selector ) {
        var method = ( el.matches ) ? "matches" : ( el.webkitMatchesSelector ) ? "webkitMatchesSelector" : ( el.mozMatchesSelector ) ? "mozMatchesSelector" : ( el.msMatchesSelector ) ? "msMatchesSelector" : ( el.oMatchesSelector ) ? "oMatchesSelector" : null;
        
        // Try testing the element agains the selector
        if ( method && el[ method ].call( el, selector ) ) {
            return el;
        
        // Keep walking up the DOM if we can    
        } else if ( el !== document.documentElement && el.parentNode ) {
            return this._matchElement( el.parentNode, selector );
        
        // Otherwise we should not execute an event    
        } else {
            return null;
        }
    },
    
    /**
     *
     * TouchMe handle the touchstart event
     * @memberof TouchMe
     * @method TouchMe._onTouchStart
     * @param {object} el the element that triggered the event
     * @param {object} e the event object passed in
     *
     */
    _onTouchStart: function ( el, e ) {
        this._isTouchDown = true;
        
        // Reset
        this._gestures = [];
        this._lastSwipe = "";
        
        // Get timestamp
        this._tapStart = Date.now();
        
        // Get current window scroll
        this._windowScrollY = window.scrollY;
        
        // Pass off to handle multi-touch
        if ( e.touches && e.touches.length > 1 ) {
            return this._onMultiTouchStart( el, e );
        }
        
        if ( e.touches ) {
            this._lastTouch = e.touches.length - 1;
            
            // Not modified from these values
            this._touches.x0 = e.touches[ this._lastTouch ].pageX;
            this._touches.y0 = e.touches[ this._lastTouch ].pageY;
            
            this._touches.x1 = e.touches[ this._lastTouch ].pageX;
            this._touches.y1 = e.touches[ this._lastTouch ].pageY;
            
        } else {
            this._lastTouch = 0;
            
            // Not modified from these values
            this._touches.x0 = e.pageX;
            this._touches.y0 = e.pageY;
            
            this._touches.x1 = e.pageX;
            this._touches.y1 = e.pageY;
        }
    },
    
    /**
     *
     * TouchMe handle the touchmove event
     * @memberof TouchMe
     * @method TouchMe._onTouchMove
     * @param {object} el the element that triggered the event
     * @param {object} e the event object passed in
     *
     */
    _onTouchMove: function ( el, e ) {
        // Like this could ever happen...
        if ( !this._isTouchDown ) {
            return;
        }
        
        // Pass off to handle multi-touch
        if ( e.touches && e.touches.length > 1 ) {
            return this._onMultiTouchMove( el, e );
        }
        
        var swipeAngle,
            currSwipe,
            distX,
            distY;
        
        if ( e.touches ) {
            this._touches.x2 = e.touches[ this._lastTouch ].pageX;
            this._touches.y2 = e.touches[ this._lastTouch ].pageY;
            
        } else {
            this._touches.x2 = e.pageX;
            this._touches.y2 = e.pageY;
        }
        
        distX = Math.abs( this._touches.x1 - this._touches.x2 );
        distY = Math.abs( this._touches.y1 - this._touches.y2 );
        
        swipeAngle = this.getSwipeAngle(
            this._touches.x0,
            this._touches.x2,
            this._touches.y0,
            this._touches.y2
        );
        
        // Disable document scroll if horizontal swiping
        // Accounts for currSwipe being either "left" or "right"
        // Accounts for matching the event element to bound event handlers
        // Accounts for ensuring we only ever do this when the angle of swipe is below 45deg
        // Accounts for the enabled option of preventDefault
        if ( (currSwipe === "left" || currSwipe === "right") && this._isDelegated( e ) && this.is45ish( swipeAngle ) && this._options.preventDefault ) {
            e.preventDefault();
        }
        
        if ( distX > this._options.touchThreshold || distY > this._options.touchThreshold ) {
            currSwipe = this.getSwipe(
                this._touches.x1,
                this._touches.x2,
                this._touches.y1,
                this._touches.y2
            );
            
            this._touches.x1 = this._touches.x2;
            this._touches.y1 = this._touches.y2;
            
            if ( currSwipe === this._lastSwipe ) {
                return;
            
            } else {
                this._lastSwipe = currSwipe;
                this._gestures.push( "swipe" + currSwipe );
            }
        }
        
        // Handle move event
        // This has to be called here as it is just the native touchmove
        this._call( "touchmove", el, e );
    },
    
    /**
     *
     * TouchMe handle the touchend event
     * @memberof TouchMe
     * @method TouchMe._onTouchEnd
     * @param {object} el the element that triggered the event
     * @param {object} e the event object passed in
     *
     */
    _onTouchEnd: function ( el, e ) {
        this._isTouchDown = false;
        
        // The handler that fires events
        var handler = function () {
            // Event gestures
            e.gestures = _instance._gestures;
            
            // Now loop over all gestures
            // Handle swipeleft, swiperight, swipeup, swipedown, pinch, pull, tap, doubletap
            for ( var i = 0, len = _instance._gestures.length; i < len; i++ ) {
                _instance._call( "touch" + _instance._gestures[ i ], el, e );
            }
        };
        
        // Always clear tap timeout
        try {
            clearTimeout( this._tapTimeout );
            
        } catch ( error ) {}
        
        // If no gestures, handle tapping
        // All other gestures are pushed elsewhere
        if ( !this._gestures.length ) {
            this._tapList.push({
                start: this._tapStart,
                ended: Date.now()
            });
            
            this._tapTimeout = setTimeout(function () {
                // 0.1 The duration is long enough to be considered a hold
                if ( (Date.now() - _instance._tapStart) >= _instance._options.touchHoldThreshold ) {
                    console.log( "cancel tap" );
                    
                    _instance._tapList = [];
                
                // 0.2 Another tap is pushed within required timeframe
                } else if ( _instance._tapList.length === 2 && (_instance._tapList[ 1 ].start - _instance._tapList[ 0 ].ended <= _instance._options.touchDoubleTapThreshold) ) {
                    // Only allow one doubletap per sequence...?
                    if ( _instance._gestures.indexOf( "doubletap" ) === -1 ) {
                        _instance._gestures.push( "doubletap" );
                    }
                    
                    _instance._tapList = [];
                    
                    handler();
                    
                // 0.3 Single tap within required timeframe    
                } else if ( _instance._tapList.length === 1 && (Date.now() - _instance._tapStart) >= _instance._options.touchThreshold ) {
                    // Only allow one tap per sequence...?
                    if ( _instance._gestures.indexOf( "tap" ) === -1 ) {
                        _instance._gestures.push( "tap" );
                    }
                    
                    _instance._tapList = [];
                    
                    handler();
                }
                
            }, this._options.touchThreshold );
        
        // Just call the handler     
        } else {
            handler();
        }
    },
    
    /**
     *
     * TouchMe handle multi-touch starts
     * @memberof TouchMe
     * @method TouchMe._onMultiTouchStart
     * @param {object} el the element that triggered the event
     * @param {object} e the event object passed in
     *
     */
    _onMultiTouchStart: function ( el, e ) {
        // 2 fingers pinch / pull
        if ( e.touches.length === 2 ) {
            this._multiOriginDistance = this.getDistance( e.touches[ 0 ], e.touches[ 1 ] );
        }
    },
    
    /**
     *
     * TouchMe handle multi-touch moves
     * @memberof TouchMe
     * @method TouchMe._onMultiTouchMove
     * @param {object} el the element that triggered the event
     * @param {object} e the event object passed in
     *
     */
    _onMultiTouchMove: function ( el, e ) {
        // 2 fingers pinch / pull
        if ( e.touches.length === 2 ) {
            var currDistance = this.getDistance( e.touches[ 0 ], e.touches[ 1 ] );
            
            // Pinching
            if ( currDistance < this._multiOriginDistance ) {
                var currPinch = Math.abs( this._multiOriginDistance - currDistance );
                
                if ( currPinch >= this._options.touchPinchThreshold ) {
                    // Only allow one pinch per sequence...?
                    if ( this._gestures.indexOf( "pinch" ) === -1 ) {
                        this._gestures.push( "pinch" );
                    }
                }
            
            // Pulling    
            } else {
                var currPull = Math.abs( currDistance - this._multiOriginDistance );
                
                if ( currPull >= this._options.touchPullThreshold ) {
                    // Only allow one pull per sequence...?
                    if ( this._gestures.indexOf( "pull" ) === -1 ) {
                        this._gestures.push( "pull" );
                    }
                }
            }
        }
    }
};


// Expose
window.TouchMe = TouchMe;


})( window );