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
    /**
     *
     * Frame rate callback
     * @memberof Blit
     * @member Blit._blit
     *
     */
    _blit: null,
    
    /**
     *
     * FPS defaults to 60fps
     * @memberof Blit
     * @member Blit._fps
     *
     */
    _fps: 60,
    
    /**
     *
     * Timer interval based on FPS
     * @memberof Blit
     * @member Blit._interval
     *
     */
    _interval: (1000 / 60),
    
    /**
     *
     * Time now in ms
     * @memberof Blit
     * @member Blit._now
     *
     */
    _now: null,
    
    /**
     *
     * Time then in ms
     * @memberof Blit
     * @member Blit._then
     *
     */
    _then: null,
    
    /**
     *
     * Diff between now and then
     * @memberof Blit
     * @member Blit._delta
     *
     */
    _delta: null,
    
    /**
     *
     * Start time in ms
     * @memberof Blit
     * @member Blit._first
     *
     */
    _first: null,
    
    /**
     *
     * Elapsed time in ms
     * @memberof Blit
     * @member Blit._time
     *
     */
    _time: null,
    
    /**
     *
     * Current frame
     * @memberof Blit
     * @member Blit._frame
     *
     */
    _frame: 0,
    
    /**
     *
     * Timeout reference
     * @memberof Blit
     * @member Blit._timeout
     *
     */
    _cycle: null,
    
    /**
     *
     * Paused flag
     * @memberof Blit
     * @member Blit._paused
     *
     */
    _paused: false,
    
    /**
     *
     * Started iteration flag
     * @memberof Blit
     * @member Blit._started
     *
     */
    _started: false,
    
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
        // Set FPS
        this._fps = (options.fps || this._fps);
        
        // Update interval
        this._interval = (1000 / this._fps);
        
        // Set blit callback
        this._blit = (options.blit || this._blit);
        
        // Set paused on instantiation
        this._paused = (options.paused || this._paused);
        
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
     * Stope the gamecycle
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
        this._then = new Date().getTime();
        this._first = this._then;
        
        var self = this,
            blit = function () {
                self._cycle = raf( blit );
                self._now = new Date().getTime();
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
 * A basic cross-browser event api
 *
 * @EventApi
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * A vanilla javascript crossbrowser event api
 * @namespace EventApi
 * @memberof! <global>
 *
 */
var EventApi = {
    /**
     *
     * Add an event handler
     * @memberof EventApi
     * @method addEvent
     * @param {string} name The event to bind
     * @param {DOMElement} element The element to bind too
     * @param {function} callback The event handler to fire
     *
     */
    addEvent: function ( name, element, callback ) {
        var handler = function ( e ) {
            e = (e || window.event);
            
            if ( !e.target ) {
                e.target = e.srcElement;
            }
            
            if ( !e.preventDefault ) {
                e.preventDefault = function () {
                    e.returnValue = false;
                };
            }
            
            if ( typeof callback === "function" ) {
                return callback.call( this, e );
            }
        };
        
        if ( element.addEventListener ) {
            element.addEventListener( name, handler, false );
            
        } else {
            element.attachEvent( "on"+name, handler );
        }
    },
    
    /**
     *
     * Remove an event handler
     * @memberof EventApi
     * @method removeEvent
     * @param {string} name The event to unbind
     * @param {DOMElement} element The element to unbind from
     * @param {function} listener The event handler to unbind from
     *
     */
    removeEvent: function ( name, element, listener ) {
        if ( element.removeEventListener ) {
            element.removeEventListener( name, listener, false );
            
        } else {
            element.detachEvent( "on"+name, listener );
        }
    },
    
    /**
     *
     * Delegate an event handler
     * Does NOT handle complex selectors: "[data-effit].nodoit"
     * DOES handle simple selectors: "#id", ".class", "element"
     * @memberof EventApi
     * @method delegateEvent
     * @param {string} name The event to unbind
     * @param {DOMElement} element The element to unbind from
     * @param {string} selector The target selector to match
     * @param {function} callback The event handler
     *
     */
    delegateEvent: function ( name, element, selector, callback ) {
        var isClass = /^\./.test( selector ),
            isId = /^\#/.test( selector ),
            isNode = ( isClass || isId ) ? false : true,
            lookup = function ( target ) {
                var elem;
                
                if ( isNode && target && target.nodeName.toLowerCase() === selector ) {
                    elem = target;
                    
                } else if ( isClass && target ) {
                    var classes = target.className.split( " " );
                    
                    for ( var i = 0, len = classes.length; i < len; i++ ) {
                        if ( classes[ i ] === selector.replace( ".", "" ) ) {
                            elem = target;
                            break;
                        }
                    }
                    
                } else if ( isId && target ) {
                    if ( target.id === selector.replace( "#", "" ) ) {
                        elem = target;
                    }
                }
                
                // Walked all the way up the DOM, found nothing :-/
                if ( !elem && target === document.documentElement ) {
                    return undefined;
                
                // We can keep walking, either have a match or test parentNode    
                } else {
                    return elem || lookup( target.parentNode );
                }
            },
            handler = function ( e ) {
                var elem = lookup( e.target );
                
                e = e || window.event;
                
                if ( !e.target ) {
                    e.target = e.srcElement;
                }
                
                if ( !e.preventDefault ) {
                    e.preventDefault = function () {
                        e.returnValue = false;
                    };
                }
                
                if ( elem && typeof callback === "function" ) {
                    return callback.call( elem, e );
                }
            };
        
        if ( element.addEventListener ) {
            element.addEventListener( name, handler, false );
            
        } else {
            element.attachEvent( "on"+name, handler );
        }
    }
};


// Expose
window.EventApi = EventApi;


})( window );
/*!
 *
 * Performs a quick search against an array of terms
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
    /**
     *
     * Flag for input escaping
     * @memberof Isearch
     * @member Isearch.escapeInputs
     *
     */
    escapeInputs: false,
    
    /**
     *
     * Flag for only matching from front of input
     * @memberof Isearch
     * @member Isearch.matchFront
     *
     */
    matchFront: false,
    
    /**
     *
     * Flag for matching anywhere in input
     * @memberof Isearch
     * @member Isearch.matchAny
     *
     */
    matchAny: true,
    
    /**
     *
     * Flag for case sensitivity on matching
     * @memberof Isearch
     * @member Isearch.matchCase
     *
     */
    matchCase: false,
    
    /**
     *
     * Flag for sorting results alphabetically
     * @memberof Isearch
     * @member Isearch.alphaResults
     *
     */
    alphaResults: false,
    
    /**
     *
     * Expression for characters to escape from input
     * @memberof Isearch
     * @member Isearch._rEscChars
     *
     */
    _rEscChars: /\/|\\|\.|\||\*|\&|\+|\(|\)|\[|\]|\?|\$|\^/g,
    
    /**
     *
     * Isearch init constructor method
     * @memberof Isearch
     * @method Isearch.init
     * @param {object} options Any values used to perform search queries
     *
     */
    init: function ( options ) {
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
     * @method Isearch._sortAlpha
     * @param {string} a First test case
     * @param {string} b Second test case
     * @returns -1, 1 or 0
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
 * Konami code easter egg
 * Does cool stuff if you hook into it!
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
 * A konami code easter egg dispatcher
 * @constructor KonamiCode
 * @memberof! <global>
 *
 */
var KonamiCode = function () {
    return this.init.apply( this, arguments );
};

KonamiCode.prototype = {
    /**
     *
     * Timeout between key inputs to reset
     * @memberof KonamiCode
     * @member KonamiCode._delay
     *
     */
    _delay: 500,
    
    /**
     *
     * All supplied callbacks to this instance
     * @memberof KonamiCode
     * @member KonamiCode._callbacks
     *
     */
    _callbacks: [],
    
    /**
     *
     * Timeout reference
     * @memberof KonamiCode
     * @member KonamiCode._timeout
     *
     */
    _timeout: null,
    
    /**
     *
     * KonamiCode init constructor method
     * @memberof KonamiCode
     * @method KonamiCode.init
     *
     */
    init: function () {
        var code = "",
            self = this,
            handler = function ( e ) {
                try {
                    clearTimeout( self._timeout );
                    
                } catch ( error ) {}
                
                code = ""+(code+e.keyCode);
                
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
            
        } else {
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
 * A simple lazyloading class using requestAnimationFrame
 * Uses callbacks for handling updates per instance
 *
 * @LazyLoader
 * @author: kitajchuk
 *
 *
 */
(function ( window, undefined ) {


"use strict";


// Animation tracking
var raf = window.requestAnimationFrame,
    caf = window.cancelAnimationFrame,
    
    _i,
    _all = 0,
    _num = 0,
    _raf = null,
    _ini = false,
    _ani = function () {
        if ( _num !== _all ) {
            _raf = raf( _ani );
            
            for ( _i = _instances.length; _i--; ) {
                if ( _instances[ _i ]._numLoaded !== _instances[ _i ]._num2Load ) {
                    _instances[ _i ].handle();
                }
            }
            
        } else {
            caf( _raf );
            
            _raf = null;
            _ini = false;
        }
    },
    
    // Hold instances
    _instances = [];


/**
 *
 * A basic loader class with handling and callbacks
 * @constructor LazyLoader
 * @memberof! <global>
 *
 */
var LazyLoader = function () {
    return this.init.apply( this, arguments );
};

LazyLoader.prototype = {
    /**
     *
     * LazyLoader init constructor method
     * @memberof LazyLoader
     * @method LazyLoader.init
     * @param {DOMCollection} elements The elements to load against
     *
     */
    init: function ( elements ) {
        /**
         *
         * Internal reference to elements
         * @memberof LazyLoader
         * @member LazyLoader._elements
         *
         */
        this._elements = elements;
        
        /**
         *
         * How many elements have been loaded
         * @memberof LazyLoader
         * @member LazyLoader._numLoaded
         *
         */
        this._numLoaded = 0;
        
        /**
         *
         * How many total elements to load
         * @memberof LazyLoader
         * @member LazyLoader._num2Load
         *
         */
        this._num2Load = elements.length;
        
        /**
         *
         * Update/Handler listeners
         * @memberof LazyLoader
         * @member LazyLoader._handlers
         *
         */
        this._handlers = {
            update: null,
            handle: null
        };
        
        /**
         *
         * Before load callback
         * @memberof LazyLoader
         * @member LazyLoader._before
         *
         */
        this._before = null;
        
        /**
         *
         * After load callback
         * @memberof LazyLoader
         * @member LazyLoader._after
         *
         */
        this._after = null;
        
        // Increment ALL
        _all = _all+this._num2Load;
        
        // Private instances array
        _instances.push( this );
        
        // Animate!
        if ( !_ini ) {
            _ani();
            _ini = true;
        }
    },
    
    /**
     *
     * Apply handle and update listeners
     * @memberof LazyLoader
     * @method LazyLoader.on
     * @param {string} event The event to listen for
     * @param {function} handler The callback to fire
     *
     */
    on: function ( event, handler ) {
        this._handlers[ event ] = handler;
        
        return this;
    },
    
    /**
     *
     * Fire the update event listeners
     * @memberof LazyLoader
     * @method LazyLoader.update
     *
     */
    update: function () {
        for ( var i = 0, len = this._elements.length; i < len; i++ ) {
            this._fire( "update", this._elements[ i ] );
        }
        
        return this;
    },
    
    /**
     *
     * Fire the handle event listeners
     * @memberof LazyLoader
     * @method LazyLoader.handle
     *
     */
    handle: function () {
        var self = this;
        
        for ( var i = 0, len = this._elements.length; i < len; i++ ) {
            if ( this._fire( "handle", this._elements[ i ] ) && (!this._elements[ i ].dataset.handled && !this._elements[ i ].dataset.loaded) ) {
                _num++;
            
                this._numLoaded++;
            }
        }
        
        return this;
    },
    
    /**
     *
     * Apply the before callback
     * @memberof LazyLoader
     * @method LazyLoader.before
     * @param {function} fn The callback to apply
     *
     */
    before: function ( fn ) {
        if ( typeof fn === "function" ) {
            this._before = fn;
        }
        
        return this;
    },
    
    /**
     *
     * Apply the after callback
     * @memberof LazyLoader
     * @method LazyLoader.after
     * @param {function} fn The callback to apply
     *
     */
    after: function ( fn ) {
        if ( typeof fn === "function" ) {
            this._after = fn;
        }
        
        return this;
    },
    
    /**
     *
     * Load an image for an element typically on the handle listener callback
     * @memberof LazyLoader
     * @method LazyLoader.loadImage
     * @param {DOMElement} element The element to load for
     * @param {string} url The image url to load
     *
     */
    loadImage: function ( element, url ) {
        var self = this,
            image = new Image(),
            timeout;
        
        element.dataset.loading = true;
        
        if ( typeof this._before === "function" ) {
            this._before( element );
        }
        
        image.onload = function () {
            image = null;
            
            element.dataset.loaded = true;
            element.dataset.handled = true;
            element.dataset.loading = false;
            
            if ( typeof self._after === "function" ) {
                self._after( element );
            }
        };
        
        image.src = url;
    },
    
    /**
     *
     * Fire an event
     * @memberof LazyLoader
     * @method LazyLoader._fire
     * @param {string} event The event to dispatch
     * @param {DOMElement} element The element in iteration
     *
     */
    _fire: function ( event, element ) {
        var ret = false;
        
        if ( typeof this._handlers[ event ] === "function" ) {
            ret = this._handlers[ event ].call( this, element );
        }
        
        return ret;
    }
};


// Expose
window.LazyLoader = LazyLoader;


})( window );
/*!
 *
 * Handles wildcard route matching against urls
 *
 * @MatchRoute
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Performs a wildcard style match check against an array of routes given a url.
 * Valid wildcards are "any", "slug", "num" and "reg". Regex must be escaped for backslashes.
 * @constructor MatchRoute
 * @memberof! <global>
 *
 */
var MatchRoute = function () {
    return this.init.apply( this, arguments );
};

MatchRoute.prototype = {
    /**
     *
     * Expression match http/https
     * @memberof MatchRoute
     * @member MatchRoute._rHTTPs
     *
     */
    _rHTTPs: /^http[s]?:\/\/.*?\//,
    
    /**
     *
     * Expression match trail slashes
     * @memberof MatchRoute
     * @member MatchRoute._rTrails
     *
     */
    _rTrails: /^\/|\/$/g,
    
    /**
     *
     * Expression match hashbang/querystring
     * @memberof MatchRoute
     * @member MatchRoute._rHashQuery
     *
     */
    _rHashQuery: /[#|?].*$/g,
    
    /**
     *
     * Expression match supported wildcards
     * @memberof MatchRoute
     * @member MatchRoute._rWild
     *
     */
    _rWild: /^:num|^:slug|^:any|^:reg/,
    
    /**
     *
     * Expressions to match wildcards to uri segment
     * @memberof MatchRoute
     * @member MatchRoute._wilders
     *
     */
    _wilders: {
        ":slug": /^[A-Za-z0-9-_.]*/,
        ":num": /^[0-9]+$/,
        ":any": /^.*/,
        ":reg": /:reg|\(|\)/g
    },
    
    /**
     *
     * MatchRoute init constructor method
     * @memberof MatchRoute
     * @method MatchRoute.init
     * @param {array} routes Config routes can be passed on instantiation
     *
     */
    init: function ( routes ) {
        /**
         *
         * The routes config array
         * @memberof MatchRoute
         * @member _routes
         *
         */
        this._routes = ( routes ) ? this._cleanRoutes( routes ) : [];
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
            route = this._cleanRoute( url ),
            match,
            ruris,
            regex,
            uris = route.split( "/" ),
            uLen = uris.length,
            iLen = routes.length,
            ret = {
                match: false,
                matches: []
            };
        
        for ( var i = 0; i < iLen; i++ ) {
            ruris = routes[ i ].split( "/" );
            
            if ( ruris.length !== uris.length ) {
                continue;
            }
            
            segMatches = 0;
            
            for ( var j = 0; j < uLen; j++ ) {
                matches = ruris[ j ].match( this._rWild );
                
                if ( matches ) {
                    match = matches[ 0 ];
                    
                    if ( match === ":reg" ) {
                        regex = new RegExp( ruris[ j ].replace( this._wilders[ match ], "" ) );
                        
                    } else {
                        regex = this._wilders[ match ];
                    }
                    
                    if ( regex.test( uris[ j ] ) ) {
                        segMatches++;
                    }
                    
                } else {
                    if ( uris[ j ] === ruris[ j ] ) {
                        segMatches++;
                    }
                }
            }
            
            if ( segMatches === uris.length ) {
                ret.match = true;
                ret.matches.push( routes[ i ] );
                
                break;
            }
        }
        
        return ret;
    },
    
    /**
     *
     * Clean a route string
     * @memberof MatchRoute
     * @method parse
     * @param {string} route the route to clean
     * @returns cleaned route string
     *
     */
    _cleanRoute: function ( route ) {
        route = route.replace( this._rHTTPs, "" );
        route = route.replace( this._rTrails, "" );
        route = route.replace( this._rHashQuery, "" );
        
        return route;
    },
    
    /**
     *
     * Clean an array of route strings
     * @memberof MatchRoute
     * @method parse
     * @param {array} routes the routes to clean
     * @returns cleaned routes array
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
 * Handles html5 video and audio using the audio api.
 *
 * @MediaBox
 * @author: kitajchuk
 * @require: Easing
 * @require: Tween
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Manage audio and video with playback.
 * Calls MediaBox.prototype.init as constructor.
 * @constructor MediaBox
 * @memberof! <global>
 *
 */
var MediaBox = function () {
    return this.init.apply( this, arguments );
};

MediaBox.prototype = {
    constructor: MediaBox,
    
    /**
     *
     * Expression match hashbang/querystring
     * @memberof MediaBox
     * @member MediaBox._rHashQuery
     *
     */
    _rHashQuery: /[#|?].*$/g,
    
    /**
     *
     * MediaBox stopped state constant
     * @memberof MediaBox
     * @member MediaBox.STATE_STOPPED
     *
     */
    STATE_STOPPED: 0,
    
    /**
     *
     * MediaBox stopping state constant
     * @memberof MediaBox
     * @member MediaBox.STATE_STOPPING
     *
     */
    STATE_STOPPING: 1,
    
    /**
     *
     * MediaBox paused state constant
     * @memberof MediaBox
     * @member MediaBox.STATE_PAUSED
     *
     */
    STATE_PAUSED: 2,
    
    /**
     *
     * MediaBox playing state constant
     * @memberof MediaBox
     * @member MediaBox.STATE_PLAYING
     *
     */
    STATE_PLAYING: 3,
    
    /**
     *
     * MediaBox init constructor method
     * @memberof MediaBox
     * @method MediaBox.init
     *
     */
    init: function () {
        var self = this;
        
        /**
         *
         * MediaBox supports
         * @memberof MediaBox
         * @member MediaBox._supported
         *
         */
        this._supported = {};
        this._supported.audio = this._getAudioSupport();
        this._supported.video = this._getVideoSupport();
        
        /**
         *
         * MediaBox information for each channel
         * @memberof MediaBox
         * @member MediaBox._channels
         *
         */
        this._channels = {};
        
        /**
         *
         * MediaBox holds all audio tracks
         * @memberof MediaBox
         * @member MediaBox._audio
         *
         */
        this._audio = {};
        
        /**
         *
         * MediaBox holds all video tracks
         * @memberof MediaBox
         * @member MediaBox._video
         *
         */
        this._video = {};
        
        /**
         *
         * MediaBox boolean to stop/start all audio
         * @memberof MediaBox
         * @member MediaBox._audioPaused
         *
         */
        this._audioPaused = false;
    },
    
    /**
     *
     * MediaBox crossbrowser create audio context
     * @memberof MediaBox
     * @method MediaBox.createAudioContext
     * @returns instance of audio context
     *
     */
    createAudioContext: function () {
        var AudioContext;
        
        if ( window.AudioContext ) {
            AudioContext = AudioContext;
            
        } else if ( window.webkitAudioContext ) {
            AudioContext = webkitAudioContext;
        }
        
        return ( AudioContext ) ? new AudioContext() : AudioContext;
    },
    
    /**
     *
     * MediaBox crossbrowser create gain node
     * @memberof MediaBox
     * @method MediaBox.createGainNode
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
     * MediaBox load media config JSON formatted in Akihabara bundle style
     * @memberof MediaBox
     * @method MediaBox.loadMedia
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
     * @method MediaBox.addMedia
     * @param {object} json Akihabara formatted media bundle object
     * @param {function} callback function fired on XMLHttpRequest.onload
     *
     */
    addMedia: function ( json, callback ) {
        var current = 0,
            total = 0,
            func = function () {
                current++;
                
                if ( (typeof callback === "function") && (current === total) ) {
                    callback();
                }
            };
        
        for ( var m in json ) {
            total = total + json[ m ].length;
            
            for ( var i = json[ m ].length; i--; ) {
                this[ m ]( json[ m ][ i ], func );
            }
        }
    },
    
    /**
     *
     * MediaBox add a video element
     * @memberof MediaBox
     * @method MediaBox.addVideo
     * @param {array} obj Akihabara formatted media bundle
     * @param {function} callback function fired on XMLHttpRequest.onload
     *
     */
    addVideo: function ( obj, callback ) {
        var self = this,
            id = obj[ 0 ],
            xhr = new XMLHttpRequest();
        
        if ( !this._channels[ obj[ 2 ].channel ] ) {
            this._channels[ obj[ 2 ].channel ] = {};
        }
        
        // Create video object
        this._video[ id ] = {};
        this._video[ id ].channel = obj[ 2 ].channel;
        this._video[ id ].loop = (obj[ 2 ].loop || false);
        this._video[ id ].sources = obj[ 1 ];
        this._video[ id ].element = document.createElement( "video" );
        this._video[ id ].element.setAttribute( "controls", false );
        this._video[ id ]._usedSource = this._getUsedMediaSource( "video", this._video[ id ].sources );
        this._video[ id ]._events = {};
        
        xhr.open( "GET", this._video[ id ]._usedSource.source, true );
        xhr.onload = function ( e ) {
            var source = document.createElement( "source" );
                source.src = self._video[ id ]._usedSource.source;
                source.type = self._getMimeFromMedia( self._video[ id ]._usedSource.source );
        
            self._video[ id ].element.appendChild( source );
            
            if ( typeof callback === "function" ) {
                callback();
            }
        };
        xhr.send();
    },
    
    /**
     *
     * MediaBox add a video element event listener
     * @memberof MediaBox
     * @method MediaBox.addVideoEvent
     * @param {string} id Video id to add event for
     * @param {string} event Event to add
     * @param {function} callback The event handler to call
     *
     */
    addVideoEvent: function ( id, event, callback ) {
        if ( this._video[ id ] ) {
            this._video[ id ]._events[ event ] = function () {
                if ( typeof callback === "function" ) {
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
     * @method MediaBox.addVideoEvent
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
     * @method MediaBox.getVideo
     * @param {id} string reference id for video
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
     * MediaBox play video element by id
     * @memberof MediaBox
     * @method MediaBox.playVideo
     * @param {id} string reference id for video
     *
     */
    playVideo: function ( id ) {
        if ( this._video[ id ] ) {
            this._video[ id ].element.volume = this._channels[ this._video[ id ].channel ].volume;
            this._video[ id ].element.play();
        }
    },
    
    /**
     *
     * MediaBox stop video element by id
     * @memberof MediaBox
     * @method MediaBox.playVideo
     * @param {id} string reference id for video
     *
     */
    stopVideo: function ( id ) {
        if ( this._video[ id ] ) {
            this._video[ id ].element.pause();
        }
    },
    
    /**
     *
     * MediaBox add an audio context
     * @memberof MediaBox
     * @method MediaBox.addAudio
     * @param {array} obj Akihabara formatted media bundle
     * @param {function} callback function fired on XMLHttpRequest.onload
     *
     */
    addAudio: function ( obj, callback ) {
        var self = this,
            id = obj[ 0 ],
            xhr = new XMLHttpRequest();
        
        if ( !this._channels[ obj[ 2 ].channel ] ) {
            this._channels[ obj[ 2 ].channel ] = {};
        }
        
        // Create audio object
        this._audio[ id ] = {};
        this._audio[ id ].channel = obj[ 2 ].channel;
        this._audio[ id ].loop = (obj[ 2 ].loop || false);
        this._audio[ id ].sources = obj[ 1 ];
        this._audio[ id ].context = this.createAudioContext();
        this._audio[ id ]._usedSource = this._getUsedMediaSource( "audio", this._audio[ id ].sources );
        this._audio[ id ].state = this.STATE_STOPPED;
        
        xhr.open( "GET", this._audio[ id ]._usedSource.source, true );
        xhr.responseType = "arraybuffer";
        xhr.onload = function ( e ) {
            self._audio[ id ].context.decodeAudioData( xhr.response, function ( buffer ) {
                self._audio[ id ].startTime = 0;
                self._audio[ id ].startOffset = 0;
                self._audio[ id ].buffer = buffer;
                self._audio[ id ].gainNode = self.createGainNode( self._audio[ id ].context );
                
                if ( typeof callback === "function" ) {
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
     * @method MediaBox.playAudio
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
            
            this._sourceStart( this._audio[ id ] );
            
            this._audio[ id ].state = this.STATE_PLAYING;
        }
    },
    
    /**
     *
     * MediaBox simply a wrapper for playAudio
     * @memberof MediaBox
     * @method MediaBox.hitAudio
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
     * @method MediaBox.stopAudio
     * @param {string} id string reference id for audio
     *
     */
    stopAudio: function ( id ) {
        if ( this._audio[ id ] ) {
            this._audio[ id ].startTime = 0;
            this._audio[ id ].startOffset = 0;
            this._audio[ id ].state = this.STATE_STOPPED;
            
            this._sourceStop( this._audio[ id ] );
        }
    },
    
    /**
     *
     * MediaBox pause playing audio, calls _sourceStop
     * @memberof MediaBox
     * @method MediaBox.pauseAudio
     * @param {string} id id of audio to pause
     *
     */
    pauseAudio: function ( id ) {
        if ( this._audio[ id ] ) {
            this._audio[ id ].startOffset += (this._audio[ id ].context.currentTime - this._audio[ id ].startTime);
            this._audio[ id ].state = this.STATE_PAUSED;
            
            this._sourceStop( this._audio[ id ] );
        }
    },
    
    /**
     *
     * MediaBox fade in audio context volume
     * @memberof MediaBox
     * @method MediaBox.fadeAudioIn
     * @param {string} id string reference id for audio
     * @param {number} duration tween time in ms
     *
     */
    fadeAudioIn: function ( id, duration ) {
        if ( this._audio[ id ].state === this.STATE_PLAYING ) {
            //console.log( "@MediaBox:fadeAudioIn Already playing " + id );
            
            return this;
        }
        
        var self = this,
            volume = this._channels[ this._audio[ id ].channel ].volume;
        
        if ( this._audio[ id ] ) {
            // Only reset volume and play if audio is stopped
            // Audio state could be STATE_STOPPING at this point
            if ( this._audio[ id ].state === this.STATE_STOPPED ) {
                this._audio[ id ].gainNode.gain.value = 0;
            
                this.playAudio( id );
                
            } else if ( this._audio[ id ].state === this.STATE_STOPPING ) {
                this._audio[ id ].state = this.STATE_PLAYING;
            }
            
            new Tween( (duration || 1000), 0, volume, function ( v ) {
                self._audio[ id ].gainNode.gain.value = v;
            });
        }
    },
    
    /**
     *
     * MediaBox fade out audio context volume
     * @memberof MediaBox
     * @method MediaBox.fadeAudioOut
     * @param {string} id string reference id for audio
     * @param {number} duration tween time in ms
     *
     */
    fadeAudioOut: function ( id, duration ) {
        if ( this._audio[ id ].state === this.STATE_STOPPING ) {
            //console.log( "@MediaBox:fadeAudioOut Already stopping " + id );
            
            return this;
        }
        
        var self = this;
        
        if ( this._audio[ id ] ) {
            this._audio[ id ].state = this.STATE_STOPPING;
            
            new Tween( (duration || 1000), this._audio[ id ].gainNode.gain.value, 0, function ( v ) {
                // Check audio state on fadeout in case it is started again
                // before the duration of the fadeout is complete.
                if ( self._audio[ id ].state === self.STATE_STOPPING ) {
                    self._audio[ id ].gainNode.gain.value = v;
                
                    if ( self._audio[ id ].gainNode.gain.value === 0 ) {
                        self.stopAudio( id );
                    }
                }
            });
        }
    },
    
    /**
     *
     * MediaBox pause all playing audio for a given channel id
     * @memberof MediaBox
     * @method MediaBox.stopChannel
     * @param {string} channel string reference id for channel
     *
     */
    stopChannel: function ( channel ) {
        for ( var id in this._audio ) {
            if ( this._audio[ id ].channel === channel && this._audio[ id ].state === this.STATE_PLAYING ) {
                this.pauseAudio( id );
            }
        }
    },
    
    /**
     *
     * MediaBox resume all playing audio for a given channel id
     * @memberof MediaBox
     * @method MediaBox.playChannel
     * @param {string} channel string reference id for channel
     *
     */
    playChannel: function ( channel ) {
        for ( var id in this._audio ) {
            if ( this._audio[ id ].channel === channel && this._audio[ id ].state === this.STATE_PAUSED ) {
                this.playAudio( id );
            }
        }
    },
    
    /**
     *
     * MediaBox fade out all playing audio for a given channel id
     * @memberof MediaBox
     * @method MediaBox.fadeChannelOut
     * @param {string} channel string reference id for channel
     * @param {number} duration tween time in ms
     *
     */
    fadeChannelOut: function ( channel, duration ) {
        for ( var id in this._audio ) {
            if ( this._audio[ id ].channel === channel && this._audio[ id ].state === this.STATE_PLAYING ) {
                this.fadeAudioOut( id, duration );
            }
        }
    },
    
    /**
     *
     * MediaBox fade in all playing audio for a given channel id
     * @memberof MediaBox
     * @method MediaBox.fadeChannelIn
     * @param {string} channel string reference id for channel
     * @param {number} duration tween time in ms
     *
     */
    // Need to figure out how this would work
    fadeChannelIn: function ( channel, duration ) {
        for ( var id in this._audio ) {
            if ( this._audio[ id ].channel === channel && this._audio[ id ].state === this.STATE_PAUSED ) {
                this.fadeAudioIn( id, duration );
            }
        }
    },
    
    /**
     *
     * MediaBox crossfade between 2 audio contexts on a given channel
     * @memberof MediaBox
     * @method MediaBox.crossFadeChannel
     * @param {string} channel string reference id for channel
     * @param {string} id string reference id for audio to bring in
     * @param {number} duration tween time in ms
     *
     */
    crossFadeChannel: function ( channel, id, duration ) {
        for ( var i in this._audio ) {
            if ( this._audio[ i ].channel === channel && this._audio[ i ].state === this.STATE_PLAYING ) {
                this.fadeAudioOut( i, duration );
            }
        }
        
        this.fadeAudioIn( id, duration );
    },
    
    /**
     *
     * MediaBox set the master volume for a channel
     * @memberof MediaBox
     * @method MediaBox.setChannelVolume
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
     * @method MediaBox.pauseAll
     *
     */
    pauseAll: function ( channel ) {
        if ( this._audioPaused ) {
            return this;
        }
        
        this._audioPaused = true;
        
        for ( var id in this._audio ) {
            if ( this._audio[ id ].state === this.STATE_PLAYING ) {
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
     * @method MediaBox.resumeAll
     *
     */
    resumeAll: function ( channel ) {
        if ( !this._audioPaused ) {
            return this;
        }
        
        this._audioPaused = false;
        
        for ( var id in this._audio ) {
            if ( this._audio[ id ].state === this.STATE_PAUSED ) {
                if ( this._audio[ id ].channel === channel ) {
                    this.playAudio( id );
                }
            }
        }
    },
    
    /**
     *
     * MediaBox private play an audio context
     * @memberof MediaBox
     * @method MediaBox._sourceStart
     * @param {string} track audio object to play
     *
     */
    _sourceStart: function ( track ) {
        if ( !track.source.start ) {
            track.source.noteOn( 0, track.startOffset % track.buffer.duration );
            
        } else {
            track.source.start( 0, track.startOffset % track.buffer.duration );
        }
    },
    
    /**
     *
     * MediaBox private stop an audio context
     * @memberof MediaBox
     * @method MediaBox._sourceStop
     * @param {string} track audio object to stop
     *
     */
    _sourceStop: function ( track ) {
        if ( !track.source.stop ) {
            track.source.noteOff( 0 );
            
        } else {
            track.source.stop( 0 );
        }
    },
    
    /**
     *
     * MediaBox private get mimetype string from media source
     * @memberof MediaBox
     * @method MediaBox._getMimeFromMedia
     * @param {string} src media file source
     *
     */
    _getMimeFromMedia: function ( src ) {
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
    },
    
    /**
     *
     * Get the audio source that should be used
     * @memberof MediaBox
     * @method MediaBox._getUsedMediaSource
     * @param {string} media the media type to check
     * @param {array} sources Array of media sources
     * @returns object
     *
     */
    _getUsedMediaSource: function ( media, sources ) {
        var source, canPlay;
        
        for ( var i = sources.length; i--; ) {
            var src = sources[ i ].split( "." ).pop().toLowerCase().replace( this._rHashQuery, "" );
            
            if ( media === "video" && src === "mp4" ) {
                if ( (this._supported.video.mpeg4 === "probably" || this._supported.video.h264 === "probably") ) {
                    source = sources[ i ];
                    
                    canPlay = "probably";
                    
                } else if ( (this._supported.video.mpeg4 === "maybe" || this._supported.video.h264 === "maybe") ) {
                    source = sources[ i ];
                    
                    canPlay = "maybe";
                }
                
            } else if ( this._supported[ media ][ src ] === "probably" ) {
                source = sources[ i ];
                
                canPlay = "probably";
                
            } else if ( this._supported[ media ][ src ] === "maybe" ) {
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
    },
    
    /**
     *
     * Borrowed(ish)
     * Modernizr v2.7.1
     * www.modernizr.com
     * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
     * Available under the BSD and MIT licenses: www.modernizr.com/license/
     *
     * @memberof MediaBox
     * @method MediaBox._getAudioSupport
     * @returns object
     *
     */
    _getAudioSupport: function () {
        var elem = document.createElement( "audio" ),
            rnos = /^no$/,
            ret = {};

        try {
            if ( elem.canPlayType ) {
                ret.ogg = elem.canPlayType( 'audio/ogg; codecs="vorbis"' ).replace( rnos, "" );
                ret.mp3 = elem.canPlayType( 'audio/mpeg;' ).replace( rnos, "" );
                ret.wav = elem.canPlayType( 'audio/wav; codecs="1"').replace( rnos, "" );
                ret.m4a = (elem.canPlayType( 'audio/x-m4a;' ) || elem.canPlayType( 'audio/aac;' )).replace( rnos, "" );
            }
            
        } catch ( e ) {}

        return ret;
    },
    
    /**
     *
     * Borrowed(ish)
     * Modernizr v2.7.1
     * www.modernizr.com
     * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
     * Available under the BSD and MIT licenses: www.modernizr.com/license/
     *
     * @memberof MediaBox
     * @method MediaBox._getVideoSupport
     * @returns object
     *
     */
    _getVideoSupport: function () {
        var elem = document.createElement( "video" ),
            rnos = /^no$/,
            ret = {};

        try {
            if ( elem.canPlayType ) {
                ret.mpeg4 = elem.canPlayType( 'video/mp4; codecs="mp4v.20.8"' ).replace( rnos, "" );
                ret.ogg = elem.canPlayType( 'video/ogg; codecs="theora"' ).replace( rnos, "" );
                ret.h264 = elem.canPlayType( 'video/mp4; codecs="avc1.42E01E"' ).replace( rnos, "" );
                ret.webm = elem.canPlayType( 'video/webm; codecs="vp8, vorbis"' ).replace( rnos, "" );
            }

        } catch ( e ) {}

        return ret;
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
 * @constructor PushState
 * @memberof! <global>
 *
 */
var PushState = function () {
    return this.init.apply( this, arguments );
};

PushState.prototype = {
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
         * Expression match #
         * @memberof PushState
         * @member PushState._rHash
         *
         */
        this._rHash = /#/;
        
        /**
         *
         * Expression match http/https
         * @memberof PushState
         * @member PushState._rHTTPs
         *
         */
        this._rHTTPs = /^http[s]?:\/\/.*?\//;
        
        /**
         *
         * Flag whether state is enabled
         * @memberof PushState
         * @member _enabled
         *
         */
        this._enabled = false;
        
        /**
         *
         * Flag whether pushState is enabled
         * @memberof PushState
         * @member _pushable
         *
         */
        this._pushable = ("history" in window && "pushState" in window.history);
        
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
         *
         */
        this._hashable = ("onhashchange" in window);
        
        /**
         *
         * Flag when hash is changed by PushState
         * This allows appropriate replication of popstate
         * @memberof PushState
         * @member _ishashpushed
         *
         */
        this._ishashpushed = false;
        
        /**
         *
         * Unique ID ticker
         * @memberof PushState
         * @member _uid
         *
         */
        this._uid = 0;
        
        /**
         *
         * Stored state objects
         * @memberof PushState
         * @member _states
         *
         */
        this._states = {};
        this._states[ url ] = {
            uid: this._getUid(),
            cached: false
        };
        
        /**
         *
         * Stored response objects
         * @memberof PushState
         * @member _responses
         *
         */
        this._responses = {};
        
        /**
         *
         * Event callbacks
         * @memberof PushState
         * @member _callbacks
         *
         */
        this._callbacks = {
            pop: [],
            before: [],
            after: []
        };

        /**
         *
         * Flag whether to use ajax
         * @memberof PushState
         * @member _async
         *
         */
        this._async = ( options.async !== undefined ) ? options.async : true;
        
        /**
         *
         * Flag whether to use cached responses
         * @memberof PushState
         * @member _caching
         *
         */
        this._caching = ( options.caching !== undefined ) ? options.caching : true;

        // Enable the popstate event
        this._stateEnable();
    },
    
    /**
     *
     * Push onto the History state
     * @memberof PushState
     * @method push
     * @param {string} url address to push to history
     * @param {function} callback function to call when done
     *
     */
    push: function ( url, callback ) {
        var self = this;
        
        this._fire( "before" );
        
        // Break on cached
        if ( this._stateCached( url ) ) {
            this._push( url );
                    
            callback( this._responses[ url ] );
        
        // Push new state    
        } else {
            this._states[ url ] = {
                uid: this._getUid(),
                cached: false
            };
            
            if ( this._async ) {
                this._getUrl( url, function ( response ) {
                    self._push( url );
    
                    self._fire( "after", response );
                    
                    if ( typeof callback === "function" ) {
                        callback( response );
                    }
                });
    
            } else {
                this._push( url );

                this._fire( "after" );
                
                if ( typeof callback === "function" ) {
                    callback();
                }
            }
        }
    },
    
    /**
     *
     * Bind a callback to run before state is pushed
     * @memberof PushState
     * @method onBeforeState
     * @param {function} callback function to call
     *
     */
    onBeforeState: function ( callback ) {
        this._bind( "before", callback );
    },
    
    /**
     *
     * Bind a callback to run after state is pushed
     * @memberof PushState
     * @method onBeforeState
     * @param {function} callback function to call
     *
     */
    onAfterState: function ( callback ) {
        this._bind( "after", callback );
    },
    
    /**
     *
     * Bind a callback to run when the popstate event is fired
     * @memberof PushState
     * @method onBeforeState
     * @param {function} callback function to call
     *
     */
    onPopState: function ( callback ) {
        this._bind( "pop", callback );
    },
    
    /**
     *
     * Manually go back in history state
     * @memberof PushState
     * @method goBack
     *
     */
    goBack: function () {
        this._history.back();
        this._fire( "back" );
    },
    
    /**
     *
     * Manually go forward in history state
     * @memberof PushState
     * @method goForward
     *
     */
    goForward: function () {
        this._history.forward();
        this._fire( "forward" );
    },
    
    /**
     *
     * Calls window.history.pushState
     * @memberof PushState
     * @method _push
     * @param {string} url The url to push
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
     * Get a unique ID
     * @memberof PushState
     * @method _getUid
     *
     */
    _getUid: function () {
        this._uid = (this._uid + 1);
        
        return this._uid;
    },
    
    /**
     *
     * Request a url with an XMLHttpRequest
     * @memberof PushState
     * @method _getUrl
     * @param {string} url The url to request
     * @param {function} callback The function to call when done
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
                }
            }
        };
        
        xhr.send();
    },
    
    /**
     *
     * Bind a callback to an event
     * @memberof PushState
     * @method _bind
     * @param {string} event The event to bind to
     * @param {function} callback The function to call
     *
     */
    _bind: function ( event, callback ) {
        if ( this._callbacks[ event ] && typeof callback === "function" ) {
            this._callbacks[ event ].push( callback );
        }
    },
    
    /**
     *
     * Fire an events callbacks
     * @memberof PushState
     * @method _fire
     * @param {string} event The event to fire
     * @param {string} url The current url
     *
     */
    _fire: function ( event, url ) {
        for ( var i = this._callbacks[ event ].length; i--; ) {
            this._callbacks[ event ][ i ].apply( this, [].slice.call( arguments, 1 ) );
        }
    },
    
    /**
     *
     * Bind this instances state handler
     * @memberof PushState
     * @method _stateEnabled
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
                    self._fire( "pop", url, self._responses[ url ] );
                    
                } else {
                    self._getUrl( url, function ( response ) {
                        self._fire( "pop", url, response );
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
 * Handles basic get routing
 *
 * @Router
 * @author: kitajchuk
 * @require: PushState
 * @require: MatchRoute
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * A simple router Class
 * @constructor Router
 * @memberof! <global>
 *
 */
var Router = function () {
    return this.init.apply( this, arguments );
};

Router.prototype = {
    /**
     *
     * Router init constructor method
     * @memberof Router
     * @method Router.init
     * @param {object} options Settings for PushState
     * <ul>
     * <li>options.async</li>
     * <li>options.caching</li>
     * </ul>
     *
     */
    init: function ( options ) {
        var self = this;
        
        /**
         *
         * Internal MatchRoute instance
         * @memberof Router
         * @member _matcher
         *
         */
        this._matcher = new MatchRoute();
        
        /**
         *
         * Internal PushState instance
         * @memberof Router
         * @member _pusher
         *
         */
        this._pusher = new PushState( options );
        
        /**
         *
         * Event handling callbacks
         * @memberof Router
         * @member _callbacks
         *
         */
        this._callbacks = {
            get: []
        };
        
        /**
         * GET click event handler
         * @memberof Router
         * @method _handler
         *
         */
        this._handler = function ( e ) {
            // Only capture <a> elements
            if ( e.target.tagName.toLowerCase() === "a" ) {
                var elem = e.target;
                
                if ( elem.href.indexOf( "#" ) === -1 && self._matcher.test( elem.href ) ) {
                    self._pusher.push( elem.href, function ( response ) {
                        self._fire( "get", elem.href, response );
                    });
                }
            }
        };
        
        /**
         *
         * Bind GET requests to links
         *
         */
        if ( document.addEventListener ) {
            document.addEventListener( "click", this._handler, false );
            
        } else {
            document.attachEvent( "onclick", this._handler );
        }
        
        // Listen for pop events
        setTimeout(function () {
            self._pusher.onPopState(function ( url, data ) {
                self._fire( "get", url, data );
            });
            
        }, 1000 );
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
        callback._route = route;
        
        this._bind( "get", callback );
    },
    
    /**
     *
     * Bind an event to a callback
     * @memberof Router
     * @method _bind
     * @param {string} event what to bind on
     * @param {function} callback fired on event
     *
     */
    _bind: function ( event, callback ) {
        if ( this._callbacks[ event ] && typeof callback === "function" ) {
            this._callbacks[ event ].push( callback );
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
     *
     */
    _fire: function ( event, url, response ) {
        if ( this._callbacks[ event ] ) {
            for ( var i = this._callbacks[ event ].length; i--; ) {
                var compare = this._matcher.compare( this._callbacks[ event ][ i ]._route, url );
                
                if ( compare.match ) {
                    this._callbacks[ event ][ i ].call( this, {
                        route: this._matcher._cleanRoute( url ),
                        response: response
                    });
                }
            }
        }
    }
};


// Expose
window.Router = Router;


})( window );
/*!
 *
 * A promising timeout utility
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
    /**
     *
     * Step callback
     * @memberof Stagger
     * @member Stagger._step
     *
     */
    _step: null,
    
    /**
     *
     * When iteration callbacks
     * @memberof Stagger
     * @member Stagger._when
     *
     */
    _when: {},
    
    /**
     *
     * Done callback
     * @memberof Stagger
     * @member Stagger._done
     *
     */
    _done: null,
    
    /**
     *
     * Timeout delay
     * @memberof Stagger
     * @member Stagger._delay
     *
     */
    _delay: 250,
    
    /**
     *
     * Current step iteration
     * @memberof Stagger
     * @member Stagger._current
     *
     */
    _current: 0,
    
    /**
     *
     * Number of step occurrences
     * @memberof Stagger
     * @member Stagger._occurrences
     *
     */
    _occurrences: 0,
    
    /**
     *
     * Timeout reference
     * @memberof Stagger
     * @member Stagger._timeout
     *
     */
    _timeout: null,
    
    /**
     *
     * Paused flag
     * @memberof Stagger
     * @member Stagger._paused
     *
     */
    _paused: false,
    
    /**
     *
     * Started iteration flag
     * @memberof Stagger
     * @member Stagger._started
     *
     */
    _started: false,
    
    /**
     *
     * Resolved iteration flag
     * @memberof Stagger
     * @member Stagger._resolved
     *
     */
    _resolved: false,
    
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
        this._delay = options.delay || this._delay;
        this._occurrences = options.occurrences;
        this._paused = options.paused || this._paused;
        
        if ( !this._started && !this._paused ) {
            this.start();
        }
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
        this._started = true;
        
        if ( this._paused ) {
            this.play();
        }
        
        this._stagger();
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
    },
    
    /**
     *
     * Initialize the iteration loop
     * @memberof Stagger
     * @method Stagger._stagger
     *
     */
    _stagger: function () {
        var self = this;
        
        var stagger = function () {
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
                    if ( typeof self._done === "function" ) {
                        self._done();
                    }
                    
                    self._resolve();
                    
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
/*!
 *
 * Throttle methods
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
 * @memberof! <global>
 * @method throttle
 * @param {number} threshold The timeout delay in ms
 * @param {function} callback The method handler
 *
 */
var throttle = function ( threshold, callback ) {
    var timeout = null;
    
    return function throttled() {
        var args = arguments,
            context = this;
        
        function delayed() {
            callback.apply( context, args );
            
            timeout = null;
        }
        
        if ( timeout ) {
            clearTimeout( timeout );
        }
        
        timeout = setTimeout( delayed, (threshold || 100) );
    };
};


// Expose
window.throttle = throttle;


})( window );