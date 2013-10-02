/*!
 *
 * App Util: util.konami
 *
 * Konami code easter egg.
 * Does cool stuff if you hook into it!
 *
 * 
 * @dependency: app.util.log
 *
 *
 */
(function ( window, app, undefined ) {


"use strict";


var document = window.document;


/******************************************************************************
 * App Extensions
*******************************************************************************/
app.util = app.core.extend( app.util, {
	konami: {
		A: 65,
		B: 66,
		UP: 38,
		DOWN: 40,
		LEFT: 37,
		RIGHT: 39,
		
		callbacks: [],
		
		documentBound: false,
		
		listen: function ( callback ) {
			if ( typeof callback === "function" ) {
				this.callbacks.push( callback );
			}
		},
		
		dispatch: function () {
			for ( var i = 0, len = this.callbacks.length; i < len; i++ ) {
				this.callbacks[ i ].call();
			}
		}
	}
});


/******************************************************************************
 * Initialize
*******************************************************************************/
(function konaminit( konami ) {
	if ( konami.documentBound ) {
		return false;
	}
	
	var code2Match = [
			konami.UP,
			konami.UP,
			konami.DOWN,
			konami.DOWN,
			konami.LEFT,
			konami.RIGHT,
			konami.LEFT,
			konami.RIGHT,
			konami.B,
			konami.A
		].join( "" ),
		codeDelay = 500,
		codeString = "",
		codeTimeout;
	
	document.addEventListener( "keydown", function ( e ) {
		try {
			clearTimeout( codeTimeout );
			
		} catch ( error ) {}
		
		codeString = ""+(codeString+e.keyCode);
		
		if ( codeString === code2Match ) {
			konami.dispatch( "app.konami.code" );
			
			app.util.log( "Konami code entered!" );
		}
		
		codeTimeout = setTimeout(function () {
			clearTimeout( codeTimeout );
			
			codeString = "";
						
		}, codeDelay );
		
	}, false );
	
	konami.documentBound = true;
})( app.util.konami );


})( window, window.app );