/*!
 *
 * App Util: app.util.stagger
 *
 * A promising timeout utility
 *
 * @usage: var stagger = app.util.stagger( options )
 * @usage: stagger.step( fn[i] )
 * @usage: stagger.when( i, fn )
 * @usage: stagger.done( fn )
 *
 * @chainable: stagger().step().when().done()
 *
 *
 */
(function ( window, app, undefined ) {


"use strict";


var _noop = function () {},

    Stagger = app.Class.extend({
        _step: _noop,
        
        _when: {},
        
        _done: _noop,
        
        _delay: 250,
        
        _current: 0,
        
        _occurrences: 0,
        
        _timeout: null,
        
        _paused: false,
        
        _started: false,
        
        _resolved: false,
        
        init: function ( options ) {
            this._delay = options.delay || this._delay;
            this._occurrences = options.occurrences;
            this._paused = options.paused || this._paused;
            
            if ( !this._started ) {
                this.start();
            }
        },
        
        step: function ( fn ) {
            if ( typeof fn === "function" ) {
                this._step = fn;
            }
            
            return this;
        },
        
        when: function ( i, fn ) {
            this._when[ i ] = ( typeof fn === "function" )
                                ? fn
                                : noop;
                                
            return this;
        },
        
        done: function ( fn ) {
            if ( typeof fn === "function" ) {
                this._done = fn;
            }
            
            return this;
        },
        
        pause: function () {
            this._paused = true;
            
            return this;
        },
        
        play: function () {
            this._paused = false;
            
            return this;
        },
        
        start: function () {
            this._started = true;
            this._stagger();
        },
        
        _resolve: function () {
            this._resolved = true;
            this._timeout = null;
        },
        
        _stagger: function () {
            var self = this;
            
            var stagger = function () {
                self._timeout = setTimeout(function () {
                    clearTimeout( self._timeout );
                    
                    if ( self._paused ) {
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
    });


/******************************************************************************
 * App Extensions
*******************************************************************************/
app.util.stagger = function ( options ) {
    return new Stagger( options );
};


})( window, window.app );