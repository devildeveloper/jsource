/*!
 *
 * JSource Javascript
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Brandon Lee Kitajchuk
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
/*!
 *
 * A simple gamecycle engine
 *
 * @Blit
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


// Animation tracking
var raf = window.requestAnimationFrame,
    caf = window.cancelAnimationFrame;


/**
 *
 * A simple gamecycle engine
 * @constructor Blit
 * @memberof! <global>
 *
 */
var Blit = function () {
    return this.init.apply( this, arguments );
};

Blit.prototype = {
    constructor: Blit,
    
    /**
     *
     * Blit init constructor method
     * @memberof Blit
     * @method Blit.init
     * @param {object} options The gamecycle options
     * <ul>
     * <li>{number} options.fps</li>
     * <li>{boolean} options.paused</li>
     * <li>{function} options.blit</li>
     * </ul>
     *
     */
    init: function ( options ) {
        /**
         *
         * Time now in ms
         * @memberof Blit
         * @member Blit._now
         *
         */
        this._now = null;
        
        /**
         *
         * Time then in ms
         * @memberof Blit
         * @member Blit._then
         *
         */
        this._then = null;
        
        /**
         *
         * Diff between now and then
         * @memberof Blit
         * @member Blit._delta
         *
         */
        this._delta = null;
        
        /**
         *
         * Start time in ms
         * @memberof Blit
         * @member Blit._first
         *
         */
        this._first = null;
        
        /**
         *
         * Elapsed time in ms
         * @memberof Blit
         * @member Blit._time
         *
         */
        this._time = null;
        
        /**
         *
         * Current frame
         * @memberof Blit
         * @member Blit._frame
         *
         */
        this._frame = 0;
        
        /**
         *
         * Timeout reference
         * @memberof Blit
         * @member Blit._timeout
         *
         */
        this._cycle = null;
        
        /**
         *
         * Started iteration flag
         * @memberof Blit
         * @member Blit._started
         *
         */
        this._started = false;
        
        /**
         *
         * FPS defaults to 60fps
         * @memberof Blit
         * @member Blit._fps
         *
         */
        this._fps = (options.fps || 60);
        
        /**
         *
         * Timer interval based on FPS
         * @memberof Blit
         * @member Blit._interval
         *
         */
        this._interval = (1000 / this._fps);
        
        /**
         *
         * Frame rate callback
         * @memberof Blit
         * @member Blit._blit
         *
         */
        this._blit = (options.blit || null);
        
        /**
         *
         * Paused flag
         * @memberof Blit
         * @member Blit._paused
         *
         */
        this._paused = (options.paused || false);
        
        // Start if we can
        if ( !this._started && !this._paused ) {
            this.start();
        }
    },
    
    /**
     *
     * Apply the blit callback
     * @memberof Blit
     * @method Blit.blit
     * @param {function} fn The callback to fire
     *
     */
    blit: function ( fn ) {
        if ( typeof fn === "function" ) {
            this._blit = fn;
        }
        
        return this;
    },
    
    /**
     *
     * Pause the gamecycle
     * @memberof Blit
     * @method Blit.pause
     *
     */
    pause: function () {
        this._paused = true;
        
        return this;
    },
    
    /**
     *
     * Play the gamecycle
     * @memberof Blit
     * @method Blit.play
     *
     */
    play: function () {
        this._paused = false;
        
        return this;
    },
    
    /**
     *
     * Start the gamecycle
     * @memberof Blit
     * @method Blit.start
     *
     */
    start: function () {
        if ( this._started ) {
            return this;
        }
        
        this._paused = false;
        this._blitInit();
        
        return this;
    },
    
    /**
     *
     * Stop the gamecycle
     * @memberof Blit
     * @method Blit.stop
     *
     */
    stop: function () {
        caf( this._cycle );
        
        this._started = false;
        this._cycle = null;
        
        return this;
    },
    
    /**
     *
     * Initialize the gamecycle loop
     * @memberof Blit
     * @method Blit._blitInit
     *
     */
    _blitInit: function () {
        if ( this._started ) {
            return this;
        }
        
        this._started = true;
        this._then = Date.now();
        this._first = this._then;
        
        var self = this,
            blit = function () {
                self._cycle = raf( blit );
                self._now = Date.now();
                self._delta = self._now - self._then;
                
                if ( self._delta > self._interval ) {
                    if ( !self._paused ) {
                        self._frame++;
                        self._then = self._now - (self._delta % self._interval);
                        self._time = (self._then - self._first);
                        
                        if ( typeof self._blit === "function" ) {
                            self._blit( self._frame );
                        }
                    }
                }
            };
        
        blit();
    }
};


// Expose
window.Blit = Blit;


})( window );
/*!
 *
 * Event / Animation cycle manager
 *
 * var MyController = function () {};
 * MyController.prototype = new Controller();
 *
 * @Controller
 * @author: kitajchuk
 *
 *
 */
(function ( window, undefined ) {


"use strict";


// Private animation functions
var raf = window.requestAnimationFrame,
    caf = window.cancelAnimationFrame;


/**
 *
 * Event / Animation cycle manager
 * @constructor Controller
 * @requires raf
 * @memberof! <global>
 *
 */
var Controller = function () {
    return this.init.apply( this, arguments );
};

Controller.prototype = {
    constructor: Controller,

    /**
     *
     * Controller constructor method
     * @memberof Controller
     * @method Controller.init
     *
     */
    init: function () {
        /**
         *
         * Controller event handlers object
         * @memberof Controller
         * @member _handlers
         * @private
         *
         */
        this._handlers = {};

        /**
         *
         * Controller unique ID
         * @memberof Controller
         * @member _uid
         * @private
         *
         */
        this._uid = 0;

        /**
         *
         * Started iteration flag
         * @memberof Controller
         * @member _started
         * @private
         *
         */
        this._started = false;

        /**
         *
         * Paused flag
         * @memberof Controller
         * @member _paused
         * @private
         *
         */
        this._paused = false;

        /**
         *
         * Timeout reference
         * @memberof Controller
         * @member _cycle
         * @private
         *
         */
        this._cycle = null;
    },

    /**
     *
     * Controller go method to start frames
     * @memberof Controller
     * @method go
     *
     */
    go: function ( fn ) {
        if ( this._started && this._cycle ) {
            return this;
        }

        this._started = true;

        var self = this,
            anim = function () {
                self._cycle = raf( anim );

                if ( self._started ) {
                    if ( typeof fn === "function" ) {
                        fn();
                    }
                }
            };

        anim();
    },

    /**
     *
     * Pause the cycle
     * @memberof Controller
     * @method pause
     *
     */
    pause: function () {
        this._paused = true;

        return this;
    },

    /**
     *
     * Play the cycle
     * @memberof Controller
     * @method play
     *
     */
    play: function () {
        this._paused = false;

        return this;
    },

    /**
     *
     * Stop the cycle
     * @memberof Controller
     * @method stop
     *
     */
    stop: function () {
        caf( this._cycle );

        this._paused = false;
        this._started = false;
        this._cycle = null;

        return this;
    },

    /**
     *
     * Controller add event handler
     * @memberof Controller
     * @method on
     * @param {string} event the event to listen for
     * @param {function} handler the handler to call
     *
     */
    on: function ( event, handler ) {
        var events = event.split( " " );

        // One unique ID per handler
        handler._jsControllerID = this.getUID();

        for ( var i = events.length; i--; ) {
            if ( typeof handler === "function" ) {
                if ( !this._handlers[ events[ i ] ] ) {
                    this._handlers[ events[ i ] ] = [];
                }

                // Handler can be stored with multiple events
                this._handlers[ events[ i ] ].push( handler );
            }
        }

        return this;
    },

    /**
     *
     * Controller remove event handler
     * @memberof Controller
     * @method off
     * @param {string} event the event to remove handler for
     * @param {function} handler the handler to remove
     *
     */
    off: function ( event, handler ) {
        if ( !this._handlers[ event ] ) {
            return this;
        }

        // Remove a single handler
        if ( handler ) {
            this._off( event, handler );

        // Remove all handlers for event
        } else {
            this._offed( event );
        }

        return this;
    },

    /**
     *
     * Controller fire an event
     * @memberof Controller
     * @method fire
     * @param {string} event the event to fire
     *
     */
    fire: function ( event ) {
        if ( !this._handlers[ event ] ) {
            return this;
        }

        var args = [].slice.call( arguments, 1 );

        for ( var i = this._handlers[ event ].length; i--; ) {
            this._handlers[ event ][ i ].apply( this, args );
        }

        return this;
    },

    /**
     *
     * Get a unique ID
     * @memberof Controller
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
     * Controller internal off method assumes event AND handler are good
     * @memberof Controller
     * @method _off
     * @param {string} event the event to remove handler for
     * @param {function} handler the handler to remove
     * @private
     *
     */
    _off: function ( event, handler ) {
        for ( var i = 0, len = this._handlers[ event ].length; i < len; i++ ) {
            if ( handler._jsControllerID === this._handlers[ event ][ i ]._jsControllerID ) {
                this._handlers[ event ].splice( i, 1 );

                break;
            }
        }
    },

    /**
     *
     * Controller completely remove all handlers and an event type
     * @memberof Controller
     * @method _offed
     * @param {string} event the event to remove handler for
     * @private
     *
     */
    _offed: function ( event ) {
        for ( var i = this._handlers[ event ].length; i--; ) {
            this._handlers[ event ][ i ] = null;
        }

        delete this._handlers[ event ];
    }
};


// Expose
window.Controller = Controller;


})( window );
/*!
 *
 * A base set of easing methods
 * Most of which were found here:
 * https://gist.github.com/gre/1650294
 *
 * @Easing
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Easing functions
 * @namespace Easing
 * @memberof! <global>
 *
 */
