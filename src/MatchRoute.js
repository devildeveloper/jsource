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