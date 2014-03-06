/*!
 *
 * A singleton event dispatching utility
 *
 * @Eventful
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


// Singleton
var _instance = null;


/**
 *
 * A singleton event dispatching utility
 * @constructor Eventful
 * @memberof! <global>
 *
 */
var Eventful = function () {
    return (_instance || this.init.apply( this, arguments ));
};

Eventful.prototype = {
    constructor: Eventful,
    
    /**
     *
     * Eventful event handlers object
     * @memberof Eventful
     * @member Eventful._handlers
     *
     */
    _handlers: {},
    
    /**
     *
     * Eventful init constructor method
     * @memberof Eventful
     * @method Eventful.init
     *
     */
    init: function () {
        _instance = this;
    },
    
    /**
     *
     * Eventful add event handler
     * @memberof Eventful
     * @method Eventful.on
     * @param {string} event the event to listen for
     * @param {function} handler the handler to call
     *
     */
    on: function ( event, handler ) {
        if ( typeof handler === "function" ) {
            if ( !this._handlers[ event ] ) {
                this._handlers[ event ] = [];
            }
            
            handler._eventfulTime = Date.now();
            handler._eventfulType = event;
            
            this._handlers[ event ].push( handler );
        }
    },
    
    /**
     *
     * Eventful remove event handler
     * @memberof Eventful
     * @method Eventful.off
     * @param {string} event the event to remove handler for
     * @param {function} handler the handler to remove
     *
     */
    off: function ( event, handler ) {
        if ( !this._handlers[ event ] ) {
            return this;
        }
        
        // Remove a single handler
        if ( handler ) {
            this._off( event, handler );
        
        // Remove all handlers for event    
        } else {
            this._offed( event );
        }
    },
    
    /**
     *
     * Eventful fire an event
     * @memberof Eventful
     * @method Eventful.fire
     * @param {string} event the event to fire
     *
     */
    fire: function ( event ) {
        if ( !this._handlers[ event ] ) {
            return this;
        }
        
        var args = [].slice.call( arguments, 1 );
        
        for ( var i = this._handlers[ event ].length; i--; ) {
            this._handlers[ event ][ i ].apply( this, args );
        }
    },
    
    /**
     *
     * Eventful internal off method assumes event AND handler are good
     * @memberof Eventful
     * @method Eventful._off
     * @param {string} event the event to remove handler for
     * @param {function} handler the handler to remove
     *
     */
    _off: function ( event, handler ) {
        for ( var i = 0, len = this._handlers[ event ].length; i < len; i++ ) {
            if ( handler._eventfulTime === this._handlers[ event ][ i ]._eventfulTime ) {
                this._handlers[ event ].splice( i, 1 );
                
                break;
            }
        }
    },
    
    /**
     *
     * Eventful completely remove all handlers and an event type
     * @memberof Eventful
     * @method Eventful._offed
     * @param {string} event the event to remove handler for
     *
     */
    _offed: function ( event ) {
        for ( var i = this._handlers[ event ].length; i--; ) {
            this._handlers[ event ][ i ] = null;
        }
        
        delete this._handlers[ event ];
    }
};


// Expose
window.Eventful = Eventful;


})( window );