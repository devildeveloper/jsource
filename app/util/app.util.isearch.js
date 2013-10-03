/*!
 *
 * App Util: util.isearch
 *
 * Performs a quick search against an array of terms
 *
 * @usage: app.util.isearch.set( "escapeInputs", true )
 * @usage: app.util.isearch.terms( [term, term, term] )
 * @usage: app.util.isearch.query( term, cb[matches] )
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
	};


/******************************************************************************
 * App Extensions
*******************************************************************************/
app.util = app.core.extend( app.util, {
	isearch: {
		// @key: escapeInputs bool
		// @key: matchFront bool
		// @key: matchAny bool
		// @key: matchCase bool
		// @key: alphaResults bool
		set: function ( key, val ) {
			if ( typeof key === "object" ) {
				for ( var prop in key ) {
					this[ prop ] = key[ prop ];
				}
				
			} else {
				this[ key ] = val;
			}
		},
		
		// Expects an [array, ay, ay, ay]
		// [echo, echo, echo]
		terms: function ( tArray ) {
			this._terms = tArray;
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
			
			if ( !this._terms || !this._terms.length ) {
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
			
			for ( var i = this._terms.length; i--; ) {
				var match = this._terms[ i ].match( regex );
				
				if ( match ) {
					matches.push( this._terms[ i ] );
				}
			}
			
			if ( this.alphaResults ) {
				matches = matches.sort( _sortAlpha );
			}
			
			if ( typeof callback === "function" ) {
				callback( matches );
			}
		}
	}
});


})( window, window.app );