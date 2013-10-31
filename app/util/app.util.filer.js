/*!
 *
 * App Util: app.util.filer
 *
 * A file notification utility. Not really helpfull yet...
 *
 *
 * @dependency: app.core.Class
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
	
	Filer = app.core.Class.extend({
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