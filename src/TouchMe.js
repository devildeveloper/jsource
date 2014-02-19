/*!
 *
 * A lightweight touch gesture event Class
 *
 * @TouchMe
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * A touch gesture event handler
 * @constructor TouchMe
 * @memberof! <global>
 *
 */
var TouchMe = function () {
    return this.init.apply( this, arguments );
};

TouchMe.prototype = {
    constructor: TouchMe,
    
    /**
     *
     * TouchMe touches tracking object
     * @memberof TouchMe
     * @member TouchMe._touches
     *
     */
    _touches: {},
    
    /**
     *
     * TouchMe gestures array
     * @memberof TouchMe
     * @member TouchMe._gestures
     *
     */
    _gestures: [],
    
    /**
     *
     * TouchMe event handlers object
     * @memberof TouchMe
     * @member TouchMe._handlers
     *
     */
    _handlers: {},
    
    /**
     *
     * TouchMe the last swipe registered
     * @memberof TouchMe
     * @member TouchMe._lastSwipe
     *
     */
    _lastSwipe: "",
    
    /**
     *
     * TouchMe the last touch registered
     * @memberof TouchMe
     * @member TouchMe._lastTouch
     *
     */
    _lastTouch: 0,
    
    /**
     *
     * TouchMe threshold within which to register gestures
     * @memberof TouchMe
     * @member TouchMe._threshold
     *
     */
    _threshold: 60,
    
    /**
     *
     * TouchMe timestamp of when touchstart happened
     * @memberof TouchMe
     * @member TouchMe._tapstart
     *
     */
    _tapstart: null,
    
    /**
     *
     * TouchMe window.scrollY at time of touchstart
     * @memberof TouchMe
     * @member TouchMe._windowScrollY
     *
     */
    _windowScrollY: 0,
    
    /**
     *
     * TouchMe Flag if touch is happening
     * @memberof TouchMe
     * @member TouchMe._isTouchDown
     *
     */
    _isTouchDown: false,
    
    /**
     *
     * TouchMe init constructor method
     * @memberof TouchMe
     * @method TouchMe.init
     *
     */
    init: function () {
        var self = this;
        
        document.addEventListener( "touchstart", function ( e ) { self._onTouchStart( e ); }, false );
        document.addEventListener( "mousedown", function ( e ) { self._onTouchStart( e ); }, false );
        
        document.addEventListener( "touchmove", function ( e ) { self._onTouchMove( e ); }, false );
        document.addEventListener( "mousemove", function ( e ) { self._onTouchMove( e ); }, false );
        
        document.addEventListener( "touchend", function ( e ) { self._onTouchEnd( e ); }, false );
        document.addEventListener( "mouseup", function ( e ) { self._onTouchEnd( e ); }, false );
    },
    
    /**
     *
     * TouchMe add event handler
     * @memberof TouchMe
     * @method TouchMe.on
     * @param {string} event the gesture event to listen for
     * @param {function} handler the handler to call
     *
     */
    on: function ( event, handler ) {
        if ( typeof handler === "function" ) {
            if ( !this._handlers[ event ] ) {
                this._handlers[ event ] = [];
            }
            
            handler._timestamp = Date.now();
            
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
        
        for ( var i = this._handlers[ event ].length; i--; ) {
            if ( handler._timestamp === this._handlers[ event ][ i ]._timestamp ) {
                this._handlers[ event ].splice( i, 1 );
                
                break;
            }
        }
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
     * TouchMe call handlers for a gesture event
     * @memberof TouchMe
     * @method TouchMe._call
     * @param {string} eventName the gesture event to fire
     * @param {object} eventObject the event object to pass along
     *
     */
    _call: function ( eventName, eventObject ) {
        if ( !this._handlers[ eventName ] ) {
            return this;
        }
        
        for ( var i = this._handlers[ eventName ].length; i--; ) {
            this._handlers[ eventName ][ i ].call( document, eventObject );
        }
    },
    
    /**
     *
     * TouchMe handle the touchstart event
     * @memberof TouchMe
     * @method TouchMe._onTouchStart
     * @param {object} e the event object passed in
     *
     */
    _onTouchStart: function ( e ) {
        this._isTouchDown = true;
        
        // Reset
        this._gestures = [];
        this._lastSwipe = "";
        
        // Get timestamp
        this._tapstart = Date.now();
        
        // Get current window scroll
        this._windowScrollY = window.scrollY;
        
        if ( e.touches ) {
            this._lastTouch = e.touches.length - 1;
            this._touches.x1 = e.touches[ this._lastTouch ].pageX;
            this._touches.y1 = e.touches[ this._lastTouch ].pageY;
            
        } else {
            this._lastTouch = 0;
            this._touches.x1 = e.pageX;
            this._touches.y1 = e.pageY;
        }
    },
    
    /**
     *
     * TouchMe handle the touchmove event
     * @memberof TouchMe
     * @method TouchMe._onTouchMove
     * @param {object} e the event object passed in
     *
     */
    _onTouchMove: function ( e ) {
        if ( !this._isTouchDown ) {
            return;
        }
        
        var currSwipe,
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
        
        if ( distX > this._threshold || distY > this._threshold ) {
            currSwipe = this.getSwipe(
                this._touches.x1,
                this._touches.x2,
                this._touches.y1,
                this._touches.y2
            );
            
            this._touches.x1 = this._touches.x2;
            this._touches.y1 = this._touches.y2;
            
            // Disable document scroll if horizontal swiping
            if ( currSwipe === "left" || currSwipe === "right" ) {
                e.preventDefault();
            }
            
            if ( currSwipe === this._lastSwipe ) {
                return;
            
            } else {
                this._lastSwipe = currSwipe;
                this._gestures.push( currSwipe );
            }
        }
    },
    
    /**
     *
     * TouchMe handle the touchend event
     * @memberof TouchMe
     * @method TouchMe._onTouchEnd
     * @param {object} e the event object passed in
     *
     */
    _onTouchEnd: function ( e ) {
        this._isTouchDown = false;
        
        var scroll = Math.abs( window.scrollY - this._windowScrollY ),
            now;
        
        // Handle tapping
        if ( !this._gestures.length && scroll < this._threshold ) {
            now = Date.now();
            
            if ( now - this._tapstart >= this._threshold ) {
                e.gestures = ["tap"];
                
                this._call( "swipetap", e );
            }
            
            this._tapstart = null;
        
        // Handle swiping    
        } else {
            for ( var i = 0, len = this._gestures.length; i < len; i++ ) {
                e.gestures = this._gestures;
                
                this._call( "swipe" + this._gestures[ i ], e );
            }
        }
    }
};


// Expose
window.TouchMe = TouchMe;


})( window );