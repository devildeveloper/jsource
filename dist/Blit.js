/*!
 *
 * A simple gamecycle engine
 *
 * @Blit
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


// Animation tracking
var raf = window.requestAnimationFrame,
    caf = window.cancelAnimationFrame;


/**
 *
 * A simple gamecycle engine
 * @constructor Blit
 * @memberof! <global>
 *
 */
var Blit = function () {
    return this.init.apply( this, arguments );
};

Blit.prototype = {
    constructor: Blit,
    
    /**
     *
     * Blit init constructor method
     * @memberof Blit
     * @method Blit.init
     * @param {object} options The gamecycle options
     * <ul>
     * <li>{number} options.fps</li>
     * <li>{boolean} options.paused</li>
     * <li>{function} options.blit</li>
     * </ul>
     *
     */
    init: function ( options ) {
        /**
         *
         * Time now in ms
         * @memberof Blit
         * @member Blit._now
         *
         */
        this._now = null;
        
        /**
         *
         * Time then in ms
         * @memberof Blit
         * @member Blit._then
         *
         */
        this._then = null;
        
        /**
         *
         * Diff between now and then
         * @memberof Blit
         * @member Blit._delta
         *
         */
        this._delta = null;
        
        /**
         *
         * Start time in ms
         * @memberof Blit
         * @member Blit._first
         *
         */
        this._first = null;
        
        /**
         *
         * Elapsed time in ms
         * @memberof Blit
         * @member Blit._time
         *
         */
        this._time = null;
        
        /**
         *
         * Current frame
         * @memberof Blit
         * @member Blit._frame
         *
         */
        this._frame = 0;
        
        /**
         *
         * Timeout reference
         * @memberof Blit
         * @member Blit._timeout
         *
         */
        this._cycle = null;
        
        /**
         *
         * Started iteration flag
         * @memberof Blit
         * @member Blit._started
         *
         */
        this._started = false;
        
        /**
         *
         * FPS defaults to 60fps
         * @memberof Blit
         * @member Blit._fps
         *
         */
        this._fps = (options.fps || 60);
        
        /**
         *
         * Timer interval based on FPS
         * @memberof Blit
         * @member Blit._interval
         *
         */
        this._interval = (1000 / this._fps);
        
        /**
         *
         * Frame rate callback
         * @memberof Blit
         * @member Blit._blit
         *
         */
        this._blit = (options.blit || null);
        
        /**
         *
         * Paused flag
         * @memberof Blit
         * @member Blit._paused
         *
         */
        this._paused = (options.paused || false);
        
        // Start if we can
        if ( !this._started && !this._paused ) {
            this.start();
        }
    },
    
    /**
     *
     * Apply the blit callback
     * @memberof Blit
     * @method Blit.blit
     * @param {function} fn The callback to fire
     *
     */
    blit: function ( fn ) {
        if ( typeof fn === "function" ) {
            this._blit = fn;
        }
        
        return this;
    },
    
    /**
     *
     * Pause the gamecycle
     * @memberof Blit
     * @method Blit.pause
     *
     */
    pause: function () {
        this._paused = true;
        
        return this;
    },
    
    /**
     *
     * Play the gamecycle
     * @memberof Blit
     * @method Blit.play
     *
     */
    play: function () {
        this._paused = false;
        
        return this;
    },
    
    /**
     *
     * Start the gamecycle
     * @memberof Blit
     * @method Blit.start
     *
     */
    start: function () {
        if ( this._started ) {
            return this;
        }
        
        this._paused = false;
        this._blitInit();
        
        return this;
    },
    
    /**
     *
     * Stop the gamecycle
     * @memberof Blit
     * @method Blit.stop
     *
     */
    stop: function () {
        caf( this._cycle );
        
        this._started = false;
        this._cycle = null;
        
        return this;
    },
    
    /**
     *
     * Initialize the gamecycle loop
     * @memberof Blit
     * @method Blit._blitInit
     *
     */
    _blitInit: function () {
        if ( this._started ) {
            return this;
        }
        
        this._started = true;
        this._then = Date.now();
        this._first = this._then;
        
        var self = this,
            blit = function () {
                self._cycle = raf( blit );
                self._now = Date.now();
                self._delta = self._now - self._then;
                
                if ( self._delta > self._interval ) {
                    if ( !self._paused ) {
                        self._frame++;
                        self._then = self._now - (self._delta % self._interval);
                        self._time = (self._then - self._first);
                        
                        if ( typeof self._blit === "function" ) {
                            self._blit( self._frame );
                        }
                    }
                }
            };
        
        blit();
    }
};


// Expose
window.Blit = Blit;


})( window );