var Easing = {
    /**
     *
     * Produce a linear ease
     * @method linear
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    linear: function ( t ) { return t; },
    
    /**
     *
     * Produce a swing ease like in jQuery
     * @method swing
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    swing: function ( t ) { return (1-Math.cos( t*Math.PI ))/2; },
    
    /**
     *
     * Accelerating from zero velocity
     * @method easeInQuad
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInQuad: function ( t ) { return t*t; },
    
    /**
     *
     * Decelerating to zero velocity
     * @method easeOutQuad
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeOutQuad: function ( t ) { return t*(2-t); },
    
    /**
     *
     * Acceleration until halfway, then deceleration
     * @method easeInOutQuad
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInOutQuad: function ( t ) { return t<0.5 ? 2*t*t : -1+(4-2*t)*t; },
    
    /**
     *
     * Accelerating from zero velocity
     * @method easeInCubic
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInCubic: function ( t ) { return t*t*t; },
    
    /**
     *
     * Decelerating to zero velocity
     * @method easeOutCubic
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeOutCubic: function ( t ) { return (--t)*t*t+1; },
    
    /**
     *
     * Acceleration until halfway, then deceleration
     * @method easeInOutCubic
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInOutCubic: function ( t ) { return t<0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; },
    
    /**
     *
     * Accelerating from zero velocity
     * @method easeInQuart
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInQuart: function ( t ) { return t*t*t*t; },
    
    /**
     *
     * Decelerating to zero velocity
     * @method easeOutQuart
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeOutQuart: function ( t ) { return 1-(--t)*t*t*t; },
    
    /**
     *
     * Acceleration until halfway, then deceleration
     * @method easeInOutQuart
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInOutQuart: function ( t ) { return t<0.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t; },
    
    /**
     *
     * Accelerating from zero velocity
     * @method easeInQuint
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInQuint: function ( t ) { return t*t*t*t*t; },
    
    /**
     *
     * Decelerating to zero velocity
     * @method easeOutQuint
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeOutQuint: function ( t ) { return 1+(--t)*t*t*t*t; },
    
    /**
     *
     * Acceleration until halfway, then deceleration
     * @method easeInOutQuint
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInOutQuint: function ( t ) { return t<0.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t; }
};


// Expose
window.Easing = Easing;


})( window );
/*!
 *
 * Hammerjs event delegation wrapper
 * http://eightmedia.github.io/hammer.js/
 *
 * @Hammered
 * @author: kitajchuk
 *
 *
 */
(function ( window, Hammer ) {


"use strict";


// Break on no Hammer
if ( !Hammer ) {
    throw new Error( "Hammered Class requires Hammerjs!" );
}


/**
 *
 * Single instanceof Hammer
 *
 */
var _instance = null;


/**
 *
 * Hammerjs event delegation wrapper
 * @constructor Hammered
 * @requires matchElement
 * @memberof! <global>
 *
 */
var Hammered = function () {
    return (_instance || this.init.apply( this, arguments ));
};


Hammered.prototype = {
    constructor: Hammered,

    /**
     *
     * Match version of hammerjs for compatibility
     * @member _version
     * @memberof Hammered
     * @private
     *
     */
    _version: "1.1.2",

    /**
     *
     * The stored handlers
     * @member _handlers
     * @memberof Hammered
     * @private
     *
     */
    _handlers: {},

    /**
     *
     * Hammered constructor method
     * {@link https://github.com/EightMedia/hammer.js/wiki/Getting-Started#gesture-options}
     * @memberof Hammered
     * @param {object} element DOMElement to delegate from, default is document.body
     * @param {object} options Hammerjs options to be passed to instance
     * @method init
     *
     */
    init: function ( element, options ) {
        _instance = this;

        /**
         *
         * The stored Hammer instance
         * @member _hammer
         * @memberof Hammered
         * @private
         *
         */
        this._hammer = new Hammer( (element || document.body), options );
    },

    /**
     *
     * Retrieve the original Hammer instance
     * @method getInstance
     * @memberof Hammered
     * @returns instanceof Hammer
     *
     */
    getInstance: function () {
        return this._hammer;
    },

    /**
     *
     * Retrieve the handlers reference object
     * @method getHandlers
     * @memberof Hammered
     * @returns object
     *
     */
    getHandlers: function () {
        return this._handlers;
    },

    /**
     *
     * Allow binding hammer event via delegation
     * @method on
     * @param {string} event The Hammer event
     * @param {string} selector The delegated selector to match
     * @param {function} callback The handler to call
     * @memberof Hammered
     *
     */
    on: function ( event, selector, callback ) {
        var uid = ("Hammered" + ((this._version + Math.random()) + (event + "-" + selector)).replace( /\W/g, "" )),
            handler = function ( e ) {
                var element = matchElement( e.target, selector );

                // Either match target element
                // or walk up to match ancestral element.
                // If the target is not desired, exit
                if ( element ) {
                    // Call the handler with normalized context
                    callback.call( element, e );
                }
            };

        // Bind the methods on ID
        handler._hammerUID = uid;
        callback._hammerUID = uid;

        // Apply the event via Hammerjs
        this._hammer.on( event, handler );

        // Push the wrapper handler onto the stack
        this._handlers[ uid ] = handler;
    },

    /**
     *
     * Effectively off an event wrapped with Hammered
     * @method off
     * @param {string} event The Hammer event
     * @param {function} callback The handler to remove
     * @memberof Hammered
     *
     */
    off: function ( event, callback ) {
        var i;

        for ( i in this._handlers ) {
            if ( i === callback._hammerUID && this._handlers[ i ]._hammerUID === callback._hammerUID ) {
                this._hammer.off( event, this._handlers[ i ] );

                delete this._handlers[ i ];

                break;
            }
        }
    },

    /**
     *
     * Effectively trigger an event through Hammer-js
     * @method trigger
     * @param {string} event The Hammer event
     * @param {object} element The DOMElement to invoke event on
     * @memberof Hammered
     *
     */
    trigger: function ( event, element ) {
        element = ( typeof element === "object" && element.nodeType === 1 ) ? element : null;

        // Only proceed if the element is legit
        if ( element ) {
            var eventObject = new Event( "hammered-" + event ),
                eventData = Hammer.event.collectEventData(
                    element,
                    Hammer.EVENT_END,
                    Hammer.event.getTouchList( eventObject, Hammer.EVENT_END ),
                    eventObject
                );

            eventData.target = element;

            this._hammer.trigger( event, eventData );
        }
    }
};


// Expose
window.Hammered = Hammered;


})( window, window.Hammer );
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
/*!
 *
 * Expression matching for term lists
 *
 * @Isearch
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Expression matching for term lists
 * @constructor Isearch
 * @memberof! <global>
 *
 */
var Isearch = function () {
    return this.init.apply( this, arguments );
};
    
Isearch.prototype = {
    constructor: Isearch,
    
    /**
     *
     * Expression for characters to escape from input
     * @memberof Isearch
     * @member _rEscChars
     * @private
     *
     */
    _rEscChars: /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g,
    
    /**
     *
     * Isearch init constructor method
     * @memberof Isearch
     * @method init
     * @param {object} options Any values used to perform search queries
     *
     */
    init: function ( options ) {
        /**
         *
         * Flag for input escaping
         * @memberof Isearch
         * @member escapeInputs
         *
         */
        this.escapeInputs = false;
        
        /**
         *
         * Flag for only matching from front of input
         * @memberof Isearch
         * @member matchFront
         *
         */
        this.matchFront = false;
        
        /**
         *
         * Flag for case sensitivity on matching
         * @memberof Isearch
         * @member matchCase
         *
         */
        this.matchCase = false;
        
        /**
         *
         * Flag for sorting results alphabetically
         * @memberof Isearch
         * @member alphaResults
         *
         */
        this.alphaResults = false;
        
        // Set all option overrides at once
        for ( var option in options ) {
            this.set( option, options[ option ] );
        }
    },
    
    /**
     *
     * Isearch set options
     * @memberof Isearch
     * @method Isearch.set
     * @param {string|object} key The option to set or options to set
     * @param {mixed} val The value to set for option
     *
     */
    set: function ( key, val ) {
        if ( typeof key === "object" ) {
            for ( var prop in key ) {
                this[ prop ] = key[ prop ];
            }
            
        } else if ( key ) {
            this[ key ] = val;
        }
        
        return this;
    },
    
    /**
     *
     * Isearch query perform
     * Performs matchAny:true by default
     * Performs matchCase:false by default
     * @memberof Isearch
     * @method Isearch.query
     * @param {string} term The term to match against
     * @param {function} callback The callback to receive results
     *
     */
    query: function ( term, callback ) {
        var rstring = "",
            rflags = ["g"],
            matches = [],
            regex;
        
        if ( !term ) {
            console.log( "[Isearch]: Invalid term to query for ", term );
            
            return this;
        }
        
        if ( !this.terms || !this.terms.length ) {
            console.log( "[Isearch]: No terms to query against ", this.terms );
            
            return this;
        }
        
        if ( this.escapeInputs ) {
            term = term.replace( this._rEscChars, "" );
        }
        
        if ( !this.matchCase ) {
            rflags.push( "i" );
        }
        
        if ( this.matchFront ) {
            rstring += "^";
            rflags.splice( rflags.indexOf( "g" ), 1 );
        }
        
        rstring += term;
        
        regex = new RegExp( rstring, rflags.join( "" ) );
        
        for ( var i = this.terms.length; i--; ) {
            var match = this.terms[ i ].match( regex );
            
            if ( match ) {
                matches.push( this.terms[ i ] );
            }
        }
        
        if ( this.alphaResults ) {
            matches = matches.sort( this._sortAlpha );
        }
        
        if ( typeof callback === "function" ) {
            callback( matches );
        }
        
        return this;
    },
    
    /**
     *
     * Isearch alpha sorting used with [].sort
     * @memberof Isearch
     * @method _sortAlpha
     * @param {string} a First test case
     * @param {string} b Second test case
     * @returns -1, 1 or 0
     * @private
     *
     */
    _sortAlpha: function ( a, b ) {
        if ( a < b ) {
            return -1;
        }
        
        if ( a > b ) {
            return 1;
        }
        
        return 0;
    }
};


// Expose
window.Isearch = Isearch;


})( window );
/*!
 *
 * A konami code easter egg handler
 *
 * @KonamiCode
 * @author: kitajchuk
 *
 *
 */
(function ( window, undefined ) {


"use strict";


var _keys = {
        A: 65,
        B: 66,
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39
    },
    
    _code = [
        _keys.UP,
        _keys.UP,
        _keys.DOWN,
        _keys.DOWN,
        _keys.LEFT,
        _keys.RIGHT,
        _keys.LEFT,
        _keys.RIGHT,
        _keys.B,
        _keys.A
        
    ].join( "" );


/**
 *
 * A konami code easter egg handler
 * @constructor KonamiCode
 * @memberof! <global>
 *
 */
var KonamiCode = function () {
    return this.init.apply( this, arguments );
};

KonamiCode.prototype = {
    constructor: KonamiCode,
    
    /**
     *
     * KonamiCode init constructor method
     * @memberof KonamiCode
     * @method KonamiCode.init
     *
     */
    init: function () {
        /**
         *
         * Timeout between key inputs to reset
         * @memberof KonamiCode
         * @member KonamiCode._delay
         *
         */
        this._delay = 500;
        
        /**
         *
         * All supplied callbacks to this instance
         * @memberof KonamiCode
         * @member KonamiCode._callbacks
         *
         */
        this._callbacks = [];
        
        /**
         *
         * Timeout reference
         * @memberof KonamiCode
         * @member KonamiCode._timeout
         *
         */
        this._timeout = null;
        
        var code = "",
            self = this,
            handler = function ( e ) {
                try {
                    clearTimeout( self._timeout );
                    
                } catch ( error ) {}
                
                code = "" + (code + e.keyCode);
                
                if ( code === _code ) {
                    self._dispatch( "_konamicode_" );
                }
                
                self._timeout = setTimeout(function () {
                    clearTimeout( self._timeout );
                    
                    code = "";
                                
                }, self._delay );
            };
        
        if ( document.addEventListener ) {
            document.addEventListener( "keydown", handler, false );
            
        } else if ( document.attachEvent ) {
            document.attachEvent( "onkeydown", handler );
        }
    },
    
    /**
     *
     * Listen for the konami code input
     * @memberof KonamiCode
     * @method KonamiCode.listen
     * @param {function} callback The function to call on input
     *
     */
    listen: function ( callback ) {
        if ( typeof callback === "function" ) {
            this._callbacks.push( callback );
        }
        
        return this;
    },
    
    /**
     *
     * Internal dispatcher when konami code input is matched
     * @memberof KonamiCode
     * @method KonamiCode._dispatch
     * @param {string} event The _konamicode_ event string
     *
     */
    _dispatch: function ( event ) {
        for ( var i = this._callbacks.length; i--; ) {
            this._callbacks[ i ].call( this, event );
        }
    }
};


// Expose
window.KonamiCode = KonamiCode;


})( window );
/*!
 *
 * Handles wildcard route matching against urls with !num and !slug condition testing
 *
 * @MatchRoute
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Handles wildcard route matching against urls with !num and !slug condition testing
 * <ul>
 * <li>route = "/some/random/path/:myvar"</li>
 * <li>route = "/some/random/path/:myvar!num"</li>
 * <li>route = "/some/random/path/:myvar!slug"</li>
 * </ul>
 * @constructor MatchRoute
 * @memberof! <global>
 *
 */
var MatchRoute = function () {
    return this.init.apply( this, arguments );
};

