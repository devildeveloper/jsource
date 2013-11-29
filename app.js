/*!
 *
 * App: Model
 *
 * Creates global {app}
 *
 *
 */
(function ( context, undefined ) {


"use strict";


// Our global, extendable app {Object}
var app = {},
    
    // Keep track of controller modules
    controllers = [],
    
    // Keep track of executed modules
    executed = {},
    
    // Handle console fallback
    console = context.console || {
        log: function () {}
    };


/******************************************************************************
 * App core namespace
*******************************************************************************/
app.core = {};


/******************************************************************************
 * App utility namespace
*******************************************************************************/
app.util = {};


/******************************************************************************
 * App controllers namespace
*******************************************************************************/
app.controllers = {};


/******************************************************************************
 * App log method
*******************************************************************************/
app.log = function () {
    var args = [].slice.call( arguments, 0 );
    
    if ( !args.length ) {
        args.push( app );
        
    } else {
        args.unshift( "[Appjs]:" );
    }
    
    // IE8 Doesn't support .call/.apply on console.log
    if ( console.log.apply ) {
        console.log.apply( console, args );
    }
};


/******************************************************************************
 * App exec method
*******************************************************************************/
app.exec = function ( module ) {
    var moduleName = module;
    
    if ( app.controllers[ module ] ) {
        module = app.controllers[ module ];
        
    } else if ( app.core[ module ] ) {
        module = app.core[ module ];
        
    } else if ( app.util[ module ] ) {
        module = app.util[ module ];
        
    } else {
        module = undefined;
    }
    
    if ( executed[ moduleName ] ) {
            app.log( "Module "+moduleName+" already executed! Backing out..." );
            
    } else if ( module && typeof module.init === "function" ) {
        module.init();
        
        executed[ moduleName ] = true;
    }
    
    return module;
};


/******************************************************************************
 * Expose global app {Object}
*******************************************************************************/
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
    module.exports = app;
    
} else {
    context.app = app;
}


})( this );
/*!
 *
 * Class Inheritance Model
 *
 * Simple JavaScript Inheritance
 * By John Resig http://ejohn.org
 * MIT Licensed.
 *
 *
 */
(function ( window, app, undefined ) {


(function () {
    
    var initializing = false,
        fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    
    // The base Class implementation (does nothing)
    this.Class = function () {};
    
    // Create a new Class that inherits from this class
    Class.extend = function ( prop ) {
        var _super = this.prototype;
        
        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;
        
        // Copy the properties over onto the new prototype
        for ( var name in prop ) {
            // Check if we're overwriting an existing function
            prototype[ name ] = (typeof prop[ name ] === "function" && typeof _super[ name ] === "function" && fnTest.test( prop[ name ] ))
                                ? (function( name, fn ) {
                                        return function () {
                                            var tmp = this._super;
                                            
                                            // Add a new ._super() method that is the same method
                                            // but on the super-class
                                            this._super = _super[ name ];
                                            
                                            // The method only need to be bound temporarily, so we
                                            // remove it when we're done executing
                                            var ret = fn.apply( this, arguments );
                                            this._super = tmp;
                                            
                                            return ret;
                                        };
                                  })( name, prop[ name ] )
                                : prop[ name ];
        }
        
        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if ( !initializing && this.init ) {
                this.init.apply( this, arguments );
            }
        }
        
        // Populate our constructed prototype object
        Class.prototype = prototype;
        
        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;
        
        // And make this class extendable
        Class.extend = arguments.callee;
        
        return Class;
    };
    
    // Expose Class to app.core
    app.Class = Class;

})();


})( window, window.app );
/*!
 *
 * App Core: app.core.Evenger
 *
 * An event application Class
 *
 *
 */
