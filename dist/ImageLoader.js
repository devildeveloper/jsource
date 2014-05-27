/*!
 *
 * Adapted from https://gist.github.com/paulirish/1579671 which derived from 
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 * 
 * requestAnimationFrame polyfill by Erik Möller.
 * Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon
 * 
 * MIT license
 *
 * @raf
 *
 */
(function ( window ) {

"use strict";

if ( !Date.now ) {
    Date.now = function () {
        return new Date().getTime();
    };
}

(function() {
    var vendors = ["webkit", "moz", "ms", "o"];

    for ( var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i ) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp + "RequestAnimationFrame"];
        window.cancelAnimationFrame = (window[vp + "CancelAnimationFrame"] || window[vp + "CancelRequestAnimationFrame"]);
    }

    if ( /iP(ad|hone|od).*OS 6/.test( window.navigator.userAgent ) || !window.requestAnimationFrame || !window.cancelAnimationFrame ) {
        var lastTime = 0;

        window.requestAnimationFrame = function ( callback ) {
            var now = Date.now(),
                nextTime = Math.max( lastTime + 16, now );

            return setTimeout(function() {
                callback( lastTime = nextTime );

            }, (nextTime - now) );
        };

        window.cancelAnimationFrame = clearTimeout;
    }
}());

})( window );
/*!
 *
 * Handle lazy-loading images with unique callback conditions
 *
 * @ImageLoader
 * @author: kitajchuk
 *
 *
 */