MatchRoute.prototype = {
    constructor: MatchRoute,
    
    /**
     *
     * Expression match http/https
     * @memberof MatchRoute
     * @member _rHTTPs
     * @private
     *
     */
    _rHTTPs: /^http[s]?:\/\/.*?\//,
    
    /**
     *
     * Expression match trail slashes
     * @memberof MatchRoute
     * @member _rTrails
     * @private
     *
     */
    _rTrails: /^\/|\/$/g,
    
    /**
     *
     * Expression match hashbang/querystring
     * @memberof MatchRoute
     * @member _rHashQuery
     * @private
     *
     */
    _rHashQuery: /#.*$|\?.*$/g,
    
    /**
     *
     * Expression match wildcards
     * @memberof MatchRoute
     * @member _rWild
     * @private
     *
     */
    _rWild: /^:/,
    
    /**
     *
     * Expressions to match wildcards with supported conditions
     * @memberof MatchRoute
     * @member _wilders
     * @private
     *
     */
    _wilders: {
        num: /^[0-9]+$/,
        slug: /^[A-Za-z]+[A-Za-z0-9-_.]*$/
    },
    
    
    /**
     *
     * MatchRoute init constructor method
     * @memberof MatchRoute
     * @method init
     * @param {array} routes Config routes can be passed on instantiation
     *
     */
    init: function ( routes ) {
        /**
         *
         * The routes config array
         * @memberof MatchRoute
         * @member _routes
         * @private
         *
         */
        this._routes = ( routes ) ? this._cleanRoutes( routes ) : [];
    },

    /**
     *
     * Get the internal route array
     * @memberof MatchRoute
     * @method MatchRoute.getRoutes
     * @returns {array}
     *
     */
    getRoutes: function () {
        return this._routes;
    },
    
    /**
     *
     * Update routes config array
     * @memberof MatchRoute
     * @method config
     * @param {array} routes to match against
     *
     */
    config: function ( routes ) {
        // Force array on routes
        routes = ( typeof routes === "string" ) ? [ routes ] : routes;

        this._routes = this._routes.concat( this._cleanRoutes( routes ) );
        
        return this;
    },
    
    /**
     *
     * Test a url against a routes config for match validation
     * @memberof MatchRoute
     * @method test
     * @param {string} url to test against routes
     * @returns True or False
     *
     */
    test: function ( url ) {
        return this.parse( url, this._routes ).match;
    },
    
    /**
     *
     * Match a url against a routes config for matches
     * @memberof MatchRoute
     * @method match
     * @param {string} url to test against routes
     * @returns Array of matching routes
     *
     */
    match: function ( url ) {
        return this.parse( url, this._routes ).matches;
    },
    
    /**
     *
     * Compare a url against a specific route
     * @memberof MatchRoute
     * @method compare
     * @param {string} route compare route
     * @param {string} url compare url
     * @returns MatchRoute.parse()
     *
     */
    compare: function ( route, url ) {
        return this.parse( url, [route] );
    },
    
    /**
     *
     * Parse a url for matches against config array
     * @memberof MatchRoute
     * @method parse
     * @param {string} url to test against routes
     * @param {array} routes The routes to test against
     * @returns Object witch match bool and matches array
     *
     */
    parse: function ( url, routes ) {
        var segMatches,
            matches,
            match,
            route = this._cleanRoute( url ),
            ruris,
            regex,
            cond,
            uris = route.split( "/" ),
            uLen = uris.length,
            iLen = routes.length,
            ret = {
                match: false,
                route: null,
                matches: {}
            };
        
        for ( var i = 0; i < iLen; i++ ) {
            // Start fresh each iteration
            // Only one matched route allowed
            ret = {
                match: false,
                route: null,
                uri: [],
                matches: {}
            };
            
            ruris = routes[ i ].split( "/" );
            
            // Handle route === "/"
            if ( route === "/" && routes[ i ] === "/" ) {
                ret.match = true;
                ret.route = routes[ i ];
                
                break;
            }
            
            // If the actual url doesn't match the route in segment length,
            // it cannot possibly be considered for matching so just skip it
            if ( ruris.length !== uris.length ) {
                continue;
            }
            
            segMatches = 0;
            
            for ( var j = 0; j < uLen; j++ ) {
                // Matched a variable uri segment
                if ( this._rWild.test( ruris[ j ] ) ) {
                    // Try to split on conditions
                    matches = ruris[ j ].split( "!" );
                    
                    // The variable segment
                    match = matches[ 0 ];
                    
                    // The match condition
                    cond = matches[ 1 ];
                    
                    // With conditions
                    if ( cond ) {
                        // We support this condition
                        if ( this._wilders[ cond ] ) {
                            regex = this._wilders[ cond ];
                        }
                        
                        // Test against the condition
                        if ( regex && regex.test( uris[ j ] ) ) {
                            segMatches++;
                            
                            // Add the match to the config data
                            ret.matches[ match.replace( this._rWild, "" ) ] = uris[ j ];
                            ret.uri.push( uris[ j ] );
                        }
                    
                    // No conditions, anything goes   
                    } else {
                        segMatches++;
                    }
                
                // Defined segment always goes   
                } else {
                    if ( uris[ j ] === ruris[ j ] ) {
                        segMatches++;
                    }
                }
            }
            
            if ( segMatches === uris.length ) {
                ret.match = true;
                ret.route = routes[ i ];
                ret.uri = ret.uri.join( "/" );
                
                break;
            }
        }
        
        return ret;
    },
    
    /**
     *
     * Clean a route string
     * If the route === "/" then it is returned as is
     * @memberof MatchRoute
     * @method _cleanRoute
     * @param {string} route the route to clean
     * @returns cleaned route string
     * @private
     *
     */
    _cleanRoute: function ( route ) {
        if ( route !== "/" ) {
            route = route.replace( this._rHTTPs, "" );
            route = route.replace( this._rTrails, "" );
            route = route.replace( this._rHashQuery, "" );
        }
        
        if ( route === "" ) {
            route = "/";
        }
        
        return route;
    },
    
    /**
     *
     * Clean an array of route strings
     * @memberof MatchRoute
     * @method _cleanRoutes
     * @param {array} routes the routes to clean
     * @returns cleaned routes array
     * @private
     *
     */
    _cleanRoutes: function ( routes ) {
        for ( var i = routes.length; i--; ) {
            routes[ i ] = this._cleanRoute( routes[ i ] );
        }
        
        return routes;
    }
};


// Expose
window.MatchRoute = MatchRoute;


})( window );
/*!
 *
 * A complete management tool for html5 video and audio context
 *
 * @MediaBox
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Expression match hashbang/querystring
 * @member rHashQuery
 * @private
 *
 */