(function ( window, app, undefined ) {


"use strict";


var _events = {},

    Evenger = app.Class.extend({
        init: function ( event, element, callback, delay ) {
            var handler;
            
            // Store some props yo
            this.element = element;
            this.event = event;
            this.timestamp = +new Date();
            
            // Keep handler private
            _events[ this.timestamp ] = handler = function () {
                if ( typeof callback === "function" ) {
                    callback.apply( element, arguments );
                }
            };
            
            // Figure out how we can bind the event
            if ( this.element.addEventListener ) {
                this.element.addEventListener( this.event, handler, false );
                
            } else if ( element.attachEvent ) {
                this.event = "on"+event;
                
                this.element.attachEvent( this.event, handler );
                
            } else {
                this.event = "on"+event;
                
                this.element[ this.event ] = handler;
            }
        },
        
        teardown: function () {
            if ( this.element.removeEventListener ) {
                this.element.removeEventListener( this.event, _events[ this.timestamp ], false );
                
            } else if ( window.detachEvent ) {
                this.element.detachEvent( this.event, _events[ this.timestamp ] );
                
            } else {
                this.element[ this.event ] = _events[ this.timestamp ] = null;
            }
            
            // Completely remove the handler reference
            delete _events[ this.timestamp ];
        }
    });


/******************************************************************************
 * App Extensions
*******************************************************************************/
app.core.Evenger = function ( event, element, callback ) {
    return new Evenger( event, element, callback );
};


})( window, window.app );
/*!
 *
 * App Util: app.util.eventender
 *
 * The ender of all events, or just for Window
 * events that don't have a proper onend handler
 *
 * @usage: var ender = app.util.eventender( "scroll", 300, cb )
 * @usage: ender.teardown();
 *
 *
 * @dependency: app.core.Evenger
 * @dependency: app.util.throttle
 *
 *
 */
(function ( window, app, undefined ) {


"use strict";


// Keep track of handlers so we can tear them down
var _enders = {},
    
    EventEnder = app.Class.extend({
        init: function ( event, delay, callback ) {
            // Store some props yo
            this.delay = delay;
            this.eventName = event;
            
            this.Event = app.core.Evenger( this.event, window, app.util.throttle( this.delay, function () {
                if ( typeof callback === "function" ) {
                    callback();
                }
            }));
        },
        
        teardown: function () {
            this.Event.teardown();
            
            return this;
        }
    });


/******************************************************************************
 * App Extensions
*******************************************************************************/
// Supports event = "scroll"
// Supports event = "resize"
app.util.eventender = function ( event, delay, callback ) {
    return new EventEnder( event, delay, callback );
};


})( window, window.app );
/*!
 *
 * App Util: app.util.filer
 *
 * A file notification utility. Not really helpfull yet...
 *
 *
 * @dependency: app.core.Evenger
 *
 *
 */
