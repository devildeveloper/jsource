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
 * Upcoming XMLHttpRequest Level 2
 * json
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Basic XMLHttpRequest handling using Promises
 * @method ajax
 * @memberof! <global>
 * @requires Promise
 * @param {string} url The endpoint to hit
 * @param {string} method The requeset method ( GET / POST )
 * @param {object} options The options dataset
 * <ul>
 * <li>data - what is sent to the server</li>
 * <li>responseType - set the responseType on the xhr object</li>
 * <li>contentType - set the "Content-Type" request header</li>
 * <li>async - flag request as asynchronous or not</li>
 * <li>headers - headers to be set using setRequestHeader</li>
 * </ul>
 * @returns new Promise()
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
 *
 */
var ajax = function ( url, method, options ) {
    // Normalize options...
    options = options || {};
    
    // Request method if not set + uppercased
    // @default: method is GET
    method = (method || "get").toUpperCase();
    
    // Return request with a promise
    return new Promise(function ( resolve, reject ) {
        var xhr = new XMLHttpRequest(),
            qsp = [],
            i;
        
        // Format data string if it has iterables
        for ( i in options.data ) {
            qsp.push( i + "=" + options.data[ i ] );
        }
        
        // Open the request as asynchronous
        // @default: true for async
        xhr.open( method, url, (options.async || true) );
        
        // Set empty accept header
        //xhr.setRequestHeader( "Accept", "" );
        
        // Set Content-Type request header
        if ( options.contentType ) {
            xhr.setRequestHeader( "Content-Type", options.contentType );
        
        // Set Content-Type for POST method
        // @default: application/x-www-form-urlencoded
        } else if ( method === "POST" ) {
            xhr.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
        }
        
        // Set optional request headers
        if ( options.headers ) {
            for ( i in options.headers ) {
                xhr.setRequestHeader( i, options.headers[ i ] );
            }
        }
        
        // Set requested with header
        // @default: XMLHttpRequest since that is all we support here
        xhr.setRequestHeader( "X-Requested-With", "XMLHttpRequest" );
        
        // Set the responseType
        if ( options.responseType ) {
            options.responseType = options.responseType.toLowerCase();
            
            // JSON will need to be parsed out from plain text
            // #issue: Webkit has not implemented XMLHttpRequest Level 2 which supports json as a responseType
            xhr.responseType = ( options.responseType === "json" ) ? "text" : options.responseType;
        }
        
        // Apply the readystatechange event
        xhr.onreadystatechange = function ( e ) {
            // Wait until we can interact with the xhr response
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
        
        // Send the request with optional data
        xhr.send( qsp.join( "&" ) );
    });
};


// Expose
window.ajax = ajax;


})( window );