var rHashQuery = /[#|?].*$/g;

/**
 *
 * Replace "no" in canPlayType strings
 * @member rNos
 * @private
 *
 */
var rNos = /^no$/;

/**
 *
 * Clean up all those typeof's
 * @method isFunction
 * @returns boolean
 * @private
 *
 */
var isFunction = function ( f ) {
    return (typeof f === "function");
};

/**
 *
 * Borrowed(ish)
 * Modernizr v2.7.1
 * www.modernizr.com
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
 * Available under the BSD and MIT licenses: www.modernizr.com/license/
 * @method getAudioSupport
 * @returns object
 * @private
 *
 */
var getAudioSupport = function () {
    var elem = document.createElement( "audio" ),
        ret = {};

    try {
        if ( elem.canPlayType ) {
            ret.ogg = elem.canPlayType( 'audio/ogg; codecs="vorbis"' ).replace( rNos, "" );
            ret.mp3 = elem.canPlayType( 'audio/mpeg;' ).replace( rNos, "" );
            ret.wav = elem.canPlayType( 'audio/wav; codecs="1"').replace( rNos, "" );
            ret.m4a = (elem.canPlayType( 'audio/x-m4a;' ) || elem.canPlayType( 'audio/aac;' )).replace( rNos, "" );
        }
        
    } catch ( e ) {}

    return ret;
};

/**
 *
 * Borrowed(ish)
 * Modernizr v2.7.1
 * www.modernizr.com
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
 * Available under the BSD and MIT licenses: www.modernizr.com/license/
 * @method getVideoSupport
 * @returns object
 * @private
 *
 */
var getVideoSupport = function () {
    var elem = document.createElement( "video" ),
        ret = {};

    try {
        if ( elem.canPlayType ) {
            ret.mpeg4 = elem.canPlayType( 'video/mp4; codecs="mp4v.20.8"' ).replace( rNos, "" );
            ret.ogg = elem.canPlayType( 'video/ogg; codecs="theora"' ).replace( rNos, "" );
            ret.h264 = elem.canPlayType( 'video/mp4; codecs="avc1.42E01E"' ).replace( rNos, "" );
            ret.webm = elem.canPlayType( 'video/webm; codecs="vp8, vorbis"' ).replace( rNos, "" );
        }

    } catch ( e ) {}

    return ret;
};

/**
 *
 * Play an audio context
 * @method sourceStart
 * @param {string} track audio object to play
 * @private
 *
 */
var sourceStart = function ( track ) {
    if ( !track.source.start ) {
        track.source.noteOn( 0, track.startOffset % track.buffer.duration );
        
    } else {
        track.source.start( 0, track.startOffset % track.buffer.duration );
    }
};

/**
 *
 * Stop an audio context
 * @method sourceStop
 * @param {string} track audio object to stop
 * @private
 *
 */
var sourceStop = function ( track ) {
    if ( !track.source.stop ) {
        track.source.noteOff( 0 );
        
    } else {
        track.source.stop( 0 );
    }
};

/**
 *
 * Get mimetype string from media source
 * @method getMimeFromMedia
 * @param {string} src media file source
 * @private
 *
 */
var getMimeFromMedia = function ( src ) {
    var ret;
    
    switch ( src.split( "." ).pop().toLowerCase() ) {
        // Audio mimes
        case "ogg":
            ret = "audio/ogg";
            break;
        case "mp3":
            ret = "audio/mpeg";
            break;
            
        // Video mimes
        case "webm":
            ret = "video/webm";
            break;
        case "mp4":
            ret = "video/mp4";
            break;
        case "ogv":
            ret = "video/ogg";
            break;
    }
    
    return ret;
};

/**
 *
 * Get the audio source that should be used
 * @method getCanPlaySource
 * @param {string} media the media type to check
 * @param {array} sources Array of media sources
 * @returns object
 * @private
 *
 */
var getCanPlaySource = function ( media, sources ) {
    var source, canPlay;
    
    for ( var i = sources.length; i--; ) {
        var src = sources[ i ].split( "." ).pop().toLowerCase().replace( rHashQuery, "" );
        
        if ( media === "video" && src === "mp4" ) {
            if ( (MediaBox.support.video.mpeg4 === "probably" || MediaBox.support.video.h264 === "probably") ) {
                source = sources[ i ];
                
                canPlay = "probably";
                
            } else if ( (MediaBox.support.video.mpeg4 === "maybe" || MediaBox.support.video.h264 === "maybe") ) {
                source = sources[ i ];
                
                canPlay = "maybe";
            }
            
        } else if ( MediaBox.support[ media ][ src ] === "probably" ) {
            source = sources[ i ];
            
            canPlay = "probably";
            
        } else if ( MediaBox.support[ media ][ src ] === "maybe" ) {
            source = sources[ i ];
            
            canPlay = "maybe";
        }
        
        if ( source ) {
            break;
        }
    }
    
    return {
        source: source,
        canPlay: canPlay
    };
};


/**
 *
 * A complete management tool for html5 video and audio context
 * @constructor MediaBox
 * @requires Tween
 * @memberof! <global>
 *
 */
var MediaBox = function () {
    return this.init.apply( this, arguments );
};

/**
 *
 * MediaBox support status
 * @memberof MediaBox
 * @member support
 *
 */
MediaBox.support = {
    audio: getAudioSupport(),
    video: getVideoSupport()
};

/**
 *
 * MediaBox stopped state constant
 * @memberof MediaBox
 * @member STATE_STOPPED
 *
 */
MediaBox.STATE_STOPPED = 0;

/**
 *
 * MediaBox stopping state constant
 * @memberof MediaBox
 * @member STATE_STOPPING
 *
 */
MediaBox.STATE_STOPPING = 1;

/**
 *
 * MediaBox paused state constant
 * @memberof MediaBox
 * @member STATE_PAUSED
 *
 */
MediaBox.STATE_PAUSED = 2;

/**
 *
 * MediaBox playing state constant
 * @memberof MediaBox
 * @member STATE_PLAYING
 *
 */
MediaBox.STATE_PLAYING = 3;

/**
 *
 * MediaBox prototype
 *
 */
MediaBox.prototype = {
    constructor: MediaBox,
    
    /**
     *
     * MediaBox init constructor method
     * @memberof MediaBox
     * @method init
     *
     */
    init: function () {
        /**
         *
         * MediaBox information for each channel.
         * These are default channels you can use.
         * <ul>
         * <li>bgm - background music channel</li>
         * <li>sfx - sound effects channel</li>
         * <li>vid - video channel</li>
         * </ul>
         * @memberof MediaBox
         * @member _channels
         *
         */
        this._channels = {
            bgm: {},
            sfx: {},
            vid: {}
        };
        
        /**
         *
         * MediaBox holds all loaded source urls
         * @memberof MediaBox
         * @member _urls
         *
         */
        this._urls = [];
        
        /**
         *
         * MediaBox holds all audio tracks
         * @memberof MediaBox
         * @member _audio
         *
         */
        this._audio = {};
        
        /**
         *
         * MediaBox holds all video tracks
         * @memberof MediaBox
         * @member _video
         *
         */
        this._video = {};
        
        /**
         *
         * MediaBox boolean to stop/start all audio
         * @memberof MediaBox
         * @member _audioPaused
         *
         */
        this._audioPaused = false;
        
        /**
         *
         * Total number of media objects to load
         * @memberof MediaBox
         * @member _mediaCount
         *
         */
        this._mediaCount = 0;
        
        /**
         *
         * Total number of media objects loaded in progress
         * @memberof MediaBox
         * @member _mediaLoads
         *
         */
        this._mediaLoads = 0;
        
        /**
         *
         * The progress event handler
         * @memberof MediaBox
         * @member _progressHandler
         *
         */
        this._progressHandler = null;
    },
    
    /**
     *
     * MediaBox crossbrowser create audio context
     * @memberof MediaBox
     * @method createAudioContext
     * @returns instance of audio context
     *
     */
    createAudioContext: function () {
        var AudioContext;
        
        if ( window.AudioContext ) {
            AudioContext = window.AudioContext;
            
        } else if ( window.webkitAudioContext ) {
            AudioContext = window.webkitAudioContext;
        }
        
        return ( AudioContext ) ? new AudioContext() : AudioContext;
    },
    
    /**
     *
     * MediaBox crossbrowser create gain node
     * @memberof MediaBox
     * @method createGainNode
     * @returns audio context gain node
     *
     */
    createGainNode: function ( context ) {
        var gainNode;
        
        if ( !context.createGain ) {
            gainNode = context.createGainNode();
            
        } else {
            gainNode = context.createGain();
        }
        
        return gainNode;
    },
    
    /**
     *
     * MediaBox check if media is loaded via ajax
     * @memberof MediaBox
     * @method isLoaded
     * @param {string} id reference id for media
     * @returns boolean
     *
     */
    isLoaded: function ( id ) {
        var obj = this._video[ id ] ? this._video[ id ] : this._audio[ id ];
        
        return (obj.loaded === true);
    },
    
    /**
     *
     * MediaBox check stopped/paused status for audio/video
     * @memberof MediaBox
     * @method isStopped
     * @param {string} id reference id for media
     * @returns boolean
     *
     */
    isStopped: function ( id ) {
        var obj = this._video[ id ] ? this._video[ id ] : this._audio[ id ];
        
        return (obj.state === MediaBox.STATE_STOPPED);
    },
    
    /**
     *
     * MediaBox check playing status for audio/video
     * @memberof MediaBox
     * @method isPlaying
     * @param {string} id reference id for media
     * @returns boolean
     *
     */
    isPlaying: function ( id ) {
        var obj = this._video[ id ] ? this._video[ id ] : this._audio[ id ];
        
        return (obj.state === MediaBox.STATE_PLAYING);
    },
    
    /**
     *
     * MediaBox load media config JSON formatted in Akihabara bundle style
     * @memberof MediaBox
     * @method loadMedia
     * @param {string} url The url to the JSON config
     * @param {function} callback Fired when all media is loaded
     * @example
     * // Akihabara bundle format
     * "addAudio": [
     *     [
     *         "{id}",
     *         [
     *             "{file}.mp3",
     *             "{file}.ogg"
     *         ],
     *         {
     *             "channel": "bgm",
     *             "loop": true
     *         }
     *     ]
     * ]
     *
     */
    loadMedia: function ( url, callback ) {
        var xhr = new XMLHttpRequest(),
            self = this;
        
        xhr.open( "GET", url, true );
        xhr.onreadystatechange = function ( e ) {
            if ( this.readyState === 4 ) {
                if ( this.status === 200 ) {
                    var response;
                        
                    try {
                        response = JSON.parse( this.responseText );
                        
                    } catch ( error ) {}
                    
                    if ( response ) {
                        self.addMedia( response, callback );
                    }
                }
            }
        };
        xhr.send();
    },
    
    /**
     *
     * MediaBox add media from bundle json
     * @memberof MediaBox
     * @method addMedia
     * @param {object} json Akihabara formatted media bundle object
     * @param {function} callback function fired on XMLHttpRequest.onload
     *
     */
    addMedia: function ( json, callback ) {
        var current = 0,
            total = 0,
            func = function () {
                current++;
                
                if ( isFunction( callback ) && (current === total) ) {
                    callback();
                }
            };
        
        for ( var m in json ) {
            total = total + json[ m ].length;
            
            this._mediaCount = total;
            
            for ( var i = json[ m ].length; i--; ) {
                // Reference to this.addVideo / this.addAudio
                this[ m ]( json[ m ][ i ], func );
            }
        }
    },
    
    /**
     *
     * Bind the progress handler for a given batch of media
     * @memberof MediaBox
     * @method addProgress
     * @param {function} callback function fired on progress processing
     *
     */
    addProgress: function ( callback ) {
        this._progressHandler = callback;
    },
    
    /**
     *
     * MediaBox add a video element
     * @memberof MediaBox
     * @method addVideo
     * @param {array} obj Akihabara formatted media bundle
     * @param {function} callback function fired on XMLHttpRequest.onload
     *
     */
    addVideo: function ( obj, callback ) {
        var self = this,
            id = obj[ 0 ],
            
            // Handle the loaded video
            handler = function () {
                self._processLoaded();
                
                var source = document.createElement( "source" );
                    source.src = self._video[ id ]._usedSource.source;
                    source.type = getMimeFromMedia( self._video[ id ]._usedSource.source );
            
                self._video[ id ].loaded = true;
                self._video[ id ].element.appendChild( source );
            },
            xhr;
        
        // Disallow overrides
        if ( this._video[ id ] ) {
            //console.log( "@MediaBox:addVideo Already added " + id );
            return;
        }
        
        // Allow new channels to exist
        if ( !this._channels[ obj[ 2 ].channel ] ) {
            this._channels[ obj[ 2 ].channel ] = {};
        }
        
        // Create video object
        this._video[ id ] = {};
        this._video[ id ].channel = obj[ 2 ].channel;
        this._video[ id ].loop = (obj[ 2 ].loop || false);
        this._video[ id ].sources = obj[ 1 ];
        this._video[ id ].element = document.createElement( "video" );
        this._video[ id ].state = MediaBox.STATE_STOPPED;
        this._video[ id ].loaded = false;
        this._video[ id ]._usedSource = getCanPlaySource( "video", this._video[ id ].sources );
        this._video[ id ]._events = {};
        
        // Set loop
        if ( this._video[ id ].loop ) {
            this._video[ id ].element.loop = true;
        }
        
        // Check if we have loaded this url before
        // If so, we don't want to make another request for it
        // but we still need to create the video object out of it
        if ( this._urls.indexOf( this._video[ id ]._usedSource.source ) !== -1 ) {
            if ( isFunction( callback ) ) {
                handler();
                callback();
                return;
            }
        }
        
        // Push the source onto the loaded url stack
        this._urls.push( this._video[ id ]._usedSource.source );
        
        xhr = new XMLHttpRequest();
        xhr.open( "GET", this._video[ id ]._usedSource.source, true );
        xhr.onload = function ( e ) {
            handler();
            
            if ( isFunction( callback ) ) {
                callback();
            }
        };
        xhr.send();
    },
    
    /**
     *
     * MediaBox get a video element property
     * @memberof MediaBox
     * @method getVideoProp
     * @param {string} id Video id to add event for
     * @param {string} prop The property to access
     *
     */
    getVideoProp: function ( id, prop ) {
        return this._video[ id ].element[ prop ];
    },
    
    /**
     *
     * MediaBox set a video element property
     * @memberof MediaBox
     * @method setVideoProp
     * @param {string} id Video id to add event for
     * @param {string} prop The property to set
     * @param {mixed} value The value to assign
     *
     */
    setVideoProp: function ( id, prop, value ) {
        this._video[ id ].element[ prop ] = value;
    },
    
    /**
     *
     * MediaBox add a video element event listener
     * @memberof MediaBox
     * @method addVideoEvent
     * @param {string} id Video id to add event for
     * @param {string} event Event to add
     * @param {function} callback The event handler to call
     *
     */
    addVideoEvent: function ( id, event, callback ) {
        if ( this._video[ id ] ) {
            this._video[ id ]._events[ event ] = function () {
                if ( isFunction( callback ) ) {
                    callback.apply( this, arguments );
                }
            };
            
            this._video[ id ].element.addEventListener( event, this._video[ id ]._events[ event ], false );
        }
    },
    
    /**
     *
     * MediaBox remove a video element event listener
     * @memberof MediaBox
     * @method addVideoEvent
     * @param {string} id Video id to remove event for
     * @param {string} event Event to remove
     *
     */
    removeVideoEvent: function ( id, event ) {
        if ( this._video[ id ] ) {
            this._video[ id ].element.removeEventListener( event, this._video[ id ]._events[ event ], false );
            
            this._video[ id ]._events[ event ] = null;
        }
    },
    
    /**
     *
     * MediaBox get video element by id
     * @memberof MediaBox
     * @method getVideo
     * @param {string} id reference id for media
     * @returns <video> element
     *
     */
    getVideo: function ( id ) {
        var ret;
        
        if ( this._video[ id ] ) {
            ret = this._video[ id ].element;
        }
        
        return ret;
    },
    
    /**
     *
     * MediaBox get all video elements as an array
     * @memberof MediaBox
     * @method getVideos
     * @returns array
     *
     */
    getVideos: function () {
        var ret = [];
        
        for ( var id in this._video ) {
            ret.push( this._video[ id ].element );
        }
        
        return ret;
    },
    
    /**
     *
     * MediaBox play video element by id
     * @memberof MediaBox
     * @method playVideo
     * @param {string} id reference id for media
     *
     */
    playVideo: function ( id ) {
        if ( this._video[ id ] && this.isLoaded( id ) && this.isStopped( id ) ) {
            this._video[ id ].element.volume = this._channels[ this._video[ id ].channel ].volume;
            this._video[ id ].element.play();
            this._video[ id ].state = MediaBox.STATE_PLAYING;
        }
    },
    
    /**
     *
     * MediaBox stop video element by id with a paused state
     * @memberof MediaBox
     * @method pauseVideo
     * @param {string} id reference id for media
     *
     */
    pauseVideo: function ( id ) {
        if ( this._video[ id ] && this.isLoaded( id ) && this.isPlaying( id ) ) {
            this._video[ id ].element.pause();
            this._video[ id ].state = MediaBox.STATE_PAUSED;
        }
    },
    
    /**
     *
     * MediaBox stop video element by id with a stopped state
     * @memberof MediaBox
     * @method playVideo
     * @param {string} id reference id for media
     *
     */
    stopVideo: function ( id ) {
        if ( this._video[ id ] && this.isLoaded( id ) && this.isPlaying( id ) ) {
            this._video[ id ].element.pause();
            this._video[ id ].state = MediaBox.STATE_STOPPED;
        }
    },
    
    /**
     *
     * MediaBox add an audio context
     * @memberof MediaBox
     * @method addAudio
     * @param {array} obj Akihabara formatted media bundle
     * @param {function} callback function fired on XMLHttpRequest.onload
     *
     */
    addAudio: function ( obj, callback ) {
        var self = this,
            id = obj[ 0 ],
            xhr;
        
        // Disallow overrides
        if ( this._audio[ id ] ) {
            //console.log( "@MediaBox:addAudio Already added " + id );
            return;
        }
        
        // Allow new channels to exist
        if ( !this._channels[ obj[ 2 ].channel ] ) {
            this._channels[ obj[ 2 ].channel ] = {};
        }
        
        // Create audio object
        this._audio[ id ] = {};
        this._audio[ id ].channel = obj[ 2 ].channel;
        this._audio[ id ].loop = (obj[ 2 ].loop || false);
        this._audio[ id ].sources = obj[ 1 ];
        this._audio[ id ].context = this.createAudioContext();
        this._audio[ id ].state = MediaBox.STATE_STOPPED;
        this._audio[ id ].loaded = false;
        this._audio[ id ]._usedSource = getCanPlaySource( "audio", this._audio[ id ].sources );
        
        xhr = new XMLHttpRequest();
        xhr.open( "GET", this._audio[ id ]._usedSource.source, true );
        xhr.responseType = "arraybuffer";
        xhr.onload = function ( e ) {
            self._audio[ id ].context.decodeAudioData( xhr.response, function ( buffer ) {
                self._processLoaded();
                
                self._audio[ id ].loaded = true;
                self._audio[ id ].startTime = 0;
                self._audio[ id ].startOffset = 0;
                self._audio[ id ].buffer = buffer;
                self._audio[ id ].gainNode = self.createGainNode( self._audio[ id ].context );
                
                if ( isFunction( callback ) ) {
                    callback();
                }
            });
        };
        xhr.send();
    },
    
    /**
     *
     * MediaBox play audio context
     * @memberof MediaBox
     * @method playAudio
     * @param {string} id string reference id for audio
     *
     */
    playAudio: function ( id ) {
        if ( this._audio[ id ] ) {
            this._audio[ id ].startTime = this._audio[ id ].context.currentTime;
            
            this._audio[ id ].source = this._audio[ id ].context.createBufferSource();
            this._audio[ id ].source.buffer = this._audio[ id ].buffer;
            this._audio[ id ].source.connect( this._audio[ id ].gainNode );
            this._audio[ id ].gainNode.connect( this._audio[ id ].context.destination );
            this._audio[ id ].gainNode.gain.value = (this._channels[ this._audio[ id ].channel ].volume || 1.0);
            
            if ( this._audio[ id ].loop ) {
                this._audio[ id ].source.loop = true;
            }
            
            sourceStart( this._audio[ id ] );
            
            this._audio[ id ].state = MediaBox.STATE_PLAYING;
        }
    },
    
    /**
     *
     * MediaBox simply a wrapper for playAudio
     * @memberof MediaBox
     * @method hitAudio
     * @param {string} id string reference id for audio
     *
     */
    hitAudio: function ( id ) {
        this.playAudio( id );
    },
    
    /**
     *
     * MediaBox stop playing an audio context
     * @memberof MediaBox
     * @method stopAudio
     * @param {string} id string reference id for audio
     *
     */
    stopAudio: function ( id ) {
        if ( this._audio[ id ] ) {
            this._audio[ id ].startTime = 0;
            this._audio[ id ].startOffset = 0;
            this._audio[ id ].state = MediaBox.STATE_STOPPED;
            
            sourceStop( this._audio[ id ] );
        }
    },
    
    /**
     *
     * MediaBox pause playing audio, calls sourceStop
     * @memberof MediaBox
     * @method pauseAudio
     * @param {string} id id of audio to pause
     *
     */
    pauseAudio: function ( id ) {
        if ( this._audio[ id ] ) {
            this._audio[ id ].startOffset += (this._audio[ id ].context.currentTime - this._audio[ id ].startTime);
            this._audio[ id ].state = MediaBox.STATE_PAUSED;
            
            sourceStop( this._audio[ id ] );
        }
    },
    
    /**
     *
     * MediaBox fade in audio context volume
     * @memberof MediaBox
     * @method fadeAudioIn
     * @param {string} id string reference id for audio
     * @param {number} duration tween time in ms
     * @param {function} easing optional easing to use
     *
     */
    fadeAudioIn: function ( id, duration, easing ) {
        if ( this._audio[ id ].state === MediaBox.STATE_PLAYING ) {
            //console.log( "@MediaBox:fadeAudioIn Already playing " + id );
            
            return this;
        }
        
        var self = this,
            volume = this._channels[ this._audio[ id ].channel ].volume;
        
        if ( this._audio[ id ] ) {
            // Only reset volume and play if audio is stopped
            // Audio state could be STATE_STOPPING at this point
            if ( this._audio[ id ].state === MediaBox.STATE_STOPPED ) {
                this._audio[ id ].gainNode.gain.value = 0;
            
                this.playAudio( id );
                
            } else if ( this._audio[ id ].state === MediaBox.STATE_STOPPING ) {
                this._audio[ id ].state = MediaBox.STATE_PLAYING;
            }
            
            new Tween({
                to: volume,
                from: 0,
                ease: ( isFunction( easing ) ) ? easing : Easing.linear,
                duration: (duration || 1000),
                update: function ( v ) {
                    self._audio[ id ].gainNode.gain.value = v;
                },
                complete: function ( v ) {
                    self._audio[ id ].gainNode.gain.value = v;
                }
            });
        }
    },
    
    /**
     *
     * MediaBox fade out audio context volume
     * @memberof MediaBox
     * @method fadeAudioOut
     * @param {string} id string reference id for audio
     * @param {number} duration tween time in ms
     * @param {function} easing optional easing to use
     *
     */
    fadeAudioOut: function ( id, duration, easing ) {
        if ( this._audio[ id ].state === MediaBox.STATE_STOPPING ) {
            //console.log( "@MediaBox:fadeAudioOut Already stopping " + id );
            
            return this;
        }
        
        var self = this,
            handler = function ( v ) {
                // Check audio state on fadeout in case it is started again
                // before the duration of the fadeout is complete.
                if ( self._audio[ id ].state === self.STATE_STOPPING ) {
                    self._audio[ id ].gainNode.gain.value = v;
                
                    if ( self._audio[ id ].gainNode.gain.value === 0 ) {
                        self.stopAudio( id );
                    }
                }
            };
        
        if ( this._audio[ id ] ) {
            this._audio[ id ].state = MediaBox.STATE_STOPPING;
            
            new Tween({
                to: 0,
                from: this._audio[ id ].gainNode.gain.value,
                ease: ( isFunction( easing ) ) ? easing : Easing.linear,
                duration: (duration || 1000),
                update: handler,
                complete: handler
            });
        }
    },
    
    /**
     *
     * MediaBox pause all playing audio for a given channel id
     * @memberof MediaBox
     * @method stopChannel
     * @param {string} channel string reference id for channel
     *
     */
    stopChannel: function ( channel ) {
        var id;
        
        // Look at video index
        for ( id in this._video ) {
            if ( this._video[ id ].channel === channel && this._video[ id ].state === MediaBox.STATE_PLAYING ) {
                this.pauseVideo( id );
            }
        }
        
        // Look at audio index
        for ( id in this._audio ) {
            if ( this._audio[ id ].channel === channel && this._audio[ id ].state === MediaBox.STATE_PLAYING ) {
                this.pauseAudio( id );
            }
        }
    },
    
    /**
     *
     * MediaBox resume all playing audio for a given channel id
     * @memberof MediaBox
     * @method playChannel
     * @param {string} channel string reference id for channel
     *
     */
    playChannel: function ( channel ) {
        var id;
        
        // Look at video index
        for ( id in this._video ) {
            if ( this._video[ id ].channel === channel && this._video[ id ].state === MediaBox.STATE_PAUSED ) {
                this.playVideo( id );
            }
        }
        
        // Look at audio index
        for ( id in this._audio ) {
            if ( this._audio[ id ].channel === channel && this._audio[ id ].state === MediaBox.STATE_PAUSED ) {
                this.playAudio( id );
            }
        }
    },
    
    /**
     *
     * MediaBox fade out all playing audio for a given channel id
     * @memberof MediaBox
     * @method fadeChannelOut
     * @param {string} channel string reference id for channel
     * @param {number} duration tween time in ms
     *
     */
    fadeChannelOut: function ( channel, duration ) {
        for ( var id in this._audio ) {
            if ( this._audio[ id ].channel === channel && this._audio[ id ].state === MediaBox.STATE_PLAYING ) {
                this.fadeAudioOut( id, duration );
            }
        }
    },
    
    /**
     *
     * MediaBox fade in all playing audio for a given channel id
     * @memberof MediaBox
     * @method fadeChannelIn
     * @param {string} channel string reference id for channel
     * @param {number} duration tween time in ms
     *
     */
    // Need to figure out how this would work
    fadeChannelIn: function ( channel, duration ) {
        for ( var id in this._audio ) {
            if ( this._audio[ id ].channel === channel && this._audio[ id ].state === MediaBox.STATE_PAUSED ) {
                this.fadeAudioIn( id, duration );
            }
        }
    },
    
    /**
     *
     * MediaBox crossfade between 2 audio contexts on a given channel
     * @memberof MediaBox
     * @method crossFadeChannel
     * @param {string} channel string reference id for channel
     * @param {string} id string reference id for audio to bring in
     * @param {number} duration tween time in ms
     *
     */
    crossFadeChannel: function ( channel, id, duration ) {
        for ( var i in this._audio ) {
            if ( this._audio[ i ].channel === channel && this._audio[ i ].state === MediaBox.STATE_PLAYING ) {
                this.fadeAudioOut( i, duration );
            }
        }
        
        this.fadeAudioIn( id, duration );
    },
    
    /**
     *
     * MediaBox set the master volume for a channel
     * @memberof MediaBox
     * @method setChannelVolume
     * @param {string} key string id reference to channel
     * @param {string} val floating point number for volume setting
     *
     */
    setChannelVolume: function ( key, val ) {
        if ( this._channels[ key ] ) {
            this._channels[ key ].volume = val;
        }
    },
    
    /**
     *
     * MediaBox pause all playing audio on a channel
     * @memberof MediaBox
     * @method pauseAll
     *
     */
    pauseAll: function ( channel ) {
        if ( this._audioPaused ) {
            return this;
        }
        
        this._audioPaused = true;
        
        for ( var id in this._audio ) {
            if ( this._audio[ id ].state === MediaBox.STATE_PLAYING ) {
                if ( this._audio[ id ].channel === channel ) {
                    this.pauseAudio( id );
                }
            }
        }
    },
    
    /**
     *
     * MediaBox resume all playing audio on a channel
     * @memberof MediaBox
     * @method resumeAll
     *
     */
    resumeAll: function ( channel ) {
        if ( !this._audioPaused ) {
            return this;
        }
        
        this._audioPaused = false;
        
        for ( var id in this._audio ) {
            if ( this._audio[ id ].state === MediaBox.STATE_PAUSED ) {
                if ( this._audio[ id ].channel === channel ) {
                    this.playAudio( id );
                }
            }
        }
    },
    
    /**
     *
     * Process load data each time a request fulfills
     * @memberof MediaBox
     * @method _processLoaded
     * @private
     *
     */
    _processLoaded: function () {
        this._mediaLoads++;
        
        if ( isFunction( this._progressHandler ) ) {
            this._progressHandler({
                total: this._mediaCount,
                loaded: this._mediaLoads,
                decimalPercent: (this._mediaLoads / this._mediaCount),
                wholePercent: (this._mediaLoads / this._mediaCount) * 100
            });
        }
        
        // Reset the media counters after this batch is loaded
        if ( this._mediaLoads === this._mediaCount ) {
            this._mediaCount = 0;
            this._mediaLoads = 0;
        }
    }
};


// Expose
window.MediaBox = MediaBox;


})( window );
/*!
 *
 * Handles history pushstate/popstate with async option
 * If history is not supported, falls back to hashbang!
 *
 * @PushState
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * A simple pushState Class
 * Supported events with .on():
 * <ul>
 * <li>popstate</li>
 * <li>beforestate</li>
 * <li>afterstate</li>
 * </ul>
 * @constructor PushState
 * @memberof! <global>
 *
 */
