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
    easeInQuad: function ( t ) { return t*t },
    
    /**
     *
     * Decelerating to zero velocity
     * @method easeOutQuad
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeOutQuad: function ( t ) { return t*(2-t) },
    
    /**
     *
     * Acceleration until halfway, then deceleration
     * @method easeInOutQuad
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInOutQuad: function ( t ) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
    
    /**
     *
     * Accelerating from zero velocity
     * @method easeInCubic
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInCubic: function ( t ) { return t*t*t },
    
    /**
     *
     * Decelerating to zero velocity
     * @method easeOutCubic
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeOutCubic: function ( t ) { return (--t)*t*t+1 },
    
    /**
     *
     * Acceleration until halfway, then deceleration
     * @method easeInOutCubic
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInOutCubic: function ( t ) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
    
    /**
     *
     * Accelerating from zero velocity
     * @method easeInQuart
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInQuart: function ( t ) { return t*t*t*t },
    
    /**
     *
     * Decelerating to zero velocity
     * @method easeOutQuart
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeOutQuart: function ( t ) { return 1-(--t)*t*t*t },
    
    /**
     *
     * Acceleration until halfway, then deceleration
     * @method easeInOutQuart
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInOutQuart: function ( t ) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
    
    /**
     *
     * Accelerating from zero velocity
     * @method easeInQuint
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInQuint: function ( t ) { return t*t*t*t*t },
    
    /**
     *
     * Decelerating to zero velocity
     * @method easeOutQuint
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeOutQuint: function ( t ) { return 1+(--t)*t*t*t*t },
    
    /**
     *
     * Acceleration until halfway, then deceleration
     * @method easeInOutQuint
     * @param {number} t Difference in time
     * @memberof Easing
     * @returns a new t value
     *
     */
    easeInOutQuint: function ( t ) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
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
 * @author: kitajchuk
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
    },
    
    /**
     *
     * Handle an event with a delayed callback
     * @memberof EventApi
     * @method throttleEvent
     * @param {string} name The event to unbind
     * @param {DOMElement} element The element to unbind from
     * @param {number} delay The timeout delay in ms
     * @param {function} callback The event handler
     *
     */
    throttleEvent: function ( name, element, delay, callback ) {
        var timeout = null;
        
        EventApi.addEvent( name, element, function () {
            return function () {
                var context = this,
                    args = arguments;
                
                clearTimeout( timeout );
                
                timeout = setTimeout(function () {
                    if ( typeof callback === "function" ) {
                        callback.apply( context, args );
                    }
                    
                }, delay );
            };
        });
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
        return this.parse( url ).match;
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
        return this.parse( url ).matches;
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
     * @param {array} routes optional override routes to use
     * @returns Object witch match bool and matches array
     *
     */
    parse: function ( url, routes ) {
        var segMatches,
            matches,
            routes = (routes || this._routes),
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
        this._rHTTPs = /^http[s]?:\/\/.*?\//,
        
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
    
                    // Cache if option enabled
                    if ( self._caching ) {
                        self._states[ url ].cached = true;
                        self._responses[ url ] = response;
                    }
                    
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
        var xhr = new XMLHttpRequest();
        
        xhr.open( "GET", url, true );
        
        xhr.onreadystatechange = function ( e ) {
            if ( this.readyState === 4 ) {
                if ( this.status === 200 ) {
                    try {
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
         *
         * Bind GET requests to links
         *
         */
        EventApi.delegateEvent( "click", document, "a", function ( e ) {
            var elem = this;
            
            if ( elem.href.indexOf( "#" ) === -1 && self._matcher.test( elem.href ) ) {
                self._pusher.push( elem.href, function ( response ) {
                    self._fire( "get", elem.href, response );
                });
            }
        });
        
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
(function ( window, app, undefined ) {


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
                
                self._step( self._current );
                
                if ( self._when[ self._current ] ) {
                    self._when[ self._current ]( self._current );
                }
                
                self._current++;
                
                if ( self._current === self._occurrences ) {
                    self._done();
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
    
    var time = duration || 1000,
        animDiff = to-from,
        startTime = new Date(),
        timer;
    
    function animate() {
        var diff = new Date()-startTime,
            animTo = (animDiff*ease( diff/time ))+from;
        
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
 * A basic scrollto function without all the fuss
 *
 * @scrollTo
 * @author: kitajchuk
 * @require: Tween
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Window scrollTo function
 * @method scrollTo
 * @param {number} to Where are we scrolling
 * @param {number} duration How long will it take
 * @param {function} ease The easing function to use
 * @param {function} callback The callback on complete
 * @memberof! <global>
 *
 */
var scrollTo = function ( to, duration, ease, callback ) {
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
window.scrollTo = scrollTo;


})( window );