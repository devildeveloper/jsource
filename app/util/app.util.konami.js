/*!
 *
 * App Util: app.util.konami
 *
 * Konami code easter egg.
 * Does cool stuff if you hook into it!
 *
 * @usage: app.util.konami.listen( [cb] )
 * @usage: app.util.konami.dispatch()
 *
 * @note: You likely should not use the dispatch method yourself, though :-P
 *
 *
 * @dependency: app.core.Evenger
 *
 *
 */
(function ( window, app, undefined ) {


"use strict";


var document = window.document,
    
    _keys = {
        A: 65,
        B: 66,
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39
    },
    
    _code2Match = [
        _keys.UP,
        _keys.UP,
        _keys.DOWN,
        _keys.DOWN,
        _keys.LEFT,
        _keys.RIGHT,
        _keys.LEFT,
        _keys.RIGHT,
        _keys.B,
        _keys.A
        
    ].join( "" ),
    
    _codeDelay = 500,
    
    _callbacks = [],
    
    _konami = {
        dispatch: function () {
            for ( var i = 0, len = _callbacks.length; i < len; i++ ) {
                _callbacks[ i ].call();
            }
        }
    },
    
    Konami = app.Class.extend({
        init: function () {
            var codeString = "",
                codeTimeout,
                handler = function ( e ) {
                    try {
                        clearTimeout( codeTimeout );
                        
                    } catch ( error ) {}
                    
                    codeString = ""+(codeString+e.keyCode);
                    
                    if ( codeString === _code2Match ) {
                        _konami.dispatch( "app.konami.code" );
                    }
                    
                    codeTimeout = setTimeout(function () {
                        clearTimeout( codeTimeout );
                        
                        codeString = "";
                                    
                    }, _codeDelay );
                };
            
            this.Event = app.core.Evenger( "keydown", document, handler );
        },
        
        listen: function ( callback ) {
            if ( typeof callback === "function" ) {
                _callbacks.push( callback );
            }
            
            return this;
        },
        
        teardown: function () {
            this.Event.teardown();
            
            return this;
        }
    });


/******************************************************************************
 * App Extensions
*******************************************************************************/
app.util.konami = function () {
    return new Konami();
};


})( window, window.app );