var PushState = function () {
    return this.init.apply( this, arguments );
};

PushState.prototype = {
    constructor: PushState,
    
    /**
     *
     * Expression match #
     * @memberof PushState
     * @member _rHash
     * @private
     *
     */
    _rHash: /#/,
    
    /**
     *
     * Expression match http/https
     * @memberof PushState
     * @member _rHTTPs
     * @private
     *
     */
    _rHTTPs: /^http[s]?:\/\/.*?\//,
    
    /**
     *
     * Flag whether pushState is enabled
     * @memberof PushState
     * @member _pushable
     * @private
     *
     */
    _pushable: ("history" in window && "pushState" in window.history),
    
    /**
     *
     * Fallback to hashchange if needed. Support:
     * <ul>
     * <li>Internet Explorer 8</li>
     * <li>Firefox 3.6</li>
     * <li>Chrome 5</li>
     * <li>Safari 5</li>
     * <li>Opera 10.6</li>
     * </ul>
     * @memberof PushState
     * @member _hashable
     * @private
     *
     */
    _hashable: ("onhashchange" in window),
    
    /**
     *
     * PushState init constructor method
     * @memberof PushState
     * @method PushState.init
     * @param {object} options Settings for PushState
     * <ul>
     * <li>options.async</li>
     * <li>options.caching</li>
     * </ul>
     *
     */
    init: function ( options ) {
        var url = window.location.href;
        
        /**
         *
         * Flag whether state is enabled
         * @memberof PushState
         * @member _enabled
         * @private
         *
         */
        this._enabled = false;
        
        /**
         *
         * Flag when hash is changed by PushState
         * This allows appropriate replication of popstate
         * @memberof PushState
         * @member _ishashpushed
         * @private
         *
         */
        this._ishashpushed = false;
        
        /**
         *
         * Unique ID ticker
         * @memberof PushState
         * @member _uid
         * @private
         *
         */
        this._uid = 0;
        
        /**
         *
         * Stored state objects
         * @memberof PushState
         * @member _states
         * @private
         *
         */
        this._states = {};
        
        /**
         *
         * Stored response objects
         * @memberof PushState
         * @member _responses
         * @private
         *
         */
        this._responses = {};
        
        /**
         *
         * Event callbacks
         * @memberof PushState
         * @member _callbacks
         * @private
         *
         */
        this._callbacks = {};
        
        /**
         *
         * Flag whether to use ajax
         * @memberof PushState
         * @member _async
         * @private
         *
         */
        this._async = ( options && options.async !== undefined ) ? options.async : true;
        
        /**
         *
         * Flag whether to use cached responses
         * @memberof PushState
         * @member _caching
         * @private
         *
         */
        this._caching = ( options && options.caching !== undefined ) ? options.caching : true;
        
        // Set initial state
        this._states[ url ] = {
            uid: this.getUID(),
            cached: false
        };

        // Enable the popstate event
        this._stateEnable();
    },
    
    /**
     *
     * Bind a callback to an event
     * @memberof PushState
     * @method on
     * @param {string} event The event to bind to
     * @param {function} callback The function to call
     *
     */
    on: function ( event, callback ) {
        if ( typeof callback === "function" ) {
            if ( !this._callbacks[ event ] ) {
                this._callbacks[ event ] = [];
            }
            
            callback._pushstateID = this.getUID();
            callback._pushstateType = event;
            
            this._callbacks[ event ].push( callback );
        }
    },
    
    /**
     *
     * Push onto the History state
     * @memberof PushState
     * @method push
     * @param {string} url address to push to history
     * @param {function} callback function to call when done
     *
     * @fires beforestate
     * @fires afterstate
     *
     */
    push: function ( url, callback ) {
        var self = this;
        
        this._fire( "beforestate" );
        
        // Break on cached
        if ( this._stateCached( url ) ) {
            this._push( url );
                    
            callback( this._responses[ url ] );
        
        // Push new state    
        } else {
            this._states[ url ] = {
                uid: this.getUID(),
                cached: false
            };
            
            if ( this._async ) {
                this._getUrl( url, function ( response ) {
                    self._push( url );
    
                    self._fire( "afterstate", response );
                    
                    if ( typeof callback === "function" ) {
                        callback( response );
                    }
                });
    
            } else {
                this._push( url );

                this._fire( "afterstate" );
                
                if ( typeof callback === "function" ) {
                    callback();
                }
            }
        }
    },
    
    /**
     *
     * Manually go back in history state
     * @memberof PushState
     * @method goBack
     *
     * @fires backstate
     *
     */
    goBack: function () {
        window.history.back();
        
        this._fire( "backstate" );
    },
    
    /**
     *
     * Manually go forward in history state
     * @memberof PushState
     * @method goForward
     *
     * @fires forwardstate
     *
     */
    goForward: function () {
        window.history.forward();
        
        this._fire( "forwardstate" );
    },
    
    /**
     *
     * Get a unique ID
     * @memberof PushState
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
     * Calls window.history.pushState
     * @memberof PushState
     * @method _push
     * @param {string} url The url to push
     * @private
     *
     */
    _push: function ( url ) {
        if ( this._pushable ) {
            window.history.pushState( this._states[ url ], "", url );
            
        } else {
            this._ishashpushed = true;
            
            window.location.hash = url.replace( this._rHTTPs, "" );
        }
    },
    
    /**
     *
     * Check if state has been cached for a url
     * @memberof PushState
     * @method _stateCached
     * @param {string} url The url to check
     * @private
     *
     */
    _stateCached: function ( url ) {
        var ret = false;
        
        if ( this._caching && this._states[ url ] && this._states[ url ].cached && this._responses[ url ] ) {
            ret = true;
        }
        
        return ret;
    },
    
    /**
     *
     * Cache the response for a url
     * @memberof PushState
     * @method _cacheState
     * @param {string} url The url to cache for
     * @param {object} response The XMLHttpRequest response object
     * @private
     *
     */
    _cacheState: function ( url, response ) {
        if ( this._caching ) {
            this._states[ url ].cached = true;
            this._responses[ url ] = response;
        }
    },
    
    /**
     *
     * Request a url with an XMLHttpRequest
     * @memberof PushState
     * @method _getUrl
     * @param {string} url The url to request
     * @param {function} callback The function to call when done
     * @private
     *
     */
    _getUrl: function ( url, callback ) {
        var xhr = new XMLHttpRequest(),
            self = this;
        
        xhr.open( "GET", url, true );
        
        xhr.onreadystatechange = function ( e ) {
            if ( this.readyState === 4 ) {
                if ( this.status === 200 ) {
                    try {
                        // Cache if option enabled
                        self._cacheState( url, this );
                        
                        if ( typeof callback === "function" ) {
                            callback( this );
                        }
                        
                    } catch ( error ) {}
                    
                } else if ( this.status === 404 ) {
                    // Should we do anything here...
                }
            }
        };
        
        xhr.send();
    },
    
    /**
     *
     * Fire an events callbacks
     * @memberof PushState
     * @method _fire
     * @param {string} event The event to fire
     * @param {string} url The current url
     * @private
     *
     */
    _fire: function ( event, url ) {
        if ( this._callbacks[ event ] ) {
            for ( var i = this._callbacks[ event ].length; i--; ) {
                this._callbacks[ event ][ i ].apply( this, [].slice.call( arguments, 1 ) );
            }
        }
    },
    
    /**
     *
     * Bind this instances state handler
     * @memberof PushState
     * @method _stateEnabled
     * @private
     *
     * @fires popstate
     *
     */
    _stateEnable: function () {
        if ( this._enabled ) {
            return this;
        }

        var self = this,
            handler = function () {
                var url = window.location.href.replace( self._rHash, "/" );
                
                if ( self._stateCached( url ) ) {
                    self._fire( "popstate", url, self._responses[ url ] );
                    
                } else {
                    self._getUrl( url, function ( response ) {
                        self._fire( "popstate", url, response );
                    });
                }
            };

        this._enabled = true;
        
        if ( this._pushable ) {
            window.addEventListener( "popstate", function ( e ) {
                handler();
                
            }, false );
            
        } else if ( this._hashable ) {
            window.addEventListener( "hashchange", function ( e ) {
                if ( !self._ishashpushed ) {
                    handler();
                    
                } else {
                    self._ishashpushed = false;
                }
                
            }, false );
        }
    }
};


