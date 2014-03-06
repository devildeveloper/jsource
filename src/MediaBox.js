/*!
 *
 * Manage audio and video with playback
 *
 * @MediaBox
 * @author: kitajchuk
 *
 */
(function ( window, undefined ) {


"use strict";


/**
 *
 * Manage audio and video with playback
 * @constructor MediaBox
 * @requires Easing
 * @requires Tween
 * @memberof! <global>
 *
 */
var MediaBox = function () {
    return this.init.apply( this, arguments );
};

MediaBox.prototype = {
    constructor: MediaBox,
    
    /**
     *
     * MediaBox stopped state constant
     * @memberof MediaBox
     * @member MediaBox.STATE_STOPPED
     *
     */
    STATE_STOPPED: 0,
    
    /**
     *
     * MediaBox stopping state constant
     * @memberof MediaBox
     * @member MediaBox.STATE_STOPPING
     *
     */
    STATE_STOPPING: 1,
    
    /**
     *
     * MediaBox paused state constant
     * @memberof MediaBox
     * @member MediaBox.STATE_PAUSED
     *
     */
    STATE_PAUSED: 2,
    
    /**
     *
     * MediaBox playing state constant
     * @memberof MediaBox
     * @member MediaBox.STATE_PLAYING
     *
     */
    STATE_PLAYING: 3,
    
    /**
     *
     * Expression match hashbang/querystring
     * @memberof MediaBox
     * @member MediaBox._rHashQuery
     *
     */
    _rHashQuery: /[#|?].*$/g,
    
    /**
     *
     * MediaBox supports
     * @memberof MediaBox
     * @member MediaBox._supported
     *
     */
    _supported: {},
    
    /**
     *
     * MediaBox information for each channel
     * @memberof MediaBox
     * @member MediaBox._channels
     *
     */
    _channels: {},
    
    /**
     *
     * MediaBox holds all audio tracks
     * @memberof MediaBox
     * @member MediaBox._audio
     *
     */
    _audio: {},
    
    /**
     *
     * MediaBox holds all video tracks
     * @memberof MediaBox
     * @member MediaBox._video
     *
     */
    _video: {},
    
    /**
     *
     * MediaBox boolean to stop/start all audio
     * @memberof MediaBox
     * @member MediaBox._audioPaused
     *
     */
    _audioPaused: false,
    
    /**
     *
     * MediaBox init constructor method
     * @memberof MediaBox
     * @method MediaBox.init
     *
     */
    init: function () {
        var self = this;
        
        /**
         *
         * MediaBox supported audio
         * @memberof MediaBox
         * @member MediaBox._supported.audio
         *
         */
        this._supported.audio = this._getAudioSupport();
        
        /**
         *
         * MediaBox supported video
         * @memberof MediaBox
         * @member MediaBox._supported.video
         *
         */
        this._supported.video = this._getVideoSupport();
    },
    
    /**
     *
     * MediaBox crossbrowser create audio context
     * @memberof MediaBox
     * @method MediaBox.createAudioContext
     * @returns instance of audio context
     *
     */
    createAudioContext: function () {
        var AudioContext;
        
        if ( window.AudioContext ) {
            AudioContext = AudioContext;
            
        } else if ( window.webkitAudioContext ) {
            AudioContext = webkitAudioContext;
        }
        
        return ( AudioContext ) ? new AudioContext() : AudioContext;
    },
    
    /**
     *
     * MediaBox crossbrowser create gain node
     * @memberof MediaBox
     * @method MediaBox.createGainNode
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
     * MediaBox load media config JSON formatted in Akihabara bundle style
     * @memberof MediaBox
     * @method MediaBox.loadMedia
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
     * @method MediaBox.addMedia
     * @param {object} json Akihabara formatted media bundle object
     * @param {function} callback function fired on XMLHttpRequest.onload
     *
     */
    addMedia: function ( json, callback ) {
        var current = 0,
            total = 0,
            func = function () {
                current++;
                
                if ( (typeof callback === "function") && (current === total) ) {
                    callback();
                }
            };
        
        for ( var m in json ) {
            total = total + json[ m ].length;
            
            for ( var i = json[ m ].length; i--; ) {
                this[ m ]( json[ m ][ i ], func );
            }
        }
    },
    
    /**
     *
     * MediaBox add a video element
     * @memberof MediaBox
     * @method MediaBox.addVideo
     * @param {array} obj Akihabara formatted media bundle
     * @param {function} callback function fired on XMLHttpRequest.onload
     *
     */
    addVideo: function ( obj, callback ) {
        var self = this,
            id = obj[ 0 ],
            xhr = new XMLHttpRequest();
        
        if ( !this._channels[ obj[ 2 ].channel ] ) {
            this._channels[ obj[ 2 ].channel ] = {};
        }
        
        // Create video object
        this._video[ id ] = {};
        this._video[ id ].channel = obj[ 2 ].channel;
        this._video[ id ].loop = (obj[ 2 ].loop || false);
        this._video[ id ].sources = obj[ 1 ];
        this._video[ id ].element = document.createElement( "video" );
        this._video[ id ].element.setAttribute( "controls", false );
        this._video[ id ]._usedSource = this._getUsedMediaSource( "video", this._video[ id ].sources );
        this._video[ id ]._events = {};
        
        xhr.open( "GET", this._video[ id ]._usedSource.source, true );
        xhr.onload = function ( e ) {
            var source = document.createElement( "source" );
                source.src = self._video[ id ]._usedSource.source;
                source.type = self._getMimeFromMedia( self._video[ id ]._usedSource.source );
        
            self._video[ id ].element.appendChild( source );
            
            if ( typeof callback === "function" ) {
                callback();
            }
        };
        xhr.send();
    },
    
    /**
     *
     * MediaBox add a video element event listener
     * @memberof MediaBox
     * @method MediaBox.addVideoEvent
     * @param {string} id Video id to add event for
     * @param {string} event Event to add
     * @param {function} callback The event handler to call
     *
     */
    addVideoEvent: function ( id, event, callback ) {
        if ( this._video[ id ] ) {
            this._video[ id ]._events[ event ] = function () {
                if ( typeof callback === "function" ) {
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
     * @method MediaBox.addVideoEvent
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
     * @method MediaBox.getVideo
     * @param {id} string reference id for video
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
     * MediaBox play video element by id
     * @memberof MediaBox
     * @method MediaBox.playVideo
     * @param {id} string reference id for video
     *
     */
    playVideo: function ( id ) {
        if ( this._video[ id ] ) {
            this._video[ id ].element.volume = this._channels[ this._video[ id ].channel ].volume;
            this._video[ id ].element.play();
        }
    },
    
    /**
     *
     * MediaBox stop video element by id
     * @memberof MediaBox
     * @method MediaBox.playVideo
     * @param {id} string reference id for video
     *
     */
    stopVideo: function ( id ) {
        if ( this._video[ id ] ) {
            this._video[ id ].element.pause();
        }
    },
    
    /**
     *
     * MediaBox add an audio context
     * @memberof MediaBox
     * @method MediaBox.addAudio
     * @param {array} obj Akihabara formatted media bundle
     * @param {function} callback function fired on XMLHttpRequest.onload
     *
     */
    addAudio: function ( obj, callback ) {
        var self = this,
            id = obj[ 0 ],
            xhr = new XMLHttpRequest();
        
        if ( !this._channels[ obj[ 2 ].channel ] ) {
            this._channels[ obj[ 2 ].channel ] = {};
        }
        
        // Create audio object
        this._audio[ id ] = {};
        this._audio[ id ].channel = obj[ 2 ].channel;
        this._audio[ id ].loop = (obj[ 2 ].loop || false);
        this._audio[ id ].sources = obj[ 1 ];
        this._audio[ id ].context = this.createAudioContext();
        this._audio[ id ]._usedSource = this._getUsedMediaSource( "audio", this._audio[ id ].sources );
        this._audio[ id ].state = this.STATE_STOPPED;
        
        xhr.open( "GET", this._audio[ id ]._usedSource.source, true );
        xhr.responseType = "arraybuffer";
        xhr.onload = function ( e ) {
            self._audio[ id ].context.decodeAudioData( xhr.response, function ( buffer ) {
                self._audio[ id ].startTime = 0;
                self._audio[ id ].startOffset = 0;
                self._audio[ id ].buffer = buffer;
                self._audio[ id ].gainNode = self.createGainNode( self._audio[ id ].context );
                
                if ( typeof callback === "function" ) {
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
     * @method MediaBox.playAudio
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
            
            this._sourceStart( this._audio[ id ] );
            
            this._audio[ id ].state = this.STATE_PLAYING;
        }
    },
    
    /**
     *
     * MediaBox simply a wrapper for playAudio
     * @memberof MediaBox
     * @method MediaBox.hitAudio
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
     * @method MediaBox.stopAudio
     * @param {string} id string reference id for audio
     *
     */
    stopAudio: function ( id ) {
        if ( this._audio[ id ] ) {
            this._audio[ id ].startTime = 0;
            this._audio[ id ].startOffset = 0;
            this._audio[ id ].state = this.STATE_STOPPED;
            
            this._sourceStop( this._audio[ id ] );
        }
    },
    
    /**
     *
     * MediaBox pause playing audio, calls _sourceStop
     * @memberof MediaBox
     * @method MediaBox.pauseAudio
     * @param {string} id id of audio to pause
     *
     */
    pauseAudio: function ( id ) {
        if ( this._audio[ id ] ) {
            this._audio[ id ].startOffset += (this._audio[ id ].context.currentTime - this._audio[ id ].startTime);
            this._audio[ id ].state = this.STATE_PAUSED;
            
            this._sourceStop( this._audio[ id ] );
        }
    },
    
    /**
     *
     * MediaBox fade in audio context volume
     * @memberof MediaBox
     * @method MediaBox.fadeAudioIn
     * @param {string} id string reference id for audio
     * @param {number} duration tween time in ms
     *
     */
    fadeAudioIn: function ( id, duration ) {
        if ( this._audio[ id ].state === this.STATE_PLAYING ) {
            //console.log( "@MediaBox:fadeAudioIn Already playing " + id );
            
            return this;
        }
        
        var self = this,
            volume = this._channels[ this._audio[ id ].channel ].volume;
        
        if ( this._audio[ id ] ) {
            // Only reset volume and play if audio is stopped
            // Audio state could be STATE_STOPPING at this point
            if ( this._audio[ id ].state === this.STATE_STOPPED ) {
                this._audio[ id ].gainNode.gain.value = 0;
            
                this.playAudio( id );
                
            } else if ( this._audio[ id ].state === this.STATE_STOPPING ) {
                this._audio[ id ].state = this.STATE_PLAYING;
            }
            
            new Tween( (duration || 1000), 0, volume, function ( v ) {
                self._audio[ id ].gainNode.gain.value = v;
            });
        }
    },
    
    /**
     *
     * MediaBox fade out audio context volume
     * @memberof MediaBox
     * @method MediaBox.fadeAudioOut
     * @param {string} id string reference id for audio
     * @param {number} duration tween time in ms
     *
     */
    fadeAudioOut: function ( id, duration ) {
        if ( this._audio[ id ].state === this.STATE_STOPPING ) {
            //console.log( "@MediaBox:fadeAudioOut Already stopping " + id );
            
            return this;
        }
        
        var self = this;
        
        if ( this._audio[ id ] ) {
            this._audio[ id ].state = this.STATE_STOPPING;
            
            new Tween( (duration || 1000), this._audio[ id ].gainNode.gain.value, 0, function ( v ) {
                // Check audio state on fadeout in case it is started again
                // before the duration of the fadeout is complete.
                if ( self._audio[ id ].state === self.STATE_STOPPING ) {
                    self._audio[ id ].gainNode.gain.value = v;
                
                    if ( self._audio[ id ].gainNode.gain.value === 0 ) {
                        self.stopAudio( id );
                    }
                }
            });
        }
    },
    
    /**
     *
     * MediaBox pause all playing audio for a given channel id
     * @memberof MediaBox
     * @method MediaBox.stopChannel
     * @param {string} channel string reference id for channel
     *
     */
    stopChannel: function ( channel ) {
        for ( var id in this._audio ) {
            if ( this._audio[ id ].channel === channel && this._audio[ id ].state === this.STATE_PLAYING ) {
                this.pauseAudio( id );
            }
        }
    },
    
    /**
     *
     * MediaBox resume all playing audio for a given channel id
     * @memberof MediaBox
     * @method MediaBox.playChannel
     * @param {string} channel string reference id for channel
     *
     */
    playChannel: function ( channel ) {
        for ( var id in this._audio ) {
            if ( this._audio[ id ].channel === channel && this._audio[ id ].state === this.STATE_PAUSED ) {
                this.playAudio( id );
            }
        }
    },
    
    /**
     *
     * MediaBox fade out all playing audio for a given channel id
     * @memberof MediaBox
     * @method MediaBox.fadeChannelOut
     * @param {string} channel string reference id for channel
     * @param {number} duration tween time in ms
     *
     */
    fadeChannelOut: function ( channel, duration ) {
        for ( var id in this._audio ) {
            if ( this._audio[ id ].channel === channel && this._audio[ id ].state === this.STATE_PLAYING ) {
                this.fadeAudioOut( id, duration );
            }
        }
    },
    
    /**
     *
     * MediaBox fade in all playing audio for a given channel id
     * @memberof MediaBox
     * @method MediaBox.fadeChannelIn
     * @param {string} channel string reference id for channel
     * @param {number} duration tween time in ms
     *
     */
    // Need to figure out how this would work
    fadeChannelIn: function ( channel, duration ) {
        for ( var id in this._audio ) {
            if ( this._audio[ id ].channel === channel && this._audio[ id ].state === this.STATE_PAUSED ) {
                this.fadeAudioIn( id, duration );
            }
        }
    },
    
    /**
     *
     * MediaBox crossfade between 2 audio contexts on a given channel
     * @memberof MediaBox
     * @method MediaBox.crossFadeChannel
     * @param {string} channel string reference id for channel
     * @param {string} id string reference id for audio to bring in
     * @param {number} duration tween time in ms
     *
     */
    crossFadeChannel: function ( channel, id, duration ) {
        for ( var i in this._audio ) {
            if ( this._audio[ i ].channel === channel && this._audio[ i ].state === this.STATE_PLAYING ) {
                this.fadeAudioOut( i, duration );
            }
        }
        
        this.fadeAudioIn( id, duration );
    },
    
    /**
     *
     * MediaBox set the master volume for a channel
     * @memberof MediaBox
     * @method MediaBox.setChannelVolume
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
     * @method MediaBox.pauseAll
     *
     */
    pauseAll: function ( channel ) {
        if ( this._audioPaused ) {
            return this;
        }
        
        this._audioPaused = true;
        
        for ( var id in this._audio ) {
            if ( this._audio[ id ].state === this.STATE_PLAYING ) {
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
     * @method MediaBox.resumeAll
     *
     */
    resumeAll: function ( channel ) {
        if ( !this._audioPaused ) {
            return this;
        }
        
        this._audioPaused = false;
        
        for ( var id in this._audio ) {
            if ( this._audio[ id ].state === this.STATE_PAUSED ) {
                if ( this._audio[ id ].channel === channel ) {
                    this.playAudio( id );
                }
            }
        }
    },
    
    /**
     *
     * MediaBox private play an audio context
     * @memberof MediaBox
     * @method MediaBox._sourceStart
     * @param {string} track audio object to play
     *
     */
    _sourceStart: function ( track ) {
        if ( !track.source.start ) {
            track.source.noteOn( 0, track.startOffset % track.buffer.duration );
            
        } else {
            track.source.start( 0, track.startOffset % track.buffer.duration );
        }
    },
    
    /**
     *
     * MediaBox private stop an audio context
     * @memberof MediaBox
     * @method MediaBox._sourceStop
     * @param {string} track audio object to stop
     *
     */
    _sourceStop: function ( track ) {
        if ( !track.source.stop ) {
            track.source.noteOff( 0 );
            
        } else {
            track.source.stop( 0 );
        }
    },
    
    /**
     *
     * MediaBox private get mimetype string from media source
     * @memberof MediaBox
     * @method MediaBox._getMimeFromMedia
     * @param {string} src media file source
     *
     */
    _getMimeFromMedia: function ( src ) {
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
    },
    
    /**
     *
     * Get the audio source that should be used
     * @memberof MediaBox
     * @method MediaBox._getUsedMediaSource
     * @param {string} media the media type to check
     * @param {array} sources Array of media sources
     * @returns object
     *
     */
    _getUsedMediaSource: function ( media, sources ) {
        var source, canPlay;
        
        for ( var i = sources.length; i--; ) {
            var src = sources[ i ].split( "." ).pop().toLowerCase().replace( this._rHashQuery, "" );
            
            if ( media === "video" && src === "mp4" ) {
                if ( (this._supported.video.mpeg4 === "probably" || this._supported.video.h264 === "probably") ) {
                    source = sources[ i ];
                    
                    canPlay = "probably";
                    
                } else if ( (this._supported.video.mpeg4 === "maybe" || this._supported.video.h264 === "maybe") ) {
                    source = sources[ i ];
                    
                    canPlay = "maybe";
                }
                
            } else if ( this._supported[ media ][ src ] === "probably" ) {
                source = sources[ i ];
                
                canPlay = "probably";
                
            } else if ( this._supported[ media ][ src ] === "maybe" ) {
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
    },
    
    /**
     *
     * Borrowed(ish)
     * Modernizr v2.7.1
     * www.modernizr.com
     * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
     * Available under the BSD and MIT licenses: www.modernizr.com/license/
     *
     * @memberof MediaBox
     * @method MediaBox._getAudioSupport
     * @returns object
     *
     */
    _getAudioSupport: function () {
        var elem = document.createElement( "audio" ),
            rnos = /^no$/,
            ret = {};

        try {
            if ( elem.canPlayType ) {
                ret.ogg = elem.canPlayType( 'audio/ogg; codecs="vorbis"' ).replace( rnos, "" );
                ret.mp3 = elem.canPlayType( 'audio/mpeg;' ).replace( rnos, "" );
                ret.wav = elem.canPlayType( 'audio/wav; codecs="1"').replace( rnos, "" );
                ret.m4a = (elem.canPlayType( 'audio/x-m4a;' ) || elem.canPlayType( 'audio/aac;' )).replace( rnos, "" );
            }
            
        } catch ( e ) {}

        return ret;
    },
    
    /**
     *
     * Borrowed(ish)
     * Modernizr v2.7.1
     * www.modernizr.com
     * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
     * Available under the BSD and MIT licenses: www.modernizr.com/license/
     *
     * @memberof MediaBox
     * @method MediaBox._getVideoSupport
     * @returns object
     *
     */
    _getVideoSupport: function () {
        var elem = document.createElement( "video" ),
            rnos = /^no$/,
            ret = {};

        try {
            if ( elem.canPlayType ) {
                ret.mpeg4 = elem.canPlayType( 'video/mp4; codecs="mp4v.20.8"' ).replace( rnos, "" );
                ret.ogg = elem.canPlayType( 'video/ogg; codecs="theora"' ).replace( rnos, "" );
                ret.h264 = elem.canPlayType( 'video/mp4; codecs="avc1.42E01E"' ).replace( rnos, "" );
                ret.webm = elem.canPlayType( 'video/webm; codecs="vp8, vorbis"' ).replace( rnos, "" );
            }

        } catch ( e ) {}

        return ret;
    }
};


// Expose
window.MediaBox = MediaBox;


})( window );