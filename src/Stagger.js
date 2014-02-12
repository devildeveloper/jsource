/*!
 *
 * A promising timeout utility
 *
 * @Stagger
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * A stepped timeout manager
 * @constructor Stagger
 * @memberof! <global>
 *
 */
var Stagger = function () {
    return this.init.apply( this, arguments );
};

Stagger.prototype = {
    /**
     *
     * Step callback
     * @memberof Stagger
     * @member Stagger._step
     *
     */
    _step: null,
    
    /**
     *
     * When iteration callbacks
     * @memberof Stagger
     * @member Stagger._when
     *
     */
    _when: {},
    
    /**
     *
     * Done callback
     * @memberof Stagger
     * @member Stagger._done
     *
     */
    _done: null,
    
    /**
     *
     * Timeout delay
     * @memberof Stagger
     * @member Stagger._delay
     *
     */
    _delay: 250,
    
    /**
     *
     * Current step iteration
     * @memberof Stagger
     * @member Stagger._current
     *
     */
    _current: 0,
    
    /**
     *
     * Number of step occurrences
     * @memberof Stagger
     * @member Stagger._occurrences
     *
     */
    _occurrences: 0,
    
    /**
     *
     * Timeout reference
     * @memberof Stagger
     * @member Stagger._timeout
     *
     */
    _timeout: null,
    
    /**
     *
     * Paused flag
     * @memberof Stagger
     * @member Stagger._paused
     *
     */
    _paused: false,
    
    /**
     *
     * Started iteration flag
     * @memberof Stagger
     * @member Stagger._started
     *
     */
    _started: false,
    
    /**
     *
     * Resolved iteration flag
     * @memberof Stagger
     * @member Stagger._resolved
     *
     */
    _resolved: false,
    
    /**
     *
     * Stagger init constructor method
     * @memberof Stagger
     * @method Stagger.init
     * @param {object} options The staggering options
     * <ul>
     * <li>options.delay</li>
     * <li>options.occurrences</li>
     * <li>options.paused</li>
     * </ul>
     *
     */
    init: function ( options ) {
        this._delay = options.delay || this._delay;
        this._occurrences = options.occurrences;
        this._paused = options.paused || this._paused;
        
        if ( !this._started && !this._paused ) {
            this.start();
        }
    },
    
    /**
     *
     * Apply the step callback
     * @memberof Stagger
     * @method Stagger.step
     * @param {function} fn The callback to fire
     *
     */
    step: function ( fn ) {
        if ( typeof fn === "function" ) {
            this._step = fn;
        }
        
        return this;
    },
    
    /**
     *
     * Apply a when callback
     * @memberof Stagger
     * @method Stagger.when
     * @param {number} i The iteration to fire on
     * @param {function} fn The callback to fire
     *
     */
    when: function ( i, fn ) {
        if ( typeof fn === "function" ) {
            this._when[ i ] = fn;
        }
                            
        return this;
    },
    
    /**
     *
     * Apply the done callback
     * @memberof Stagger
     * @method Stagger.done
     * @param {function} fn The callback to fire
     *
     */
    done: function ( fn ) {
        if ( typeof fn === "function" ) {
            this._done = fn;
        }
        
        return this;
    },
    
    /**
     *
     * Pause the iteration
     * @memberof Stagger
     * @method Stagger.pause
     *
     */
    pause: function () {
        this._paused = true;
        
        return this;
    },
    
    /**
     *
     * Play the iteration
     * @memberof Stagger
     * @method Stagger.play
     *
     */
    play: function () {
        this._paused = false;
        
        return this;
    },
    
    /**
     *
     * Start the iteration
     * @memberof Stagger
     * @method Stagger.start
     *
     */
    start: function () {
        this._started = true;
        this._stagger();
    },
    
    /**
     *
     * Resolve the iteration state
     * @memberof Stagger
     * @method Stagger._resolve
     *
     */
    _resolve: function () {
        this._resolved = true;
        this._timeout = null;
    },
    
    /**
     *
     * Initialize the iteration loop
     * @memberof Stagger
     * @method Stagger._stagger
     *
     */
    _stagger: function () {
        var self = this;
        
        var stagger = function () {
            self._timeout = setTimeout(function () {
                clearTimeout( self._timeout );
                
                // If resolved, stop timeout loop
                if ( self._resolved ) {
                    self._timeout = null;
                    
                    return;
                
                // If paused, keep loop going but wait    
                } else if ( self._paused ) {
                    stagger();
                    
                    return;
                }
                
                self._step( self._current );
                
                if ( self._when[ self._current ] ) {
                    self._when[ self._current ]( self._current );
                }
                
                self._current++;
                
                if ( self._current === self._occurrences ) {
                    self._done();
                    self._resolve();
                    
                } else {
                    stagger();
                }
                            
            }, self._delay );
        };
        
        stagger();
    }
};


// Expose
window.Stagger = Stagger;


})( window );