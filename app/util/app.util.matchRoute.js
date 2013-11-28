/*!
 *
 * App Util: app.util.matchRoute
 *
 * Performs a wildcard style match check against an array of routes given a url.
 * Valid wildcards are "any", "slug", "num" and "reg". Regex must be escaped for backslashes.
 *
 * @wild: :any
 * @wild: :num
 * @wild: :slug
 * @wild: :reg(/regex/)
 *
 * @routeFormat: "en_US/foo/:slug/bar/:num/baz"
 * @routeFormat: "var/:reg(foo_.*?\\d{1,2})/pooh/:any"
 *
 * @usage: var matchRoute = app.util.matchRoute( [routesConfig] )
 * @usage: matchRoute.config( [routesConfig] ) => updates internal routes config to use
 * @usage: matchRoute.test( url ) => returns true/false
 * @usage: matchRoute.match( url ) => returns array either full or empty
 *
 *
 */
(function ( window, app, undefined ) {


"use strict";


var _rHTTPs = /^http[s]?:\/\/.*?\//,
    _rTrails = /^\/|\/$/g,
    _rHashQuery = /#.*|.*\?$/g,
    _rWild = /^:num|^:slug|^:any|^:reg/,
    
    _wilders = {
        ":slug": /^[A-Za-z0-9-_.]*/,
        ":num": /^[0-9]+$/,
        ":any": /^.*/,
        ":reg": /:reg|\(|\)/g
    },
    
    _cleanRoute = function ( route ) {
        route = route.replace( _rHTTPs, "" );
        route = route.replace( _rTrails, "" );
        route = route.replace( _rHashQuery, "" );
        
        return route;
    },
    
    _cleanRoutes = function ( routes ) {
        for ( var i = routes.length; i--; ) {
            routes[ i ] = _cleanRoute( routes[ i ] );
        }
        
        return routes;
    },
    
    MatchRoute = app.Class.extend({
        _routes: null,
        
        init: function ( routes ) {
            this._routes = _cleanRoutes( routes );
        },
        
        config: function ( routes ) {
            this._routes = _cleanRoutes( routes );
            
            return this;
        },
        
        test: function ( url ) {
            return this.parse( url ).match;
        },
        
        match: function ( url ) {
            return this.parse( url );
        },
        
        parse: function ( url ) {
            var segMatches,
                matches,
                routes = this._routes,
                route = _cleanRoute( url ),
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
                    matches = ruris[ j ].match( _rWild );
                    
                    if ( matches ) {
                        match = matches[ 0 ];
                        
                        if ( match === ":reg" ) {
                            regex = new RegExp( ruris[ j ].replace( _wilders[ match ], "" ) );
                            
                        } else {
                            regex = _wilders[ match ];
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
        }
    });


/******************************************************************************
 * App Extensions
*******************************************************************************/
app.util.matchRoute = function ( routes ) {
    return new MatchRoute( routes );
};


})( window, window.app );