(function ( window, app, undefined ) {


"use strict";


var document = window.document,
    
    _noop = function () {},
    
    _files = {},
    
    _readAs = {
        array: "readAsArrayBuffer",
        string: "readAsBinaryString",
        data: "readAsDataURL",
        text: "readAsText"
    },
    
    _post = function ( data, url, callback ) {
        var request = new XMLHttpRequest();
        
        data = new FormData( data );
        
        request.open( "POST", url );
        
        request.onreadystatechange = function () {
            if ( this.readyState === 4 ) {
                
                if ( this.status === 200 ) {
                    
                    try {
                        this.response = JSON.parse( this.response );
                        
                    } catch ( error ) {
                        // Handle parsing errors
                        console.log( error );
                    }
                    
                    if ( typeof callback === "function" ) {
                        callback( false, this );
                    }
                    
                } else {
                    if ( typeof callback === "function" ) {
                        callback( true, this );
                    }
                }
                
            }
        };
        
        request.send( data );
    },
    
    Filer = app.Class.extend({
        _onfiles: _noop,
        
        _onprogress: _noop,
        
        _done: _noop,
        
        _currentFile: null,
        
        init: function () {
            var self = this,
                handler = function ( e ) {
                    if ( e.target.type && e.target.type === "file" ) {
                        var file = e.target.files[ 0 ];
                        
                        _files[ self.timestamp ].push( file );
                        
                        self._currentFile = file;
                        
                        self._onfiles( file );
                    }
                };
            
            this.readAsType = _readAs.DATA_BUFFER;
            this.timestamp = +new Date();
            this.Event = app.core.Evenger( "change", document, handler );
            
            _files[ this.timestamp ] = [];
        },
        
        _read: function ( files ) {
            var reader = new FileReader(),
                total = files.length,
                self = this,
                filed = [],
                data;
            
            reader.onload = function ( e ) {
                var target = e.target || e.currentTarget || e.srcElement,
                    result = target.result;
                
                filed.push( result );
                
                if ( filed.length = total ) {
                    data = { files: filed };
                    
                    self._done( data );
                }
            };
            
            reader.onprogress = function () {
                self._onprogress.apply( null, arguments );
            };
            
            for ( var i = 0, len = total; i < total; i++ ) {
                reader[ this.readAsType ]( files[ i ] );
            }
            
            return this;
        },
        
        // @type: "data"
        // @type: "array"
        // @type: "string"
        // @type: "text"
        readAs: function ( type, file ) {
            var files;
            
            if ( _readAs[ type ] ) {
                this.readAsType = _readAs[ type ];
            }
            
            if ( file ) {
                files = [ file ];
                
            } else {
                files = [ this._currentFile ];
            }
            
            return this._read( files );
        },
        
        readAll: function ( type, files ) {
            if ( _readAs[ type ] ) {
                this.readAsType = _readAs[ type ];
            }
            
            if ( files && !files.length ) {
                files = [ files ];
                
            } else {
                files = _files[ this.timestamp ];
            }
            
            return this._read( files );
        },
        
        progress: function ( fn ) {
            if ( typeof fn === "function" ) {
                this._onprogress = fn;
            }
            
            return this;
        },
        
        done: function ( fn ) {
            if ( typeof fn === "function" ) {
                this._done = fn;
            }
            
            return this;
        },
        
        onfiles: function ( fn ) {
            if ( typeof fn === "function" ) {
                this._onfiles = fn;
            }
            
            return this;
        },
        
        files: function () {
            return _files[ this.timestamp ];
        }
    });


/******************************************************************************
 * App Extensions
*******************************************************************************/
app.util.filer = function () {
    return new Filer();
};


})( window, window.app );
/*!
 *
 * App Util: app.util.isearch
 *
 * Performs a quick search against an array of terms
 *
 * @usage: var search = app.util.isearch( [options] )
 * @usage: search.query( term, cb[matches] )
 * @usage: search.set( option, value )
 *
 * @chainable: isearch().set().query()
 *
 *
 */
(function ( window, app, undefined ) {


"use strict";


var _rEscChars = /\/|\\|\.|\||\*|\&|\+|\(|\)|\[|\]|\?|\$|\^/g,
    
    _sortAlpha = function ( a, b ) {
        if ( a < b ) {
            return -1;
        }
        
        if ( a > b ) {
            return 1;
        }
        
        return 0;
    },
    
    // Supported isearch options
    _defaults = {
        escapeInputs: false,
        matchFront: false,
        matchAny: true,
        matchCase: false,
        alphaResults: false
    },
    
    Isearch = app.Class.extend({
        init: function ( options ) {
            options = app.core.extend( _defaults, options );
            
            this.set( options );
        },
        
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
        
        // Performs matchAny true by default
        // Performs matchCase false by default
        query: function ( term, callback ) {
            var rstring = "",
                rflags = ["g"],
                matches = [],
                regex;
            
            if ( !term ) {
                app.util.log( "invalid term to query for" );
                
                return;
            }
            
            if ( !this.terms || !this.terms.length ) {
                app.util.log( "no terms to query against" );
                
                return;
            }
            
            if ( this.escapeInputs ) {
                term = term.replace( _rEscChars, "" );
            }
            
            if ( this.matchCase ) {
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
                matches = matches.sort( _sortAlpha );
            }
            
            if ( typeof callback === "function" ) {
                callback( matches );
            }
            
            return this;
        }
    });


/******************************************************************************
 * App Extensions
*******************************************************************************/
app.util.isearch = function ( options ) {
    return new Isearch( options );
};


})( window, window.app );
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
/*!
 *
 * App Util: app.util.matchRoute
 *
 * Performs a wildcard style match check against an array of routes given a url.
 * Valid wildcards are "any", "slug", "num" and "reg". Regex must be escaped for backslashes.
 *
 * @wild: :any
 * @wild: :num
 * @wild: :slug
 * @wild: :reg(regex)
 *
 * @routeFormat: "en_US/foo/:slug/bar/:num/baz"
 * @routeFormat: "var/:reg(foo_.*?\\d{1,2})/pooh/:any"
 *
 * @usage: var matchRoute = app.util.matchRoute( [routesConfig] )
 * @usage: matchRoute.config( [routesConfig] ) => updates internal routes config to use
 * @usage: matchRoute.test( url ) => returns true/false
 * @usage: matchRoute.match( url ) => returns array either full or empty
 *
 *
 */
