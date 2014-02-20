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
        if ( callback._routes ) {
            callback._routes.push( route );
            
        } else {
            callback._routes = [route];
        }
        
        // When binding multiple routes to a single
        // callback, we need to make sure the callbacks
        // routes array is updated above but the callback
        // only gets added to the list once.
        if ( callback._routes.length === 1 ) {
            this._bind( "get", callback );
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
                var compare = this._matcher.parse( url, this._callbacks[ event ][ i ]._routes );
                
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