(function ( $ ) {


"use strict";


var _i,
    _all = 0,
    _num = 0,
    _raf = null,
    _ini = false,
    _instances = [];


// Break on no $
if ( !$ ) {
    throw new Error( "ImageLoader Class requires jQuery, ender, Zepto or something like that..." );
}


// Should support elements as null, undefined, jquery/ender/zepto object, string selector
function setElements( elements ) {
    // Allow null, undefined to be set
    // Check right away if this is a jQuery object
    if ( !elements || elements.jquery ) {
        return elements;
    }

    // Handles string selector
    if ( typeof elements === "string" ) {
        elements = $( elements );

    // Handles objects that don't have the framework methods we need
    } else if ( !("addClass" in elements) && !("removeClass" in elements) && !("attr" in elements) && !("not" in elements) ) {
        elements = $( elements );
    }

    return elements;
}


// Called when instances are created
function initializer( instance ) {
    // Increment ALL
    _all = _all + instance._num2Load;

    // Private instances array
    _instances.push( instance );

    // One stop shopping
    if ( !_ini ) {
        _ini = true;
        animate();
    }
}


function animate() {
    if ( _num !== _all ) {
        _raf = window.requestAnimationFrame( animate );

        for ( _i = _instances.length; _i--; ) {
            if ( _instances[ _i ]._numLoaded !== _instances[ _i ]._num2Load ) {
                _instances[ _i ].handle();
            }
        }

    } else {
        window.cancelAnimationFrame( _raf );

        _raf = null;
        _ini = false;
    }
}


/**
 *
 * Handle lazy-loading images with unique callback conditions
 * @memberof! <global>
 * @requires raf
 * @constructor ImageLoader
 * @param {object} options Controller settings
 * <ul>
 * <li>elements - The collection of elements to load against</li>
 * <li>attribute - The property to pull the image source from</li>
 * <li>transitionDelay - The timeout before transition starts</li>
 * <li>transitionDuration - The length of the animation</li>
 * </ul>
 *
 */
var ImageLoader = function () {
    return this.init.apply( this, arguments );
};


/**
 *
 * ClassName for the element loading state
 * @member IS_LOADING
 * @memberof ImageLoader
 *
 */
ImageLoader.IS_LOADING = "-is-lazy-loading";


/**
 *
 * ClassName for the element transitioning state
 * @member IS_TRANSITION
 * @memberof ImageLoader
 *
 */
ImageLoader.IS_TRANSITION = "-is-lazy-transition";


/**
 *
 * ClassName for the elements loaded state
 * @member IS_LOADED
 * @memberof ImageLoader
 *
 */
ImageLoader.IS_LOADED = "-is-lazy-loaded";


/**
 *
 * ClassName to define the element as having been loaded
 * @member IS_HANDLED
 * @memberof ImageLoader
 *
 */
ImageLoader.IS_HANDLED = "-is-lazy-handled";


ImageLoader.prototype = {
    constructor: ImageLoader,

    init: function ( options ) {
        var self = this;

        if ( !options ) {
            throw new Error( "ImageLoader Class requires options to be passed" );
        }

        /**
         *
         * The Collection to load against
         * @memberof ImageLoader
         * @member _elements
         * @private
         *
         */
        this._elements = setElements( options.elements );

        /**
         *
         * The property to get image source from
         * @memberof ImageLoader
         * @member _property
         * @private
         *
         */
        this._property = (options.property || "data-src");

        /**
         *
         * The current amount of elements lazy loaded
         * @memberof ImageLoader
         * @member _numLoaded
         * @private
         *
         */
        this._numLoaded = 0;

        /**
         *
         * The total amount of elements to lazy load
         * @memberof ImageLoader
         * @member _num2Load
         * @private
         *
         */
        this._num2Load = (this._elements ? this._elements.length : 0);

        /**
         *
         * The delay to execute lazy loading on an element in ms
         * @memberof ImageLoader
         * @member _transitionDelay
         * @default 100
         * @private
         *
         */
        this._transitionDelay = (options.transitionDelay || 100);

        /**
         *
         * The duration on a lazy loaded elements fade in in ms
         * @memberof ImageLoader
         * @member _transitionDuration
         * @default 600
         * @private
         *
         */
        this._transitionDuration = (options.transitionDuration || 600);

        /**
         *
         * This flags that all elements have been loaded
         * @memberof ImageLoader
         * @member _resolved
         * @private
         *
         */
        this._resolved = false;

        /**
         *
         * Defined event namespaced handlers
         * @memberof ImageLoader
         * @member _handlers
         * @private
         *
         */
        this._handlers = {
            handle: null,
            update: null,
            done: null
        };
    
        initializer( this );
    },
    
    /**
     *
     * Add a callback handler for the specified event name
     * @memberof ImageLoader
     * @method on
     * @param {string} event The event name to listen for
     * @param {function} handler The handler callback to be fired
     *
     */
    on: function ( event, handler ) {
        this._handlers[ event ] = handler;

        return this;
    },
    
    /**
     *
     * Fire the given event for the loaded element
     * @memberof ImageLoader
     * @method fire
     * @returns bool
     *
     */
    fire: function ( event, element ) {
        var ret = false;

        if ( typeof this._handlers[ event ] === "function" ) {
            ret = this._handlers[ event ].call( this, element );
        }

        return ret;
    },

    /**
     *
     * Iterate over elements and fire the update handler
     * @memberof ImageLoader
     * @method update
     *
     * @fires update
     *
     */
    update: function () {
        var self = this;

        this._elements.each(function () {
            var $this = $( this );

            self.fire( "update", $this );
        });
    },
    
    /**
     *
     * Perform the image loading and set correct values on element
     * @method load
     * @memberof ImageLoader
     * @param {object} $elem element object
     * @param {function} callback optional callback for each load
     *
     * @fires done
     *
     */
    load: function ( element, callback ) {
        var self = this,
            image = null,
            timeout = null,
            isImage = element.is( "img" ),
            source = element.attr( this._property );

        element.addClass( ImageLoader.IS_LOADING );

        if ( isImage ) {
            image = element[ 0 ];

        } else {
            image = new Image();
        }

        timeout = setTimeout(function () {
            clearTimeout( timeout );

            element.addClass( ImageLoader.IS_TRANSITION );

            image.onload = function () {
                if ( !isImage ) {
                    image = null;

                    element.css( "background-image", "url(" + source + ")" );
                }

                element.addClass( ImageLoader.IS_LOADED );

                timeout = setTimeout(function () {
                    clearTimeout( timeout );

                    element.removeClass( ImageLoader.IS_LOADING + " " + ImageLoader.IS_TRANSITION + " " + ImageLoader.IS_LOADED ).addClass( ImageLoader.IS_HANDLED );

                    if ( (self._numLoaded === self._num2Load) && !self._resolved ) {
                        self._resolved = true;

                        // Fires the predefined "done" event
                        self.fire( "done" );

                    } else if ( typeof callback === "function" ) {
                        // Errors first
                        callback( false );
                    }

                }, self._transitionDuration );
            };

            image.onerror = function () {
                if ( (self._numLoaded === self._num2Load) && !self._resolved ) {
                    self._resolved = true;

                    // Fires the predefined "done" event
                    self.fire( "done" );

                } else if ( typeof callback === "function" ) {
                    // Errors first
                    callback( true );
                }
            };

            image.src = source;

        }, this._transitionDelay );

        return this;
    },

    /**
     *
     * Handles element iterations and loading based on callbacks
     * @memberof ImageLoader
     * @method handle
     *
     * @fires handle
     *
     */
    handle: function () {
        var self = this;

        this._elements.not( "." + ImageLoader.IS_HANDLED + ", ." + ImageLoader.IS_LOADING ).each(function () {
            var $this = $( this );

            // Fires the predefined "handle" event
            if ( self.fire( "handle", $this ) ) {
                _num++;

                self._numLoaded++;

                self.load( $this );
            }
        });
    }
};


// Expose
window.ImageLoader = ImageLoader;


})( (window.jQuery || window.ender || window.Zepto) );