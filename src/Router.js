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