// Expose
window.PushState = PushState;


})( window );
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
/*!
 *
 * Handles basic get routing
 *
 * @Router
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


var _initDelay = 200,
    _triggerEl;


/**
 *
 * A simple router Class
 * @constructor Router
 * @requires PushState
 * @requires MatchRoute
 * @requires matchElement
 * @memberof! <global>
 *
 */
var Router = function () {
    return this.init.apply( this, arguments );
};

Router.prototype = {
    constructor: Router,
    
    /**
     *
     * Router init constructor method
     * @memberof Router
     * @method init
     * @param {object} options Settings for PushState
     * <ul>
     * <li>options.async</li>
     * <li>options.caching</li>
     * </ul>
     *
     * @fires beforeget
     * @fires afterget
     * @fires get
     *
     */
    init: function ( options ) {
        var self = this,
            isReady = false;
        
        /**
         *
         * Internal MatchRoute instance
         * @memberof Router
         * @member _matcher
         * @private
         *
         */
        this._matcher = new MatchRoute();
        
        /**
         *
         * Internal PushState instance
         * @memberof Router
         * @member _pusher
         * @private
         *
         */
        this._pusher = new PushState( options );
        
        /**
         *
         * Event handling callbacks
         * @memberof Router
         * @member _callbacks
         * @private
         *
         */
        this._callbacks = {};
        
        /**
         *
         * Router Store user options
         * @memberof Router
         * @member _options
         * @private
         *
         */
        this._options = {
            /**
             *
             * Router prevent event default when routes are matched
             * @memberof _options
             * @member preventDefault
             *
             */
            preventDefault: ( options.preventDefault !== undefined ) ? options.preventDefault : false
        };
        
        /**
         *
         * Router unique ID
         * @memberof Router
         * @member _uid
         * @private
         *
         */
        this._uid = 0;
        
        // Bind GET requests to links
        if ( document.addEventListener ) {
            document.addEventListener( "click", function ( e ) {
                self._handler( this, e );
                
            }, false );
            
        } else if ( document.attachEvent ) {
            document.attachEvent( "onclick", function ( e ) {
                self._handler( this, e );
            });
        }
        
        /**
         *
         * @event popstate
         *
         */
        this._pusher.on( "popstate", function ( url, data ) {
            // Hook around browsers firing popstate on pageload
            if ( isReady ) {
                self._fire( "beforeget" );
                self._fire( "get", url, data );
                self._fire( "afterget" );
                
            } else {
                isReady = true;
            }
        });
        
        /**
         *
         * @event beforestate
         *
         */
        this._pusher.on( "beforestate", function () {
            self._fire( "beforeget" );
        });
        
        /**
         *
         * @event afterstate
         *
         */
        this._pusher.on( "afterstate", function () {
            self._fire( "afterget" );
        });
        
        // Manually fire first GET
        // Async this in order to allow .get() to work after instantiation
        setTimeout(function () {
            self._pusher.push( window.location.href, function ( response ) {
                self._fire( "get", window.location.href, response );
                
                isReady = true;
            });

        }, _initDelay );
    },
    
    /**
     *
     * Add an event listener
     * Binding "beforeget" and "afterget" is a wrapper
     * to hook into the PushState classes "beforestate" and "afterstate".
     * @memberof Router
     * @method on
     * @param {string} event The event to bind to
     * @param {function} callback The function to call
     *
     */
    on: function ( event, callback ) {
        this._bind( event, callback );
    },

    /**
     *
     * Remove an event listener
     * @memberof Router
     * @method off
     * @param {string} event The event to unbind
     * @param {function} callback The function to reference
     *
     */
    off: function ( event, callback ) {
        this._unbind( event, callback );
    },

    /**
     *
     * Support router triggers by url
     * @memberof Router
     * @method trigger
     * @param {string} url The url to route to
     *
     */
    trigger: function ( url ) {
        if ( !_triggerEl ) {
            _triggerEl = document.createElement( "a" );
        }

        _triggerEl.href = url;

        this._handler( _triggerEl, {
            target: _triggerEl
        });
    },
    
    /**
     *
     * Bind a GET request route
     * @memberof Router
     * @method get
     * @param {string} route route to match
     * @param {function} callback function to call when route is requested
     *
     */
    get: function ( route, callback ) {
        // Add route to matcher
        this._matcher.config( [route] );
        
        // Bind the route to the callback
        if ( callback._routerRoutes ) {
            callback._routerRoutes.push( route );
            
        } else {
            callback._routerRoutes = [route];
        }
        
        // When binding multiple routes to a single
        // callback, we need to make sure the callbacks
        // routes array is updated above but the callback
        // only gets added to the list once.
        if ( callback._routerRoutes.length === 1 ) {
            this._bind( "get", callback );
        }
    },

    /**
     *
     * Get a sanitized route for a url
     * @memberof Router
     * @method getRouteForUrl
     * @param {string} url The url to use
     * @returns {string}
     *
     */
    getRouteForUrl: function ( url ) {
        return this._matcher._cleanRoute( url );
    },

    /**
     *
     * Get the match data for a url against the routes config
     * @memberof Router
     * @method getRouteDataForUrl
     * @param {string} url The url to use
     * @returns {object}
     *
     */
    getRouteDataForUrl: function ( url ) {
        return this._matcher.parse( url, this._matcher.getRoutes() ).matches;
    },
    
    /**
     *
     * Get a unique ID
     * @memberof Router
     * @method getUID
     * @returns number
     *
     */
    getUID: function () {
        this._uid = (this._uid + 1);
        
        return this._uid;
    },
    
    /**
     * Compatible event preventDefault
     * @memberof Router
     * @method _preventDefault
     * @param {object} e The event object
     * @private
     *
     */
    _preventDefault: function ( e ) {
        if ( !this._options.preventDefault ) {
            return this;
        }
        
        if ( e.preventDefault ) {
            e.preventDefault();
            
        } else {
            e.returnValue = false;
        }
    },
    
    /**
     * GET click event handler
     * @memberof Router
     * @method _handler
     * @param {object} el The event context element
     * @param {object} e The event object
     * @private
     *
     * @fires get
     *
     */
    _handler: function ( el, e ) {
        var self = this,
            elem = (matchElement( el, "a" ) || matchElement( e.target, "a" ));
        
        if ( elem ) {
            if ( elem.href.indexOf( "#" ) === -1 && this._matcher.test( elem.href ) ) {
                this._preventDefault( e );
                
                this._pusher.push( elem.href, function ( response ) {
                    self._fire( "get", elem.href, response );
                });
            }
        }
    },
    
    /**
     *
     * Bind an event to a callback
     * @memberof Router
     * @method _bind
     * @param {string} event what to bind on
     * @param {function} callback fired on event
     * @private
     *
     */
    _bind: function ( event, callback ) {
        if ( typeof callback === "function" ) {
            if ( !this._callbacks[ event ] ) {
                this._callbacks[ event ] = [];
            }
            
            callback._jsRouterID = this.getUID();
            
            this._callbacks[ event ].push( callback );
        }
    },

    /**
     *
     * Unbind an event to a callback(s)
     * @memberof Router
     * @method _bind
     * @param {string} event what to bind on
     * @param {function} callback fired on event
     * @private
     *
     */
    _unbind: function ( event, callback ) {
        if ( !this._callbacks[ event ] ) {
            return this;
        }

        // Remove a single callback
        if ( callback ) {
            for ( var i = 0, len = this._callbacks[ event ].length; i < len; i++ ) {
                if ( callback._jsRouterID === this._callbacks[ event ][ i ]._jsRouterID ) {
                    this._callbacks[ event ].splice( i, 1 );
    
                    break;
                }
            }

        // Remove all callbacks for event
        } else {
            for ( var j = this._callbacks[ event ].length; j--; ) {
                this._callbacks[ event ][ j ] = null;
            }
    
            delete this._callbacks[ event ];
        }
    },
    
    /**
     *
     * Fire an event to a callback
     * @memberof Router
     * @method _fire
     * @param {string} event what to bind on
     * @param {string} url fired on event
     * @param {string} response html from responseText
     * @private
     *
     */
    _fire: function ( event, url, response ) {
        var i;
        
        // GET events have routes and are special ;-P
        if ( event === "get" ) {
            for ( i = this._callbacks[ event ].length; i--; ) {
                var data = this._matcher.parse( url, this._callbacks[ event ][ i ]._routerRoutes );
                
                if ( data.match ) {
                    this._callbacks[ event ][ i ].call( this, {
                        route: this._matcher._cleanRoute( url ),
                        response: response,
                        matches: data.matches
                    });
                }
            }
        
        // Fires basic timing events "beforeget" / "afterget"    
        } else if ( this._callbacks[ event ] ) {
            for ( i = this._callbacks[ event ].length; i--; ) {
                this._callbacks[ event ][ i ].call( this );
            }
        }
    }
};


