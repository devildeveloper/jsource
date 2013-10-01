/*!
 *
 * App: Base
 *
 * Creates global {app}
 *
 *
 */
(function ( window, undefined ) {


"use strict";


// Our global, extendable app {Object}
var app = {},
	
	// Keep track of feature modules
	features = [],
	
	// Keep track of executed modules
	executed = [];


/******************************************************************************
 * App core namespace
*******************************************************************************/
app.core = {};


/******************************************************************************
 * App utility namespace
*******************************************************************************/
app.util = {};


/******************************************************************************
 * App support namespace
*******************************************************************************/
app.support = {};


/******************************************************************************
 * App extend method
*******************************************************************************/
app.core.extend = function ( o1, o2 ) {
	var prop,
		ret;
	
	// Absence of o2 defines this
	// as a feature module
	if ( !o2 ) {
		for ( prop in o1 ) {
			app[ prop ] = o1[ prop ];
			
			// Push all found props as a feature
			// but you should just do one
			// module namespace per feature script
			features.push( prop );
		}
		
		ret = app;
		
	} else {
		for ( prop in o2 ) {
			o1[ prop ] = o2[ prop ];
		}
		
		ret = o1;
	}
	
	return ret;
};


/******************************************************************************
 * App exec method
*******************************************************************************/
app.core.exec = function ( module ) {
	var moduleName = module;
	
	if ( app[ module ] ) {
		module = app[ module ];
		
	} else if ( app.core[ module ] ) {
		module = app.core[ module ];
		
	} else if ( app.util[ module ] ) {
		module = app.util[ module ];
		
	} else {
		module = undefined;
	}
	
	if ( executed.indexOf( moduleName ) !== -1 ) {
			app.util.log( "Feature module "+moduleName+" already executed! Backing out..." );
			
	} else if ( module && typeof module.init === "function" ) {
		module.init();
		
		executed.push( moduleName );
	}
	
	return module;
};


/******************************************************************************
 * App execFeatures method
*******************************************************************************/
app.core.execFeatures = function () {
	for ( var i = features.length; i--; ) {
		var module = features[ i ];
		
		if ( executed.indexOf( module ) !== -1 ) {
			app.util.log( "Feature module "+module+" already executed! Backing out..." );
			
		} else if ( app[ module ] && typeof app[ module ].init === "function" ) {
			app[ module ].init();
			
			executed.push( module );
		}
	}
};


/******************************************************************************
 * Expose global app {Object}
*******************************************************************************/
window.app = app;


})( window );