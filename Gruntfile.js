/* global module:false */

module.exports = function ( grunt ) {
	
	
	var appjs = require( "app-js-util" )( grunt, {
		jsRoot: "./app",
		jsAppRoot: "./app",
		jsDistRoot: "./app/dist"
	});
	
	
	grunt.initConfig({
		// Project meta.
		meta: {
			version: "0.1.0"
		},
		
		
		// Clean tasks.
		clean: {
			dist: ["dist"]
		},
		
		
		// Concat tasks.
		concat: {
			app: {
				src: [],
				dest: "app/dist/app.js"
			}
		}
	});
	
	
	// Load tasks.
	grunt.loadNpmTasks( "grunt-contrib-clean" );
	grunt.loadNpmTasks( "grunt-contrib-concat" );
	
	
	// Test app-js files.
	grunt.registerTask( "test", function ( module ) {
		var file;
		
		if ( grunt.file.exists( "app/core/app.core."+module+".js" ) ) {
			file = {
				abspath: "app/core/app.core."+module+".js",
				filename: "app.core."+module+".js"
			};
			
		} else if ( grunt.file.exists( "app/util/app.util."+module+".js" ) ) {
			file = {
				abspath: "app/util/app.util."+module+".js",
				filename: "app.util."+module+".js"
			};
			
		} else {
			grunt.fail.fatal( "did not match any file for module "+module );
		}
		
		var deps = appjs.recursiveGetScriptDependencies( [], file ).map(function ( elem ) {
			return appjs.findScriptDependency( elem );
		});
		
		var config = grunt.config.get( "concat" );
		
		config.app.src = deps.concat( [file.abspath] );
		
		grunt.config.set( "concat", config );
		
		grunt.task.run( "concat" );
	});
	
	
};