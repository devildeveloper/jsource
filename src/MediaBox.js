/*!
 *
 * A complete management tool for html5 video and audio context
 *
 * @MediaBox
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Expression match hashbang/querystring
 * @member rHashQuery
 * @private
 *
 */
var rHashQuery = /[#|?].*$/g;

/**
 *
 * Replace "no" in canPlayType strings
 * @member rNos
 * @private
 *
 */
var rNos = /^no$/;

/**
 *
 * Clean up all those typeof's
 * @method isFunction
 * @returns boolean
 * @private
 *
 */
var isFunction = function ( f ) {
    return (typeof f === "function");
};

/**
 *
 * Borrowed(ish)
 * Modernizr v2.7.1
 * www.modernizr.com
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
 * Available under the BSD and MIT licenses: www.modernizr.com/license/
 * @method getAudioSupport
 * @returns object
 * @private
 *
 */
var getAudioSupport = function () {
    var elem = document.createElement( "audio" ),
        ret = {};

    try {
        if ( elem.canPlayType ) {
            ret.ogg = elem.canPlayType( 'audio/ogg; codecs="vorbis"' ).replace( rNos, "" );
            ret.mp3 = elem.canPlayType( 'audio/mpeg;' ).replace( rNos, "" );
            ret.wav = elem.canPlayType( 'audio/wav; codecs="1"').replace( rNos, "" );
            ret.m4a = (elem.canPlayType( 'audio/x-m4a;' ) || elem.canPlayType( 'audio/aac;' )).replace( rNos, "" );
        }
        
    } catch ( e ) {}

    return ret;
};

/**
 *
 * Borrowed(ish)
 * Modernizr v2.7.1
 * www.modernizr.com
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
 * Available under the BSD and MIT licenses: www.modernizr.com/license/
 * @method getVideoSupport
 * @returns object
 * @private
 *
 */
var getVideoSupport = function () {
    var elem = document.createElement( "video" ),
        ret = {};

    try {
        if ( elem.canPlayType ) {
            ret.mpeg4 = elem.canPlayType( 'video/mp4; codecs="mp4v.20.8"' ).replace( rNos, "" );
            ret.ogg = elem.canPlayType( 'video/ogg; codecs="theora"' ).replace( rNos, "" );
            ret.h264 = elem.canPlayType( 'video/mp4; codecs="avc1.42E01E"' ).replace( rNos, "" );
            ret.webm = elem.canPlayType( 'video/webm; codecs="vp8, vorbis"' ).replace( rNos, "" );
        }

    } catch ( e ) {}

    return ret;
};

/**
 *
 * Play an audio context
 * @method sourceStart
 * @param {string} track audio object to play
 * @private
 *
 */
var sourceStart = function ( track ) {
    if ( !track.source.start ) {
        track.source.noteOn( 0, track.startOffset % track.buffer.duration );
        
    } else {
        track.source.start( 0, track.startOffset % track.buffer.duration );
    }
};

/**
 *
 * Stop an audio context
 * @method sourceStop
 * @param {string} track audio object to stop
 * @private
 *
 */
var sourceStop = function ( track ) {
    if ( !track.source.stop ) {
        track.source.noteOff( 0 );
        
    } else {
        track.source.stop( 0 );
    }
};

/**
 *
 * Get mimetype string from media source
 * @method getMimeFromMedia
 * @param {string} src media file source
 * @private
 *
 */
var getMimeFromMedia = function ( src ) {
    var ret;
    
    switch ( src.split( "." ).pop().toLowerCase() ) {
        // Audio mimes
        case "ogg":
            ret = "audio/ogg";
            break;
        case "mp3":
            ret = "audio/mpeg";
            break;
            
        // Video mimes
        case "webm":
            ret = "video/webm";
            break;
        case "mp4":
            ret = "video/mp4";
            break;
        case "ogv":
            ret = "video/ogg";
            break;
    }
    
    return ret;
};

/**
 *
 * Get the audio source that should be used
 * @method getCanPlaySource
 * @param {string} media the media type to check
 * @param {array} sources Array of media sources
 * @returns object
 * @private
 *
 */
var getCanPlaySource = function ( media, sources ) {
    var source, canPlay;
    
    for ( var i = sources.length; i--; ) {
        var src = sources[ i ].split( "." ).pop().toLowerCase().replace( rHashQuery, "" );
        
        if ( media === "video" && src === "mp4" ) {
            if ( (MediaBox.support.video.mpeg4 === "probably" || MediaBox.support.video.h264 === "probably") ) {
                source = sources[ i ];
                
                canPlay = "probably";
                
            } else if ( (MediaBox.support.video.mpeg4 === "maybe" || MediaBox.support.video.h264 === "maybe") ) {
                source = sources[ i ];
                
                canPlay = "maybe";
            }
            
        } else if ( MediaBox.support[ media ][ src ] === "probably" ) {
            source = sources[ i ];
            
            canPlay = "probably";
            
        } else if ( MediaBox.support[ media ][ src ] === "maybe" ) {
            source = sources[ i ];
            
            canPlay = "maybe";
        }
        
        if ( source ) {
            break;
        }
    }
    
    return {
        source: source,
        canPlay: canPlay
    };
};


/**
 *
 * A complete management tool for html5 video and audio context
 * @constructor MediaBox
 * @requires Tween
 * @memberof! <global>
 *
 */
var MediaBox = function () {
    return this.init.apply( this, arguments );
};

/**
 *
 * MediaBox support status
 * @memberof MediaBox
 * @member support
 *
 */
MediaBox.support = {
    audio: getAudioSupport(),
    video: getVideoSupport()
};

/**
 *
 * MediaBox stopped state constant
 * @memberof MediaBox
 * @member STATE_STOPPED
 *
 */
MediaBox.STATE_STOPPED = 0;

/**
 *
 * MediaBox stopping state constant
 * @memberof MediaBox
 * @member STATE_STOPPING
 *
 */
MediaBox.STATE_STOPPING = 1;

/**
 *
 * MediaBox paused state constant
 * @memberof MediaBox
 * @member STATE_PAUSED
 *
 */
MediaBox.STATE_PAUSED = 2;

/**
 *
 * MediaBox playing state constant
 * @memberof MediaBox
 * @member STATE_PLAYING
 *
 */
MediaBox.STATE_PLAYING = 3;

/**
 *
 * MediaBox prototype
 *
 */
MediaBox.prototype = {
    constructor: MediaBox,
    
    /**
     *
     * MediaBox init constructor method
     * @memberof MediaBox
     * @method init
     *
     */
    init: function () {
        /**
         *
         * MediaBox information for each channel.
         * These are default channels you can use.
         * <ul>
         * <li>bgm - background music channel</li>
         * <li>sfx - sound effects channel</li>
         * <li>vid - video channel</li>
         * </ul>
         * @memberof MediaBox
         * @member _channels
         *
         */
        this._channels = {
            bgm: {},
            sfx: {},
            vid: {}
        };
        
        /**
         *
         * MediaBox holds all loaded source urls
         * @memberof MediaBox
         * @member _urls
         *
         */
        this._urls = [];
        
        /**
         *
         * MediaBox holds all audio tracks
         * @memberof MediaBox
         * @member _audio
         *
         */
        this._audio = {};
        
        /**
         *
         * MediaBox holds all video tracks
         * @memberof MediaBox
         * @member _video
         *
         */
        this._video = {};
        
        /**
         *
         * MediaBox boolean to stop/start all audio
         * @memberof MediaBox
         * @member _audioPaused
         *
         */
        this._audioPaused = false;
        
        /**
         *
         * Total number of media objects to load
         * @memberof MediaBox
         * @member _mediaCount
         *
         */
        this._mediaCount = 0;
        
        /**
         *
         * Total number of media objects loaded in progress
         * @memberof MediaBox
         * @member _mediaLoads
         *
         */
        this._mediaLoads = 0;
        
        /**
         *
         * The progress event handler
         * @memberof MediaBox
         * @member _progressHandler
         *
         */
        this._progressHandler = null;
    },
    
    /**
     *
     * MediaBox crossbrowser create audio context
     * @memberof MediaBox
     * @method createAudioContext
     * @returns instance of audio context
     *
     */
    createAudioContext: function () {
        var AudioContext;
        
        if ( window.AudioContext ) {
            AudioContext = window.AudioContext;
            
        } else if ( window.webkitAudioContext ) {
            AudioContext = window.webkitAudioContext;
        }
        
        return ( AudioContext ) ? new AudioContext() : AudioContext;
    },
    
    /**
     *
     * MediaBox crossbrowser create gain node
     * @memberof MediaBox
     * @method createGainNode
     * @returns audio context gain node
     *
     */
    createGainNode: function ( context ) {
        var gainNode;
        
        if ( !context.createGain ) {
            gainNode = context.createGainNode();
            
        } else {
            gainNode = context.createGain();
        }
        
        return gainNode;
    },
    
    /**
     *
     * MediaBox check if media is loaded via ajax
     * @memberof MediaBox
     * @method isLoaded
     * @param {string} id reference id for media
     * @returns boolean
     *
     */
    isLoaded: function ( id ) {
        var obj = this._video[ id ] ? this._video[ id ] : this._audio[ id ];
        
        return (obj.loaded === true);
    },
    
    /**
     *
     * MediaBox check stopped/paused status for audio/video
     * @memberof MediaBox
     * @method isStopped
     * @param {string} id reference id for media
     * @returns boolean
     *
     */
    isStopped: function ( id ) {
        var obj = this._video[ id ] ? this._video[ id ] : this._audio[ id ];
        
        return (obj.state === MediaBox.STATE_STOPPED);
    },
    
    /**
     *
     * MediaBox check playing status for audio/video
     * @memberof MediaBox
     * @method isPlaying
     * @param {string} id reference id for media
     * @returns boolean
     *
     */
    isPlaying: function ( id ) {
        var obj = this._video[ id ] ? this._video[ id ] : this._audio[ id ];
        
        return (obj.state === MediaBox.STATE_PLAYING);
    },
    
    /**
     *
     * MediaBox load media config JSON formatted in Akihabara bundle style
     * @memberof MediaBox
     * @method loadMedia
     * @param {string} url The url to the JSON config
     * @param {function} callback Fired when all media is loaded
     * @example
     * // Akihabara bundle format
     * "addAudio": [
     *     [
     *         "{id}",
     *         [
     *             "{file}.mp3",
     *             "{file}.ogg"
     *         ],
     *         {
     *             "channel": "bgm",
     *             "loop": true
     *         }
     *     ]
     * ]
     *
     */
    loadMedia: function ( url, callback ) {
        var xhr = new XMLHttpRequest(),
            self = this;
        
        xhr.open( "GET", url, true );
        xhr.onreadystatechange = function ( e ) {
            if ( this.readyState === 4 ) {
                if ( this.status === 200 ) {
                    var response;
                        
                    try {
                        response = JSON.parse( this.responseText );
                        
                    } catch ( error ) {}
                    
                    if ( response ) {
                        self.addMedia( response, callback );
                    }
                }
            }
        };
        xhr.send();
    },
    
    /**
     *
     * MediaBox add media from bundle json
     * @memberof MediaBox
     * @method addMedia
     * @param {object} json Akihabara formatted media bundle object
     * @param {function} callback function fired on XMLHttpRequest.onload
     *
     */
    addMedia: function ( json, callback ) {
        var current = 0,
            total = 0,
            func = function () {
                current++;
                
                if ( isFunction( callback ) && (current === total) ) {
                    callback();
                }
            };
        
        for ( var m in json ) {
            total = total + json[ m ].length;
            
            this._mediaCount = total;
            
            for ( var i = json[ m ].length; i--; ) {
                // Reference to this.addVideo / this.addAudio
                this[ m ]( json[ m ][ i ], func );
            }
        }
    },
    
    /**
     *
     * Bind the progress handler for a given batch of media
     * @memberof MediaBox
     * @method addProgress
     * @param {function} callback function fired on progress processing
     *
     */
    addProgress: function ( callback ) {
        this._progressHandler = callback;
    },
    
    /**
     *
     * MediaBox add a video element
     * @memberof MediaBox
     * @method addVideo
     * @param {array} obj Akihabara formatted media bundle
     * @param {function} callback function fired on XMLHttpRequest.onload
     *
     */
    addVideo: function ( obj, callback ) {
        var self = this,
            id = obj[ 0 ],
            
            // Handle the loaded video
            handler = function () {
                self._processLoaded();
                
                var source = document.createElement( "source" );
                    source.src = self._video[ id ]._usedSource.source;
                    source.type = getMimeFromMedia( self._video[ id ]._usedSource.source );
            
                self._video[ id ].loaded = true;
                self._video[ id ].element.appendChild( source );
            },
            xhr;
        
        // Disallow overrides
        if ( this._video[ id ] ) {
            //console.log( "@MediaBox:addVideo Already added " + id );
            return;
        }
        
        // Allow new channels to exist
        if ( !this._channels[ obj[ 2 ].channel ] ) {
            this._channels[ obj[ 2 ].channel ] = {};
        }
        
        // Create video object
        this._video[ id ] = {};
        this._video[ id ].channel = obj[ 2 ].channel;
        this._video[ id ].loop = (obj[ 2 ].loop || false);
        this._video[ id ].sources = obj[ 1 ];
        this._video[ id ].element = document.createElement( "video" );
        this._video[ id ].state = MediaBox.STATE_STOPPED;
        this._video[ id ].loaded = false;
        this._video[ id ]._usedSource = getCanPlaySource( "video", this._video[ id ].sources );
        this._video[ id ]._events = {};
        
        // Set loop
        if ( this._video[ id ].loop ) {
            this._video[ id ].element.loop = true;
        }
        
        // Check if we have loaded this url before
        // If so, we don't want to make another request for it
        // but we still need to create the video object out of it
        if ( this._urls.indexOf( this._video[ id ]._usedSource.source ) !== -1 ) {
            if ( isFunction( callback ) ) {
                handler();
                callback();
                return;
            }
        }
        
        // Push the source onto the loaded url stack
        this._urls.push( this._video[ id ]._usedSource.source );
        
        xhr = new XMLHttpRequest();
        xhr.open( "GET", this._video[ id ]._usedSource.source, true );
        xhr.onload = function ( e ) {
            handler();
            
            if ( isFunction( callback ) ) {
                callback();
            }
        };
        xhr.send();
    },
    
    /**
     *
     * MediaBox get a video element property
     * @memberof MediaBox
     * @method getVideoProp
     * @param {string} id Video id to add event for
     * @param {string} prop The property to access
     *
     */
    getVideoProp: function ( id, prop ) {
        return this._video[ id ].element[ prop ];
    },
    
    /**
     *
     * MediaBox set a video element property
     * @memberof MediaBox
     * @method setVideoProp
     * @param {string} id Video id to add event for
     * @param {string} prop The property to set
     * @param {mixed} value The value to assign
     *
     */
    setVideoProp: function ( id, prop, value ) {
        this._video[ id ].element[ prop ] = value;
    },
    
    /**
     *
     * MediaBox add a video element event listener
     * @memberof MediaBox
     * @method addVideoEvent
     * @param {string} id Video id to add event for
     * @param {string} event Event to add
     * @param {function} callback The event handler to call
     *
     */
    addVideoEvent: function ( id, event, callback ) {
        if ( this._video[ id ] ) {
            this._video[ id ]._events[ event ] = function () {
                if ( isFunction( callback ) ) {
                    callback.apply( this, arguments );
                }
            };
            
            this._video[ id ].element.addEventListener( event, this._video[ id ]._events[ event ], false );
        }
    },
    
    /**
     *
     * MediaBox remove a video element event listener
     * @memberof MediaBox
     * @method addVideoEvent
     * @param {string} id Video id to remove event for
     * @param {string} event Event to remove
     *
     */
    removeVideoEvent: function ( id, event ) {
        if ( this._video[ id ] ) {
            this._video[ id ].element.removeEventListener( event, this._video[ id ]._events[ event ], false );
            
            this._video[ id ]._events[ event ] = null;
        }
    },
    
    /**
     *
     * MediaBox get video element by id
     * @memberof MediaBox
     * @method getVideo
     * @param {string} id reference id for media
     * @returns <video> element
     *
     */
    getVideo: function ( id ) {
        var ret;
        
        if ( this._video[ id ] ) {
            ret = this._video[ id ].element;
        }
        
        return ret;
    },
    
    /**
     *
     * MediaBox get all video elements as an array
     * @memberof MediaBox
     * @method getVideos
     * @returns array
     *
     */
    getVideos: function () {
        var ret = [];
        
        for ( var id in this._video ) {
            ret.push( this._video[ id ].element );
        }
        
        return ret;
    },
    
    /**
     *
     * MediaBox play video element by id
     * @memberof MediaBox
     * @method playVideo
     * @param {string} id reference id for media
     *
     */
    playVideo: function ( id ) {
        if ( this._video[ id ] && this.isLoaded( id ) && this.isStopped( id ) ) {
            this._video[ id ].element.volume = this._channels[ this._video[ id ].channel ].volume;
            this._video[ id ].element.play();
            this._video[ id ].state = MediaBox.STATE_PLAYING;
        }
    },
    
    /**
     *
     * MediaBox stop video element by id with a paused state
     * @memberof MediaBox
     * @method pauseVideo
     * @param {string} id reference id for media
     *
     */
    pauseVideo: function ( id ) {
        if ( this._video[ id ] && this.isLoaded( id ) && this.isPlaying( id ) ) {
            this._video[ id ].element.pause();
            this._video[ id ].state = MediaBox.STATE_PAUSED;
        }
    },
    
    /**
     *
     * MediaBox stop video element by id with a stopped state
     * @memberof MediaBox
     * @method playVideo
     * @param {string} id reference id for media
     *
     */
    stopVideo: function ( id ) {
        if ( this._video[ id ] && this.isLoaded( id ) && this.isPlaying( id ) ) {
            this._video[ id ].element.pause();
            this._video[ id ].state = MediaBox.STATE_STOPPED;
        }
    },
    
    /**
     *
     * MediaBox add an audio context
     * @memberof MediaBox
     * @method addAudio
     * @param {array} obj Akihabara formatted media bundle
     * @param {function} callback function fired on XMLHttpRequest.onload
     *
     */
    addAudio: function ( obj, callback ) {
        var self = this,
            id = obj[ 0 ],
            xhr;
        
        // Disallow overrides
        if ( this._audio[ id ] ) {
            //console.log( "@MediaBox:addAudio Already added " + id );
            return;
        }
        
        // Allow new channels to exist
        if ( !this._channels[ obj[ 2 ].channel ] ) {
            this._channels[ obj[ 2 ].channel ] = {};
        }
        
        // Create audio object
        this._audio[ id ] = {};
        this._audio[ id ].channel = obj[ 2 ].channel;
        this._audio[ id ].loop = (obj[ 2 ].loop || false);
        this._audio[ id ].sources = obj[ 1 ];
        this._audio[ id ].context = this.createAudioContext();
        this._audio[ id ].state = MediaBox.STATE_STOPPED;
        this._audio[ id ].loaded = false;
        this._audio[ id ]._usedSource = getCanPlaySource( "audio", this._audio[ id ].sources );
        
        xhr = new XMLHttpRequest();
        xhr.open( "GET", this._audio[ id ]._usedSource.source, true );
        xhr.responseType = "arraybuffer";
        xhr.onload = function ( e ) {
            self._audio[ id ].context.decodeAudioData( xhr.response, function ( buffer ) {
                self._processLoaded();
                
                self._audio[ id ].loaded = true;
                self._audio[ id ].startTime = 0;
                self._audio[ id ].startOffset = 0;
                self._audio[ id ].buffer = buffer;
                self._audio[ id ].gainNode = self.createGainNode( self._audio[ id ].context );
                
                if ( isFunction( callback ) ) {
                    callback();
                }
            });
        };
        xhr.send();
    },
    
    /**
     *
     * MediaBox play audio context
     * @memberof MediaBox
     * @method playAudio
     * @param {string} id string reference id for audio
     *
     */
    playAudio: function ( id ) {
        if ( this._audio[ id ] ) {
            this._audio[ id ].startTime = this._audio[ id ].context.currentTime;
            
            this._audio[ id ].source = this._audio[ id ].context.createBufferSource();
            this._audio[ id ].source.buffer = this._audio[ id ].buffer;
            this._audio[ id ].source.connect( this._audio[ id ].gainNode );
            this._audio[ id ].gainNode.connect( this._audio[ id ].context.destination );
            this._audio[ id ].gainNode.gain.value = (this._channels[ this._audio[ id ].channel ].volume || 1.0);
            
            if ( this._audio[ id ].loop ) {
                this._audio[ id ].source.loop = true;
            }
            
            sourceStart( this._audio[ id ] );
            
            this._audio[ id ].state = MediaBox.STATE_PLAYING;
        }
    },
    
    /**
     *
     * MediaBox simply a wrapper for playAudio
     * @memberof MediaBox
     * @method hitAudio
     * @param {string} id string reference id for audio
     *
     */
    hitAudio: function ( id ) {
        this.playAudio( id );
    },
    
    /**
     *
     * MediaBox stop playing an audio context
     * @memberof MediaBox
     * @method stopAudio
     * @param {string} id string reference id for audio
     *
     */
    stopAudio: function ( id ) {
        if ( this._audio[ id ] ) {
            this._audio[ id ].startTime = 0;
            this._audio[ id ].startOffset = 0;
            this._audio[ id ].state = MediaBox.STATE_STOPPED;
            
            sourceStop( this._audio[ id ] );
        }
    },
    
    /**
     *
     * MediaBox pause playing audio, calls sourceStop
     * @memberof MediaBox
     * @method pauseAudio
     * @param {string} id id of audio to pause
     *
     */
    pauseAudio: function ( id ) {
        if ( this._audio[ id ] ) {
            this._audio[ id ].startOffset += (this._audio[ id ].context.currentTime - this._audio[ id ].startTime);
            this._audio[ id ].state = MediaBox.STATE_PAUSED;
            
            sourceStop( this._audio[ id ] );
        }
    },
    
    /**
     *
     * MediaBox fade in audio context volume
     * @memberof MediaBox
     * @method fadeAudioIn
     * @param {string} id string reference id for audio
     * @param {number} duration tween time in ms
     * @param {function} easing optional easing to use
     *
     */
    fadeAudioIn: function ( id, duration, easing ) {
        if ( this._audio[ id ].state === MediaBox.STATE_PLAYING ) {
            //console.log( "@MediaBox:fadeAudioIn Already playing " + id );
            
            return this;
        }
        
        var self = this,
            volume = this._channels[ this._audio[ id ].channel ].volume;
        
        if ( this._audio[ id ] ) {
            // Only reset volume and play if audio is stopped
            // Audio state could be STATE_STOPPING at this point
            if ( this._audio[ id ].state === MediaBox.STATE_STOPPED ) {
                this._audio[ id ].gainNode.gain.value = 0;
            
                this.playAudio( id );
                
            } else if ( this._audio[ id ].state === MediaBox.STATE_STOPPING ) {
                this._audio[ id ].state = MediaBox.STATE_PLAYING;
            }
            
            new Tween({
                to: volume,
                from: 0,
                ease: ( isFunction( easing ) ) ? easing : Easing.linear,
                duration: (duration || 1000),
                update: function ( v ) {
                    self._audio[ id ].gainNode.gain.value = v;
                },
                complete: function ( v ) {
                    self._audio[ id ].gainNode.gain.value = v;
                }
            });
        }
    },
    
    /**
     *
     * MediaBox fade out audio context volume
     * @memberof MediaBox
     * @method fadeAudioOut
     * @param {string} id string reference id for audio
     * @param {number} duration tween time in ms
     * @param {function} easing optional easing to use
     *
     */
    fadeAudioOut: function ( id, duration, easing ) {
        if ( this._audio[ id ].state === MediaBox.STATE_STOPPING ) {
            //console.log( "@MediaBox:fadeAudioOut Already stopping " + id );
            
            return this;
        }
        
        var self = this,
            handler = function ( v ) {
                // Check audio state on fadeout in case it is started again
                // before the duration of the fadeout is complete.
                if ( self._audio[ id ].state === self.STATE_STOPPING ) {
                    self._audio[ id ].gainNode.gain.value = v;
                
                    if ( self._audio[ id ].gainNode.gain.value === 0 ) {
                        self.stopAudio( id );
                    }
                }
            };
        
        if ( this._audio[ id ] ) {
            this._audio[ id ].state = MediaBox.STATE_STOPPING;
            
            new Tween({
                to: 0,
                from: this._audio[ id ].gainNode.gain.value,
                ease: ( isFunction( easing ) ) ? easing : Easing.linear,
                duration: (duration || 1000),
                update: handler,
                complete: handler
            });
        }
    },
    
    /**
     *
     * MediaBox pause all playing audio for a given channel id
     * @memberof MediaBox
     * @method stopChannel
     * @param {string} channel string reference id for channel
     *
     */
    stopChannel: function ( channel ) {
        var id;
        
        // Look at video index
        for ( id in this._video ) {
            if ( this._video[ id ].channel === channel && this._video[ id ].state === MediaBox.STATE_PLAYING ) {
                this.pauseVideo( id );
            }
        }
        
        // Look at audio index
        for ( id in this._audio ) {
            if ( this._audio[ id ].channel === channel && this._audio[ id ].state === MediaBox.STATE_PLAYING ) {
                this.pauseAudio( id );
            }
        }
    },
    
    /**
     *
     * MediaBox resume all playing audio for a given channel id
     * @memberof MediaBox
     * @method playChannel
     * @param {string} channel string reference id for channel
     *
     */
    playChannel: function ( channel ) {
        var id;
        
        // Look at video index
        for ( id in this._video ) {
            if ( this._video[ id ].channel === channel && this._video[ id ].state === MediaBox.STATE_PAUSED ) {
                this.playVideo( id );
            }
        }
        
        // Look at audio index
        for ( id in this._audio ) {
            if ( this._audio[ id ].channel === channel && this._audio[ id ].state === MediaBox.STATE_PAUSED ) {
                this.playAudio( id );
            }
        }
    },
    
    /**
     *
     * MediaBox fade out all playing audio for a given channel id
     * @memberof MediaBox
     * @method fadeChannelOut
     * @param {string} channel string reference id for channel
     * @param {number} duration tween time in ms
     *
     */
    fadeChannelOut: function ( channel, duration ) {
        for ( var id in this._audio ) {
            if ( this._audio[ id ].channel === channel && this._audio[ id ].state === MediaBox.STATE_PLAYING ) {
                this.fadeAudioOut( id, duration );
            }
        }
    },
    
    /**
     *
     * MediaBox fade in all playing audio for a given channel id
     * @memberof MediaBox
     * @method fadeChannelIn
     * @param {string} channel string reference id for channel
     * @param {number} duration tween time in ms
     *
     */
    // Need to figure out how this would work
    fadeChannelIn: function ( channel, duration ) {
        for ( var id in this._audio ) {
            if ( this._audio[ id ].channel === channel && this._audio[ id ].state === MediaBox.STATE_PAUSED ) {
                this.fadeAudioIn( id, duration );
            }
        }
    },
    
    /**
     *
     * MediaBox crossfade between 2 audio contexts on a given channel
     * @memberof MediaBox
     * @method crossFadeChannel
     * @param {string} channel string reference id for channel
     * @param {string} id string reference id for audio to bring in
     * @param {number} duration tween time in ms
     *
     */
    crossFadeChannel: function ( channel, id, duration ) {
        for ( var i in this._audio ) {
            if ( this._audio[ i ].channel === channel && this._audio[ i ].state === MediaBox.STATE_PLAYING ) {
                this.fadeAudioOut( i, duration );
            }
        }
        
        this.fadeAudioIn( id, duration );
    },
    
    /**
     *
     * MediaBox set the master volume for a channel
     * @memberof MediaBox
     * @method setChannelVolume
     * @param {string} key string id reference to channel
     * @param {string} val floating point number for volume setting
     *
     */
    setChannelVolume: function ( key, val ) {
        if ( this._channels[ key ] ) {
            this._channels[ key ].volume = val;
        }
    },
    
    /**
     *
     * MediaBox pause all playing audio on a channel
     * @memberof MediaBox
     * @method pauseAll
     *
     */
    pauseAll: function ( channel ) {
        if ( this._audioPaused ) {
            return this;
        }
        
        this._audioPaused = true;
        
        for ( var id in this._audio ) {
            if ( this._audio[ id ].state === MediaBox.STATE_PLAYING ) {
                if ( this._audio[ id ].channel === channel ) {
                    this.pauseAudio( id );
                }
            }
        }
    },
    
    /**
     *
     * MediaBox resume all playing audio on a channel
     * @memberof MediaBox
     * @method resumeAll
     *
     */
    resumeAll: function ( channel ) {
        if ( !this._audioPaused ) {
            return this;
        }
        
        this._audioPaused = false;
        
        for ( var id in this._audio ) {
            if ( this._audio[ id ].state === MediaBox.STATE_PAUSED ) {
                if ( this._audio[ id ].channel === channel ) {
                    this.playAudio( id );
                }
            }
        }
    },
    
    /**
     *
     * Process load data each time a request fulfills
     * @memberof MediaBox
     * @method _processLoaded
     * @private
     *
     */
    _processLoaded: function () {
        this._mediaLoads++;
        
        if ( isFunction( this._progressHandler ) ) {
            this._progressHandler({
                total: this._mediaCount,
                loaded: this._mediaLoads,
                decimalPercent: (this._mediaLoads / this._mediaCount),
                wholePercent: (this._mediaLoads / this._mediaCount) * 100
            });
        }
        
        // Reset the media counters after this batch is loaded
        if ( this._mediaLoads === this._mediaCount ) {
            this._mediaCount = 0;
            this._mediaLoads = 0;
        }
    }
};


// Expose
window.MediaBox = MediaBox;


})( window );