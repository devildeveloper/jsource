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


/**
 *
 * A simple router Class
 * @constructor Router
 * @requires PushState
 * @requires MatchRoute
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
         * Router Store user options
         * @memberof Router
         * @member Router._options
         *
         */
        this._options = {
            /**
             *
             * Router prevent event default when routes are matched
             * @memberof Router
             * @member Router._options.preventDefault
             *
             */
            preventDefault: ( options.preventDefault !== undefined ) ? options.preventDefault : false
        };
        
        /**
         *
         * Router unique ID
         * @memberof Router
         * @member Router._uid
         *
         */
        this._uid = 0;
        
        // Bind GET requests to links
        if ( document.addEventListener ) {
            document.addEventListener( "click", function ( e ) {
                self._handler( e );
                
            }, false );
            
        } else if ( document.attachEvent ) {
            document.attachEvent( "onclick", function ( e ) {
                self._handler( e );
            });
        }
        
        // Listen for popstate
        this._pusher.on( "popstate", function ( url, data ) {
            self._fire( "get", url, data );
        });
        
        // Listen for beforestate
        this._pusher.on( "beforestate", function () {
            self._fire( "beforeget" );
        });
        
        // Listen for afterstate
        this._pusher.on( "afterstate", function () {
            self._fire( "afterget" );
        });
    },
    
    /**
     *
     * This is merely a wrapper for PushState.on()
     * It supports "beforeget", and "afterget" events
     * @memberof Router
     * @method on
     * @param {string} event The event to bind to
     * @param {function} callback The function to call
     *
     */
    on: function ( event, callback ) {
        // Force "get" event through Router.get()
        if ( event === "get" ) {
            return this;
        }
        
        this._bind( event, callback );
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
     *
     * Router match an element to a selector
     * @memberof Router
     * @method Router._matchElement
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
        } else if ( el !== document.documentElement ) {
            return this._matchElement( el.parentNode, selector );
        
        // Otherwise we should not execute an event    
        } else {
            return null;
        }
    },
    
    /**
     * GET click event handler
     * @memberof Router
     * @method _handler
     * @param {object} e The event object
     *
     */
    _handler: function ( e ) {
        var self = this,
            elem = this._matchElement( e.target, "a" );
        
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
     *
     */
    _bind: function ( event, callback ) {
        if ( typeof callback === "function" ) {
            if ( !this._callbacks[ event ] ) {
                this._callbacks[ event ] = [];
            }
            
            callback._routerID = this.getUID();
            callback._routerType = event;
            
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