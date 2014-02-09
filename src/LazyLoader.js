/*!
 *
 * A simple lazyloading class using requestAnimationFrame
 * Uses callbacks for handling updates per instance
 *
 * @LazyLoader
 * @author: kitajchuk
 *
 *
 */
(function ( window, undefined ) {


"use strict";


// Animation tracking
var raf = window.requestAnimationFrame,
    caf = window.cancelAnimationFrame,
    
    _i,
    _all = 0,
    _num = 0,
    _raf = null,
    _ini = false,
    _ani = function () {
        if ( _num !== _all ) {
            _raf = raf( _ani );
            
            for ( _i = _instances.length; _i--; ) {
                if ( _instances[ _i ]._numLoaded !== _instances[ _i ]._num2Load ) {
                    _instances[ _i ].handle();
                }
            }
            
        } else {
            caf( _raf );
            
            _raf = null;
            _ini = false;
        }
    },
    
    // Hold instances
    _instances = [];


/**
 *
 * A basic loader class with handling and callbacks
 * @constructor LazyLoader
 * @memberof! <global>
 *
 */
var LazyLoader = function () {
    return this.init.apply( this, arguments );
};

LazyLoader.prototype = {
    /**
     *
     * LazyLoader init constructor method
     * @memberof LazyLoader
     * @method LazyLoader.init
     * @param {DOMCollection} elements The elements to load against
     *
     */
    init: function ( elements ) {
        /**
         *
         * Internal reference to elements
         * @memberof LazyLoader
         * @member LazyLoader._elements
         *
         */
        this._elements = elements;
        
        /**
         *
         * How many elements have been loaded
         * @memberof LazyLoader
         * @member LazyLoader._numLoaded
         *
         */
        this._numLoaded = 0;
        
        /**
         *
         * How many total elements to load
         * @memberof LazyLoader
         * @member LazyLoader._num2Load
         *
         */
        this._num2Load = elements.length;
        
        /**
         *
         * Update/Handler listeners
         * @memberof LazyLoader
         * @member LazyLoader._handlers
         *
         */
        this._handlers = {
            update: null,
            handle: null
        };
        
        /**
         *
         * Before load callback
         * @memberof LazyLoader
         * @member LazyLoader._before
         *
         */
        this._before = null;
        
        /**
         *
         * After load callback
         * @memberof LazyLoader
         * @member LazyLoader._after
         *
         */
        this._after = null;
        
        // Increment ALL
        _all = _all+this._num2Load;
        
        // Private instances array
        _instances.push( this );
        
        // Animate!
        if ( !_ini ) {
            _ani();
            _ini = true;
        }
    },
    
    /**
     *
     * Apply handle and update listeners
     * @memberof LazyLoader
     * @method LazyLoader.on
     * @param {string} event The event to listen for
     * @param {function} handler The callback to fire
     *
     */
    on: function ( event, handler ) {
        this._handlers[ event ] = handler;
        
        return this;
    },
    
    /**
     *
     * Fire the update event listeners
     * @memberof LazyLoader
     * @method LazyLoader.update
     *
     */
    update: function () {
        for ( var i = 0, len = this._elements.length; i < len; i++ ) {
            this._fire( "update", this._elements[ i ] );
        }
        
        return this;
    },
    
    /**
     *
     * Fire the handle event listeners
     * @memberof LazyLoader
     * @method LazyLoader.handle
     *
     */
    handle: function () {
        var self = this;
        
        for ( var i = 0, len = this._elements.length; i < len; i++ ) {
            if ( this._fire( "handle", this._elements[ i ] ) && (!this._elements[ i ].dataset.handled && !this._elements[ i ].dataset.loaded) ) {
                _num++;
            
                this._numLoaded++;
            }
        }
        
        return this;
    },
    
    /**
     *
     * Apply the before callback
     * @memberof LazyLoader
     * @method LazyLoader.before
     * @param {function} fn The callback to apply
     *
     */
    before: function ( fn ) {
        if ( typeof fn === "function" ) {
            this._before = fn;
        }
        
        return this;
    },
    
    /**
     *
     * Apply the after callback
     * @memberof LazyLoader
     * @method LazyLoader.after
     * @param {function} fn The callback to apply
     *
     */
    after: function ( fn ) {
        if ( typeof fn === "function" ) {
            this._after = fn;
        }
        
        return this;
    },
    
    /**
     *
     * Load an image for an element typically on the handle listener callback
     * @memberof LazyLoader
     * @method LazyLoader.loadImage
     * @param {DOMElement} element The element to load for
     * @param {string} url The image url to load
     *
     */
    loadImage: function ( element, url ) {
        var self = this,
            image = new Image(),
            timeout;
        
        element.dataset.loading = true;
        
        if ( typeof this._before === "function" ) {
            this._before( element );
        }
        
        image.onload = function () {
            image = null;
            
            element.dataset.loaded = true;
            element.dataset.handled = true;
            element.dataset.loading = false;
            
            if ( typeof self._after === "function" ) {
                self._after( element );
            }
        };
        
        image.src = url;
    },
    
    /**
     *
     * Fire an event
     * @memberof LazyLoader
     * @method LazyLoader._fire
     * @param {string} event The event to dispatch
     * @param {DOMElement} element The element in iteration
     *
     */
    _fire: function ( event, element ) {
        var ret = false;
        
        if ( typeof this._handlers[ event ] === "function" ) {
            ret = this._handlers[ event ].call( this, element );
        }
        
        return ret;
    }
};


// Expose
window.LazyLoader = LazyLoader;


})( window );