(function ( window, app, undefined ) {


"use strict";


var _rHTTPs = /^http[s]?:\/\/.*?\//,
    _rTrails = /^\/|\/$/g,
    _rHashQuery = /#.*|.*\?$/g,
    _rWild = /^:num|^:slug|^:any|^:reg/,
    
    _wilders = {
        ":slug": /^[A-Za-z0-9-_.]*/,
        ":num": /^[0-9]+$/,
        ":any": /^.*/,
        ":reg": /:reg|\(|\)/g
    },
    
    _cleanRoute = function ( route ) {
        route = route.replace( _rHTTPs, "" );
        route = route.replace( _rTrails, "" );
        route = route.replace( _rHashQuery, "" );
        
        return route;
    },
    
    _cleanRoutes = function ( routes ) {
        for ( var i = routes.length; i--; ) {
            routes[ i ] = _cleanRoute( routes[ i ] );
        }
        
        return routes;
    },
    
    MatchRoute = app.Class.extend({
        _routes: null,
        
        init: function ( routes ) {
            this._routes = _cleanRoutes( routes );
        },
        
        config: function ( routes ) {
            this._routes = _cleanRoutes( routes );
            
            return this;
        },
        
        test: function ( url ) {
            return this.parse( url ).match;
        },
        
        match: function ( url ) {
            return this.parse( url );
        },
        
        parse: function ( url ) {
            var segMatches,
                matches,
                routes = this._routes,
                route = _cleanRoute( url ),
                match,
                ruris,
                regex,
                uris = route.split( "/" ),
                uLen = uris.length,
                iLen = routes.length,
                ret = {
                    match: false,
                    matches: []
                };
            
            for ( var i = 0; i < iLen; i++ ) {
                ruris = routes[ i ].split( "/" );
                
                if ( ruris.length !== uris.length ) {
                    continue;
                }
                
                segMatches = 0;
                
                for ( var j = 0; j < uLen; j++ ) {
                    matches = ruris[ j ].match( _rWild );
                    
                    if ( matches ) {
                        match = matches[ 0 ];
                        
                        if ( match === ":reg" ) {
                            regex = new RegExp( ruris[ j ].replace( _wilders[ match ], "" ) );
                            
                        } else {
                            regex = _wilders[ match ];
                        }
                        
                        if ( regex.test( uris[ j ] ) ) {
                            segMatches++;
                        }
                        
                    } else {
                        if ( uris[ j ] === ruris[ j ] ) {
                            segMatches++;
                        }
                    }
                }
                
                if ( segMatches === uris.length ) {
                    ret.match = true;
                    ret.matches.push( routes[ i ] );
                    
                    break;
                }
            }
            
            return ret;
        }
    });


/******************************************************************************
 * App Extensions
*******************************************************************************/
app.util.matchRoute = function ( routes ) {
    return new MatchRoute( routes );
};


})( window, window.app );
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
/*!
 *
 * App Util: app.util.throttle
 *
 * A handy way to put a rev limiter on your event callbacks
 *
 * @usage: el.addEventListener( "keyup", app.util.throttle( delay, cb ), false )
 *
 *
 */
(function ( window, app, undefined ) {


"use strict";


/******************************************************************************
 * App Extensions
*******************************************************************************/
app.util.throttle = function ( delay, callback ) {
    var timeout = null;
    
    return function () {
        var context = this,
            args = arguments;
        
        clearTimeout( timeout );
        
        timeout = setTimeout(function () {
            if ( typeof callback === "function" ) {
                callback.apply( context, args );
            }
            
        }, delay );
    };
};


})( window, window.app );