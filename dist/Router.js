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