// Expose
window.Router = Router;


})( window );
/*!
 *
 * Window scroll event controller
 *
 * @ScrollController
 * @author: kitajchuk
 *
 *
 */
(function ( Controller ) {


"use strict";


// Break on no Controller
if ( !Controller ) {
    throw new Error( "ScrollController Class requires Controller Class" );
}


// Current scroll position
var _currentY = null,

    // Singleton
    _instance = null;

/**
 *
 * Window scroll event controller
 * @constructor ScrollController
 * @augments Controller
 * @requires Controller
 * @memberof! <global>
 *
 * @fires scroll
 * @fires scrolldown
 * @fires scrollup
 * @fires scrollmax
 * @fires scrollmin
 *
 */
var ScrollController = function () {
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
                /**
                 *
                 * @event scroll
                 *
                 */
                _instance.fire( "scroll" );
            }

            // Fire scrollup and scrolldown
            if ( isScrollDown ) {
                /**
                 *
                 * @event scrolldown
                 *
                 */
                _instance.fire( "scrolldown" );

            } else if ( isScrollUp ) {
                /**
                 *
                 * @event scrollup
                 *
                 */
                _instance.fire( "scrollup" );
            }

            // Fire scrollmax and scrollmin
            if ( isScrollMax ) {
                /**
                 *
                 * @event scrollmax
                 *
                 */
                _instance.fire( "scrollmax" );

            } else if ( isScrollMin ) {
                /**
                 *
                 * @event scrollmin
                 *
                 */
                _instance.fire( "scrollmin" );
            }

            _currentY = currentY;
        });
    }

    return _instance;
};

ScrollController.prototype = new Controller();

/**
 *
 * Returns the current window vertical scroll position
 * @memberof ScrollController
 * @method getScrollY
 * @returns number
 *
 */
ScrollController.prototype.getScrollY = function () {
    return (window.scrollY || document.documentElement.scrollTop);
};

/**
 *
 * Determines if scroll position is at maximum for document
 * @memberof ScrollController
 * @method isScrollMax
 * @returns boolean
 *
 */
ScrollController.prototype.isScrollMax = function () {
    return (this.getScrollY() >= (document.documentElement.offsetHeight - window.innerHeight));
};

/**
 *
 * Determines if scroll position is at minimum for document
 * @memberof ScrollController
 * @method isScrollMin
 * @returns boolean
 *
 */
ScrollController.prototype.isScrollMin = function () {
    return (this.getScrollY() <= 0);
};


// Expose
window.ScrollController = ScrollController;


})( (window.Controller || window.funpack.Controller) );
/*!
 *
 * A stepped timeout manager
 *
 * @Stagger
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * A stepped timeout manager
 * @constructor Stagger
 * @memberof! <global>
 *
 */
var Stagger = function () {
    return this.init.apply( this, arguments );
};

Stagger.prototype = {
    constructor: Stagger,
    
    /**
     *
     * Stagger init constructor method
     * @memberof Stagger
     * @method Stagger.init
     * @param {object} options The staggering options
     * <ul>
     * <li>options.delay</li>
     * <li>options.occurrences</li>
     * <li>options.paused</li>
     * </ul>
     *
     */
    init: function ( options ) {
        /**
         *
         * Step callback
         * @memberof Stagger
         * @member Stagger._step
         *
         */
        this._step = null;
        
        /**
         *
         * When iteration callbacks
         * @memberof Stagger
         * @member Stagger._when
         *
         */
        this._when = {};
        
        /**
         *
         * Done callback
         * @memberof Stagger
         * @member Stagger._done
         *
         */
        this._done = null;
        
        /**
         *
         * Timeout delay
         * @memberof Stagger
         * @member Stagger._delay
         *
         */
        this._delay = options.delay || 250;
        
        /**
         *
         * Current step iteration
         * @memberof Stagger
         * @member Stagger._current
         *
         */
        this._current = 0;
        
        /**
         *
         * Number of step occurrences
         * @memberof Stagger
         * @member Stagger._steps
         *
         */
        this._occurrences = options.steps || 0;
        
        /**
         *
         * Timeout reference
         * @memberof Stagger
         * @member Stagger._timeout
         *
         */
        this._timeout = null;
        
        /**
         *
         * Paused flag
         * @memberof Stagger
         * @member Stagger._paused
         *
         */
        this._paused = false;
        
        /**
         *
         * Started iteration flag
         * @memberof Stagger
         * @member Stagger._started
         *
         */
        this._started = false;
        
        /**
         *
         * Resolved iteration flag
         * @memberof Stagger
         * @member Stagger._resolved
         *
         */
        this._resolved = false;
    },
    
    /**
     *
     * Apply the step callback
     * @memberof Stagger
     * @method Stagger.step
     * @param {function} fn The callback to fire
     *
     */
    step: function ( fn ) {
        if ( typeof fn === "function" ) {
            this._step = fn;
        }
        
        return this;
    },
    
    /**
     *
     * Apply a when callback
     * @memberof Stagger
     * @method Stagger.when
     * @param {number} i The iteration to fire on
     * @param {function} fn The callback to fire
     *
     */
    when: function ( i, fn ) {
        if ( typeof fn === "function" ) {
            this._when[ i ] = fn;
        }

        return this;
    },
    
    /**
     *
     * Apply the done callback
     * @memberof Stagger
     * @method Stagger.done
     * @param {function} fn The callback to fire
     *
     */
    done: function ( fn ) {
        if ( typeof fn === "function" ) {
            this._done = fn;
        }
        
        return this;
    },
    
    /**
     *
     * Pause the iteration
     * @memberof Stagger
     * @method Stagger.pause
     *
     */
    pause: function () {
        this._paused = true;
        
        return this;
    },
    
    /**
     *
     * Play the iteration
     * @memberof Stagger
     * @method Stagger.play
     *
     */
    play: function () {
        this._paused = false;
        
        return this;
    },
    
    /**
     *
     * Start the iteration
     * @memberof Stagger
     * @method Stagger.start
     *
     */
    start: function () {
        this.play()._stagger();
        
        return this;
    },
    
    /**
     *
     * Resolve the iteration state
     * @memberof Stagger
     * @method Stagger._resolve
     *
     */
    _resolve: function () {
        this._resolved = true;
        this._timeout = null;
        
        return this;
    },
    
    /**
     *
     * Initialize the iteration loop
     * @memberof Stagger
     * @method Stagger._stagger
     *
     */
    _stagger: function () {
        if ( this._started ) {
            return this;
        }
        
        this._started = true;
        
        var self = this,
            stagger = function () {
                self._timeout = setTimeout(function () {
                    clearTimeout( self._timeout );
                    
                    // If resolved, stop timeout loop
                    if ( self._resolved ) {
                        self._timeout = null;
                        
                        return;
                    
                    // If paused, keep loop going but wait    
                    } else if ( self._paused ) {
                        stagger();
                        
                        return;
                    }
                    
                    if ( typeof self._step === "function" ) {
                        self._step( self._current );
                    }
                    
                    if ( typeof self._when[ self._current ] === "function" ) {
                        self._when[ self._current ]( self._current );
                    }
                    
                    self._current++;
                    
                    if ( self._current === self._occurrences ) {
                        self._resolve();
                        
                        if ( typeof self._done === "function" ) {
                            self._done();
                        }
                        
                    } else {
                        stagger();
                    }
                                
                }, self._delay );
            };
        
        stagger();
    }
};


// Expose
window.Stagger = Stagger;


})( window );
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
    ease: Easing.linear,
    duration: 600,
    from: 0,
    to: 0,
    delay: 0,
    update: function () {},
    complete: function () {}
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
    for ( var i in defaults ) {
        if ( options[ i ] === undefined ) {
            options[ i ] = defaults[ i ];
        }
    }

    var tweenDiff = (options.to - options.from),
        startTime,
        rafTimer;

    function animate() {
        var animDiff = (Date.now() - startTime),
            tweenTo = (tweenDiff * options.ease( animDiff / options.duration )) + options.from;

        if ( typeof options.update === "function" ) {
            options.update( tweenTo );
        }

        if ( animDiff > options.duration ) {
            if ( typeof options.complete === "function" ) {
                options.complete( options.to );
            }

            cancelAnimationFrame( rafTimer );

            rafTimer = null;

            return false;
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
/*!
 *
 * Basic XMLHttpRequest handling using Promises
 *
 * @ajax
 * @author: kitajchuk
 *
 * @notes:
 * Ready State Description
 * 0 The request is not initialized
 * 1 The request has been set up
 * 2 The request has been sent
 * 3 The request is in process
 * 4 The request is complete
 *
 * Response Types
 * text ( default )
 * arraybuffer
 * blob
 * document
 *
 * Upcoming XMLHttpRequest Level 2
 * json
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Basic XMLHttpRequest handling using Promises
 * @method ajax
 * @memberof! <global>
 * @requires Promise
 * @param {string} url The endpoint to hit
 * @param {string} method The requeset method ( GET / POST )
 * @param {object} options The options dataset
 * <ul>
 * <li>data - what is sent to the server</li>
 * <li>responseType - set the responseType on the xhr object</li>
 * <li>contentType - set the "Content-Type" request header</li>
 * <li>async - flag request as asynchronous or not</li>
 * <li>headers - headers to be set using setRequestHeader</li>
 * </ul>
 * @returns new Promise()
 * @example
 * // Handling resolved / rejected states
 * ajax( "/some/api", "POST" ).then(
 *      // Resolved
 *      function ( response ) {
 *          console.log( response );
 *      },
 *
 *      // Rejected
 *      function ( error ) {}
 * );
 *
 */
var ajax = function ( url, method, options ) {
    // Normalize options...
    options = options || {};
    
    // Request method if not set + uppercased
    // @default: method is GET
    method = (method || "get").toUpperCase();
    
    // Return request with a promise
    return new Promise(function ( resolve, reject ) {
        var xhr = new XMLHttpRequest(),
            qsp = [],
            i;
        
        // Format data string if it has iterables
        for ( i in options.data ) {
            qsp.push( i + "=" + options.data[ i ] );
        }
        
        // Open the request as asynchronous
        // @default: true for async
        xhr.open( method, url, (options.async || true) );
        
        // Set empty accept header
        //xhr.setRequestHeader( "Accept", "" );
        
        // Set Content-Type request header
        if ( options.contentType ) {
            xhr.setRequestHeader( "Content-Type", options.contentType );
        
        // Set Content-Type for POST method
        // @default: application/x-www-form-urlencoded
        } else if ( method === "POST" ) {
            xhr.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
        }
        
        // Set optional request headers
        if ( options.headers ) {
            for ( i in options.headers ) {
                xhr.setRequestHeader( i, options.headers[ i ] );
            }
        }
        
        // Set requested with header
        // @default: XMLHttpRequest since that is all we support here
        xhr.setRequestHeader( "X-Requested-With", "XMLHttpRequest" );
        
        // Set the responseType
        if ( options.responseType ) {
            options.responseType = options.responseType.toLowerCase();
            
            // JSON will need to be parsed out from plain text
            // #issue: Webkit has not implemented XMLHttpRequest Level 2 which supports json as a responseType
            xhr.responseType = ( options.responseType === "json" ) ? "text" : options.responseType;
        }
        
        // Apply the readystatechange event
        xhr.onreadystatechange = function ( e ) {
            // Wait until we can interact with the xhr response
            if ( this.readyState === 4 ) {
                if ( this.status === 200 ) {
                    try {
                        var response = this.responseText;
                        
                        // Try parsing out the JSON...
                        if ( options.responseType === "json" ) {
                            response = JSON.parse( response );
                        }
                        
                        // Supply original xhr object as well...
                        resolve({
                            data: response,
                            xhr: this
                        });
                        
                    } catch ( error ) {
                        reject( error );
                    }
                
                } else {
                    reject( new Error( this.statusText ) );
                }
            }
        };
        
        // Apply the error event
        xhr.onerror = function () {
            reject( new Error( "Network Error" ) );
        };
        
        // Send the request with optional data
        xhr.send( qsp.join( "&" ) );
    });
};


// Expose
window.ajax = ajax;


})( window );
/*!
 *
 * Debounce methods
 * Sourced from here:
 * http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 *
 * @debounce
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Limit method calls
 * @memberof! <global>
 * @method debounce
 * @param {function} callback The method handler
 * @param {number} threshold The timeout delay in ms
 * @param {boolean} execAsap Call function at beginning or end of detection period
 *
 */
