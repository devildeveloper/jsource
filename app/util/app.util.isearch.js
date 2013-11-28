/*!
 *
 * App Util: app.util.isearch
 *
 * Performs a quick search against an array of terms
 *
 * @usage: var search = app.util.isearch( [options] )
 * @usage: search.query( term, cb[matches] )
 * @usage: search.set( option, value )
 *
 * @chainable: isearch().set().query()
 *
 *
 */
(function ( window, app, undefined ) {


"use strict";


var _rEscChars = /\/|\\|\.|\||\*|\&|\+|\(|\)|\[|\]|\?|\$|\^/g,
    
    _sortAlpha = function ( a, b ) {
        if ( a < b ) {
            return -1;
        }
        
        if ( a > b ) {
            return 1;
        }
        
        return 0;
    },
    
    // Supported isearch options
    _defaults = {
        escapeInputs: false,
        matchFront: false,
        matchAny: true,
        matchCase: false,
        alphaResults: false
    },
    
    Isearch = app.Class.extend({
        init: function ( options ) {
            options = app.core.extend( _defaults, options );
            
            this.set( options );
        },
        
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
        
        // Performs matchAny true by default
        // Performs matchCase false by default
        query: function ( term, callback ) {
            var rstring = "",
                rflags = ["g"],
                matches = [],
                regex;
            
            if ( !term ) {
                app.util.log( "invalid term to query for" );
                
                return;
            }
            
            if ( !this.terms || !this.terms.length ) {
                app.util.log( "no terms to query against" );
                
                return;
            }
            
            if ( this.escapeInputs ) {
                term = term.replace( _rEscChars, "" );
            }
            
            if ( this.matchCase ) {
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
                matches = matches.sort( _sortAlpha );
            }
            
            if ( typeof callback === "function" ) {
                callback( matches );
            }
            
            return this;
        }
    });


/******************************************************************************
 * App Extensions
*******************************************************************************/
app.util.isearch = function ( options ) {
    return new Isearch( options );
};


})( window, window.app );