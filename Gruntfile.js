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
            version: "1.0.0"
        },
        
        
        // Concat config.
        concat: {
            jsource: {
                src: ["banner.js", "src/**/*.js"],
                dest: "dist/jsource.js"
            }
        },
        
        
        // Uglify config.
        uglify: {
            jsource: {
                src: ["banner.js", "src/**/*.js"],
                dest: "dist/jsource.min.js"
            }
        },
        
        
        // Jshint config.
        jshint: {
            jsource: {
                src: ["src/**/*.js"]
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
                tasks: ["default"]
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
    grunt.registerTask( "default", ["buildAll", "jshint:jsource", "concat:jsource", "uglify:jsource"] );
    
    
    // Register build task.
    grunt.registerTask( "build", function ( script ) {
        var file = "src/" + script + ".js",
            src = [],
            dist = "dist/" + script + ".js",
            dest = "dist/" + script + ".min.js",
            concats = grunt.config.get( "concat" ),
            uglifys = grunt.config.get( "uglify" ),
            rRequires = /@requires\s(.*?)\n/g,
            rReplaces = /@requires|\s|\n|\r/g;
        
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
    });
    
    // Register jsdoc task.
    grunt.registerTask( "jsdoc", function () {
        var spawn = require( "child_process" ).spawn,
            child = spawn( "node_modules/jsdoc/jsdoc", ["-r", "src", "-d", "docs"] );
    });
    
    
};