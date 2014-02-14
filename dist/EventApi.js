/*!
 *
 * A basic cross-browser event api
 *
 * @EventApi
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * A vanilla javascript crossbrowser event api
 * @namespace EventApi
 * @memberof! <global>
 *
 */
var EventApi = {
    /**
     *
     * Add an event handler
     * @memberof EventApi
     * @method addEvent
     * @param {string} name The event to bind
     * @param {DOMElement} element The element to bind too
     * @param {function} callback The event handler to fire
     *
     */
    addEvent: function ( name, element, callback ) {
        var handler = function ( e ) {
            e = (e || window.event);
            
            if ( !e.target ) {
                e.target = e.srcElement;
            }
            
            if ( !e.preventDefault ) {
                e.preventDefault = function () {
                    e.returnValue = false;
                };
            }
            
            if ( typeof callback === "function" ) {
                return callback.call( this, e );
            }
        };
        
        if ( element.addEventListener ) {
            element.addEventListener( name, handler, false );
            
        } else {
            element.attachEvent( "on"+name, handler );
        }
    },
    
    /**
     *
     * Remove an event handler
     * @memberof EventApi
     * @method removeEvent
     * @param {string} name The event to unbind
     * @param {DOMElement} element The element to unbind from
     * @param {function} listener The event handler to unbind from
     *
     */
    removeEvent: function ( name, element, listener ) {
        if ( element.removeEventListener ) {
            element.removeEventListener( name, listener, false );
            
        } else {
            element.detachEvent( "on"+name, listener );
        }
    },
    
    /**
     *
     * Delegate an event handler
     * Does NOT handle complex selectors: "[data-effit].nodoit"
     * DOES handle simple selectors: "#id", ".class", "element"
     * @memberof EventApi
     * @method delegateEvent
     * @param {string} name The event to unbind
     * @param {DOMElement} element The element to unbind from
     * @param {string} selector The target selector to match
     * @param {function} callback The event handler
     *
     */
    delegateEvent: function ( name, element, selector, callback ) {
        var isClass = /^\./.test( selector ),
            isId = /^\#/.test( selector ),
            isNode = ( isClass || isId ) ? false : true,
            lookup = function ( target ) {
                var elem;
                
                if ( isNode && target && target.nodeName.toLowerCase() === selector ) {
                    elem = target;
                    
                } else if ( isClass && target ) {
                    var classes = target.className.split( " " );
                    
                    for ( var i = 0, len = classes.length; i < len; i++ ) {
                        if ( classes[ i ] === selector.replace( ".", "" ) ) {
                            elem = target;
                            break;
                        }
                    }
                    
                } else if ( isId && target ) {
                    if ( target.id === selector.replace( "#", "" ) ) {
                        elem = target;
                    }
                }
                
                // Walked all the way up the DOM, found nothing :-/
                if ( !elem && target === document.documentElement ) {
                    return undefined;
                
                // We can keep walking, either have a match or test parentNode    
                } else {
                    return elem || lookup( target.parentNode );
                }
            },
            handler = function ( e ) {
                var elem = lookup( e.target );
                
                e = e || window.event;
                
                if ( !e.target ) {
                    e.target = e.srcElement;
                }
                
                if ( !e.preventDefault ) {
                    e.preventDefault = function () {
                        e.returnValue = false;
                    };
                }
                
                if ( elem && typeof callback === "function" ) {
                    return callback.call( elem, e );
                }
            };
        
        if ( element.addEventListener ) {
            element.addEventListener( name, handler, false );
            
        } else {
            element.attachEvent( "on"+name, handler );
        }
    }
};


// Expose
window.EventApi = EventApi;


})( window );