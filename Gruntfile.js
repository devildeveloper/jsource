/*!
 *
 * JSource config.
 *
 */
module.exports = function ( grunt ) {
    
    
    var _ = grunt.util._;
    
    
    // Project configuration.
    grunt.initConfig({
        // Project meta.
        meta: {
            version: "0.1.0"
        },
        
        
        // Project banner.
        banner:
            "/*!\n"+
            " * \n"+
            " * \n"+
            " * JSource - v<%= meta.version %> - <%= grunt.template.today('yyyy-mm-dd') %>\n"+
            " * Copyright (c) Brandon Lee Kitajchuk <%= grunt.template.today('yyyy') %>\n"+
            " * Licensed MIT\n"+
            " * \n"+
            " * \n"+
            " */\n"+
            "\n",
        
        
        // Concat config.
        concat: {
            jsource: {
                src: ["src/**/*.js"],
                dest: "dist/jsource.js"
            }
        },
        
        
        // Uglify config.
        uglify: {
            jsource: {
                src: ["src/**/*.js"],
                dest: "dist/jsource.min.js"
            }
        },
        
        
        // Clean config.
        clean: [
            "dist"
        ],
        
        
        // Watch config.
        watch: {
            jsource: {
                files: ["src/**/*.js"],
                tasks: ["buildAll"]
            }
        },
        
        
    });
    
    
    // Load the plugins.
    grunt.loadNpmTasks( "grunt-contrib-jshint" );
    grunt.loadNpmTasks( "grunt-contrib-concat" );
    grunt.loadNpmTasks( "grunt-contrib-uglify" );
    grunt.loadNpmTasks( "grunt-contrib-watch" );
    grunt.loadNpmTasks( "grunt-contrib-clean" );
    
    
    // Register default task.
    grunt.registerTask( "default", ["concat:jsource", "uglify:jsource"] );
    
    
    // Register build task.
    grunt.registerTask( "build", function ( script ) {
        var file = "src/" + script + ".js",
            src = [],
            dist = "dist/" + script + ".js",
            dest = "dist/" + script + ".min.js",
            concats = grunt.config.get( "concat" ),
            uglifys = grunt.config.get( "uglify" ),
            rRequires = /@require:(.*?)\n/g,
            rReplaces = /@require|:|\s|\n|\r/g;
        
        if ( script && grunt.file.isFile( file ) ) {
            var contents = grunt.file.read( file );
            var requires = contents.match( rRequires );
            
            _.each( requires, function ( el, i, list ) {
                el = el.replace( rReplaces, "" );
                
                src.push( "src/" + el + ".js" );
            });
            
            src.push( file );
            
            concats[ script ] = {
                src: src,
                dest: dist
            };
            
            uglifys[ script ] = {
                src: src,
                dest: dest
            };
            
            grunt.config.set( "concat", concats );
            grunt.config.set( "uglify", uglifys );
            
            grunt.task.run( "concat:" + script );
            grunt.task.run( "uglify:" + script );
            
        } else {
            grunt.task.run( "default" );
        }
    });
    
    
    // Register buildAll task.
    grunt.registerTask( "buildAll", function ( script ) {
        // First clean dist
        grunt.task.run( "clean" );
        
        // Walk src to build dist
        grunt.file.recurse( "src", function ( abspath, rootdir, subdir, filename ) {
            var script = filename.replace( /\.js$/, "" );
            
            grunt.task.run( "build:" + script );
        });
        
        // Build compilation
        grunt.task.run( "default" );
    });
    
    
};