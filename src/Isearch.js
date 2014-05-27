/*!
 *
 * Expression matching for term lists
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
    constructor: Isearch,
    
    /**
     *
     * Expression for characters to escape from input
     * @memberof Isearch
     * @member _rEscChars
     * @private
     *
     */
    _rEscChars: /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g,
    
    /**
     *
     * Isearch init constructor method
     * @memberof Isearch
     * @method init
     * @param {object} options Any values used to perform search queries
     *
     */
    init: function ( options ) {
        /**
         *
         * Flag for input escaping
         * @memberof Isearch
         * @member escapeInputs
         *
         */
        this.escapeInputs = false;
        
        /**
         *
         * Flag for only matching from front of input
         * @memberof Isearch
         * @member matchFront
         *
         */
        this.matchFront = false;
        
        /**
         *
         * Flag for case sensitivity on matching
         * @memberof Isearch
         * @member matchCase
         *
         */
        this.matchCase = false;
        
        /**
         *
         * Flag for sorting results alphabetically
         * @memberof Isearch
         * @member alphaResults
         *
         */
        this.alphaResults = false;
        
        // Set all option overrides at once
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
     * @method _sortAlpha
     * @param {string} a First test case
     * @param {string} b Second test case
     * @returns -1, 1 or 0
     * @private
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