var debounce = function ( callback, threshold, execAsap ) {
    var timeout = null;
    
    return function debounced() {
        var args = arguments,
            context = this;
        
        function delayed() {
            if ( !execAsap ) {
                callback.apply( context, args );
            }
            
            timeout = null;
        }
        
        if ( timeout ) {
            clearTimeout( timeout );
            
        } else if ( execAsap ) {
            callback.apply( context, args );
        }
        
        timeout = setTimeout( delayed, (threshold || 100) );
    };
};


// Expose
window.debounce = debounce;


})( window );
/*!
 *
 * Use native element selector matching
 *
 * @matchElement
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Use native element selector matching
 * @memberof! <global>
 * @method matchElement
 * @param {object} el the element
 * @param {string} selector the selector to match
 * @returns element OR null
 *
 */
var matchElement = function ( el, selector ) {
    var method = ( el.matches ) ? "matches" : ( el.webkitMatchesSelector ) ? 
                                  "webkitMatchesSelector" : ( el.mozMatchesSelector ) ? 
                                  "mozMatchesSelector" : ( el.msMatchesSelector ) ? 
                                  "msMatchesSelector" : ( el.oMatchesSelector ) ? 
                                  "oMatchesSelector" : null;
    
    // Try testing the element agains the selector
    if ( method && el[ method ].call( el, selector ) ) {
        return el;
    
    // Keep walking up the DOM if we can
    } else if ( el !== document.documentElement && el.parentNode ) {
        return matchElement( el.parentNode, selector );
    
    // Otherwise we should not execute an event
    } else {
        return null;
    }
};


// Expose
window.matchElement = matchElement;


})( window );
/*!
 *
 * Parse query string into object literal representation
 *
 * @compat: jQuery, Ender, Zepto
 * @author: @kitajchuk
 * @url: http://github.com/kitajchuk
 *
 *
 */
(function ( context, undefined ) {


"use strict";


(function ( factory ) {
    
    if ( typeof define === "function" && define.amd ) {
        define( [ "jquery" ], factory );
        
    } else {
        factory( (context.jQuery || context.ender || context.Zepto) );
    }
    
})(function ( $ ) {
    
    var paramalama = function ( str ) {
        var query = decodeURIComponent( str ).match( /[#|?].*$/g ),
            ret = {};
        
        if ( query ) {
            query = query[ 0 ].replace( /^\?|^#|^\/|\/$|\[|\]/g, "" );
            query = query.split( "&" );
            
            for ( var i = 0, len = query.length; i < len; i++ ) {
                var pair = query[ i ].split( "=" ),
                    key = pair[ 0 ],
                    val = pair[ 1 ];
                
                if ( ret[ key ] ) {
                    // #2 https://github.com/kitajchuk/paramalama/issues/2
                    // This supposedly will work as of ECMA-262
                    // This works since we are not passing objects across frame boundaries
                    // and we are not considering Array-like objects. This WILL be an Array.
                    if ( {}.toString.call( ret[ key ] ) !== "[object Array]" ) {
                        ret[ key ] = [ ret[ key ] ];
                    }
                    
                    ret[ key ].push( val );
                    
                } else {
                    ret[ key ] = val;
                }
            }
        }
        
        return ret;
    };
    
    if ( typeof module === "object" && module && typeof module.exports === "object" ) {
        module.exports = paramalama;
    
    } else if ( $ !== undefined ) {
        $.paramalama = paramalama;
        context.paramalama = paramalama;
        
    } else {
        context.paramalama = paramalama;
    }
    
});


})( this );
/*!
 *
 * Placeholder Text Polyfill
 *
 * @compat: jQuery, Ender, Zepto
 * @author: @kitajchuk
 * @url: http://github.com/kitajchuk
 *
 *
 */
(function ( $ ) {


"use strict";


(function ( factory ) {
    
    if ( typeof define === "function" && define.amd ) {
        define( [ "jquery" ], factory );
        
    } else {
        factory( $ );
    }
    
})(function ( $ ) {
    
    var $_body = $( document.body ),
        
        _polyCSS = {
            display: "block",
            position: "relative",
            width: "100%"
        },
        
        _shimCSS = {
            cursor: "text",
            position: "absolute"
        },
        
        _cloneTextCSS = [
            "color",
            "letterSpacing",
            "lineHeight",
            "fontFamily",
            "fontSize",
            "fontStyle",
            "fontWeight",
            "textAlign",
            "textDecoration",
            "textTransform"
        ],
        
        // These props add up to be the absolute offsets
        _cloneShimCSS = {
            bottom: ["borderBottomWidth", "paddingBottom"],
            left: ["borderLeftWidth", "paddingLeft"],
            right: ["borderRightWidth", "paddingRight"],
            top: ["borderTopWidth", "paddingTop"]
        },
        
        _handleText = function () {
            var $this = $( this ),
                data = $this.data();
            
            if ( this.value === "" ) {
                data.$shim.text( $this.attr( "placeholder" ) );
                
            } else {
                data.$shim.text( "" );
            }
        },
        
        _pollTimeout,
        _pollForAuto = function () {
            _pollTimeout = setTimeout(function () {
                clearTimeout( _pollTimeout );
                
                $( ".placeholder__is-init" ).each(function () {
                    _handleText.call( this );
                });
                
                _pollForAuto();
                
            }, 250 );
        };
    
    $.support.placeholderText = ("placeholder" in document.createElement( "input" ));
    
    
    $.placeholderText = $.extend({
        elemClass: "placeholder-text__elem",
        matchParent: null,
        plugClass: "placeholder-text",
        shimClass: "placeholder-text__shim",
        tagName: "span"
        
    }, $.placeholderText || {} );
    
    
    $.fn.placeholderText = function () {
        if ( $.support.placeholderText ) {
            return this;
        }
        
        return this.filter( "[placeholder]" ).not( ".placeholder__is-init" ).each(function () {
            var tagName = this.tagName.toLowerCase(),
                $this = $( this ),
                $parent = $this.parent(),
                $shim = $( "<"+$.placeholderText.tagName+" />" ).addClass( $.placeholderText.shimClass );
            
            if ( $.placeholderText.matchParent && $parent.is( $.placeholderText.matchParent ) ) {
                $parent.addClass( $.placeholderText.plugClass ).css( _polyCSS );
                
            } else {
                $parent = $( "<"+$.placeholderText.tagName+" />" ).addClass( $.placeholderText.plugClass );
                $this.wrap( $parent.css( _polyCSS ) );
            }
            
            $shim.insertAfter( $this );
            $shim.text( $this.attr( "placeholder" ) );
            $shim.data( "$elem", $this );
            $shim.addClass( "placeholder-text__shim--"+tagName );
            $shim.css( _shimCSS );
            
            $.each( _cloneTextCSS, function ( i, prop ) {
                $shim.css( prop, $this.css( prop ) );
            });
            
            $.each( _cloneShimCSS, function ( prop, props ) {
                var pad = 0;
                
                $.each( props, function ( i ) {
                    var css = parseInt( $this.css( props[ i ] ), 10 );
                    
                    if ( css ) {
                        pad = pad+css;
                    }
                });
                
                $shim.css( prop, pad+"px" );
            });
            
            $this.data( "$shim", $shim );
            $this.addClass( "placeholder__is-init" );
            $this.addClass( $.placeholderText.elemClass );
        });
    };
    
    $_body.on( "click", "."+$.placeholderText.shimClass, function () {
        $( this ).data( "$elem" ).focus();
    });
    
    $_body.on( "keyup keydown keypress", "."+$.placeholderText.elemClass, _handleText );
    
    $_body.on( "blur", "."+$.placeholderText.elemClass, function () {
        try {
            clearTimeout( _pollTimeout );
            
        } catch ( err ) {}
        
        _handleText.call( this );
    });
    
    $_body.on( "focus", "."+$.placeholderText.elemClass, function () {
        _pollForAuto();
    });
    
});


})( (window.jQuery || window.ender || window.Zepto) );
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
 * A basic scrollto function without all the fuss
 *
 * @scroll2
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Window scroll2 function
 * @method scroll2
 * @requires Tween
 * @param {object} options Tween animation settings
 * <ul>
 * <li>duration - How long the tween will last</li>
 * <li>complete - The callback on end of animation</li>
 * <li>ease - The easing function to use</li>
 * <li>x/y - The axis to tween, where its going to land</li>
 * </ul>
 * @memberof! <global>
 *
 */
var scroll2 = function ( options ) {
    // Get current window positions
    var position = {
        x: (window.scrollX || document.documentElement.scrollLeft),
        y: (window.scrollY || document.documentElement.scrollTop)
    };

    // Normalize options
    options = (options || {});

    // Normalize easing method
    options.ease = (options.ease || Easing.swing);

    // Normalize duration
    options.duration = (options.duration || 600);

    // Normalize from
    options.from = ( options.y !== undefined ) ? position.y : position.x;

    // Normalize to
    options.to = ( options.y !== undefined ) ? options.y : options.x;

    // Apply update method
    options.update = function ( t ) {
        // Vertical scroll
        if ( options.y !== undefined ) {
            window.scrollTo( position.x, t );

        // Horizontal scroll
        } else if ( options.x !== undefined ) {
            window.scrollTo( t, position.y );
        }
    };

    return new Tween( options );
};


// Expose
window.scroll2 = scroll2;


})( window );
/*!
 *
 * Element state manager
 *
 * @compat: jQuery, Ender, Zepto
 * @author: @kitajchuk
 * @url: http://github.com/kitajchuk
 *
 *
 */
(function ( $ ) {


"use strict";


(function ( factory ) {

    if ( typeof define === "function" && define.amd ) {
        define( [ "jquery" ], factory );

    } else {
        factory( $ );
    }

})(function ( $ ) {

    $.fn.stateManage = function ( event, stateClass, callback ) {
        var $this = this;

        return this.on( event, function ( e ) {
            var $elem = $( this );

            $this.removeClass( stateClass );

            $elem.addClass( stateClass );

            if ( typeof callback === "function" ) {
                callback.call( this, e );
            }
        });
    };

});


})( (window.jQuery || window.ender || window.Zepto) );
/*!
 *
 * Throttle callbacks
 *
 * @throttle
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Limit method calls
 * @requires debounce
 * @memberof! <global>
 * @method throttle
 * @param {function} callback The method handler
 * @param {number} threshold The timeout delay in ms
 *
 */
var throttle = function ( callback, threshold ) {
    return debounce( callback, threshold );
};


// Expose
window.throttle = throttle;


})( window );