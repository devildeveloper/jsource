/*!
 *
 * Basic XMLHttpRequest handling using Promises
 *
 * @ajax
 * @author: kitajchuk
 *
 * @notes:
 * Ready State Description
 * 0 The request is not initialized
 * 1 The request has been set up
 * 2 The request has been sent
 * 3 The request is in process
 * 4 The request is complete
 *
 * Response Types
 * text ( default )
 * arraybuffer
 * blob
 * document
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Basic XMLHttpRequest handling using Promises
 * @example
 * // Handling resolved / rejected states
 * ajax( "/some/api", "POST" ).then(
 *      // Resolved
 *      function ( response ) {
 *          console.log( response );
 *      },
 *
 *      // Rejected
 *      function ( error ) {}
 * );
 * @memberof! <global>
 * @method ajax
 * @param {string} url The endpoint to hit
 * @param {string} type The requeset method ( GET / POST )
 * @param {object} options The options dataset
 * <ul>
 * <li>data - what is sent to the server</li>
 * <li>responseType - set the responseType on the xhr object</li>
 * </ul>
 * @returns new Promise()
 *
 */
var ajax = function ( url, type, options ) {
    // Normalize options...
    options = options || {};
    
    // Return request with a promise
    return new Promise(function ( resolve, reject ) {
        var xhr = new XMLHttpRequest(),
            qsp = [];
        
        // Apply case to request type
        type = type.toUpperCase();
        
        // Format data string
        for ( var i in options.data ) {
            qsp.push( i + "=" + options.data[ i ] );
        }
        
        // Open the request
        xhr.open( type, url, true );
        
        // Set content-type header on POSTs
        if ( type === "POST" ) {
            xhr.setRequestHeader(
                "Content-Type",
                "application/x-www-form-urlencoded"
            );
        }
        
        // Set the responseType
        if ( options.responseType ) {
            options.responseType = options.responseType.toLowerCase();
            
            // JSON will need to be parsed out from plain text
            xhr.responseType = ( options.responseType === "json" ) ? "text" : options.responseType;
        }
        
        // Apply the readystatechange event
        xhr.onreadystatechange = function ( e ) {
            if ( this.readyState === 4 ) {
                if ( this.status === 200 ) {
                    try {
                        var response = this.responseText;
                        
                        // Try parsing out the JSON...
                        if ( options.responseType === "json" ) {
                            response = JSON.parse( response );
                        }
                        
                        // Supply original xhr object as well...
                        resolve({
                            data: response,
                            xhr: this
                        });
                        
                    } catch ( error ) {
                        reject( error );
                    }
                
                } else {
                    reject( new Error( this.statusText ) );
                }
            }
        };
        
        // Apply the error event
        xhr.onerror = function () {
            reject( new Error( "Network Error" ) );
        };
        
        // Send the request
        xhr.send( qsp.join( "&" ) );
    });
};


// Expose
window.ajax = ajax;


})( window );