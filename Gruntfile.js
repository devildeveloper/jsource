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
            dist: ["app/dist"]
        },
        
        
        // Concat tasks.
        concat: {
            app: {
                src: [],
                dest: "app/dist/app.js"
            },
            
            all: {
                src: [
                    appjs.getCoreModelScriptPath(),
                    "app/lib/**/*.js",
                    "app/core/**/*.js",
                    "app/util/**/*.js"
                ],
                dest: "app.js"
            }
        }
    });
    
    
    // Load tasks.
    grunt.loadNpmTasks( "grunt-contrib-clean" );
    grunt.loadNpmTasks( "grunt-contrib-concat" );
    
    
    // Test app-js files.
    grunt.registerTask( "test", function ( module ) {
        var config = grunt.config.get( "concat" ),
            scripts,
            file,
            merge;
        
        if ( grunt.file.exists( "app/core/app.core."+module+".js" ) ) {
            file = {
                module: module,
                abspath: "app/core/app.core."+module+".js",
                filename: "app.core."+module+".js"
            };
            
        } else if ( grunt.file.exists( "app/util/app.util."+module+".js" ) ) {
            file = {
                module: module,
                abspath: "app/util/app.util."+module+".js",
                filename: "app.util."+module+".js"
            };
        
        // Build all modules in priority order core, util...    
        } else {
            grunt.task.run( "concat:all" );
            
            return;
        }
        
        scripts = appjs.recursiveGetScripts( [], file ).concat( [ file.abspath ] );
        
        config.app.src = [ appjs.getCoreModelScriptPath() ].concat( ["app/lib/**/*.js"] ).concat( scripts );
        
        grunt.config.set( "concat", config );
        
        grunt.task.run( "concat:app" );
    });
    
    
};