var mozjpeg = require('imagemin-mozjpeg');
var imageminOptipng = require('imagemin-optipng');
var imageminGifsicle = require('imagemin-gifsicle');

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
        
        // MINIFY IMAGES
        imagemin: {
            dynamic: {
              options: {
                    optimizationLevel: 2,
                    svgoPlugins: [{ removeViewBox: false }],
                    use: [mozjpeg(), imageminOptipng(), imageminGifsicle()],
                    progressive: true,
                    cache: false
              },
              files: [{
                  expand: true,
                  cwd: 'app/img/',
                  src: ['**/*.{png,PNG,jpg,JPG,gif,GIF}', '!dist/**'],
                  dest: 'dist/img/'
                }]
            }
        },
        
        // SASS COMPILER
        sass: {                              // Task
            dist: {                            // Target
                files: {                         // Dictionary of files
                    'app/css/styles.css': 'app/sass/styles.sass',       // 'destination': 'source'
                }
            }
        },
        
        // MINIFY CSS
        cssmin: {
          minify: {
              src: 'app/css/styles.css',
              dest: 'dist/css/minified/styles.min.css'
          }  
        },

        // UPDATE BROWSER
        browserSync: {
          dev: {
              bsFiles: {
                  src: [
                      'dist/css/minified/style.min.css', 'dist/**/*.html'
                  ]
              },
              options: {
                  watchTask: true,
                  server: 'dist'
              }
          }  
        },
        // COPY FILES
        copy: {
            files: {
                cwd: 'app/',        
                src: '**/*.html',           
                dest: 'dist',   
                expand: true      
            }
        },
        
        // WATCH FOR CHANGES
        watch: {
            css: {
                files: 'app/sass/**/*.sass',
                tasks: ['sass', 'cssmin']
            },
            image: {
                files: 'app/img/*.{png, PNG, jpg, JPG, gif, GIF}',
                tasks: ['imagemin']
            },
            html: {
                files: 'app/**/*.html',
                tasks: ['copy']
            }
        }
	});
    
    grunt.loadNpmTasks('grunt-contrib-sass');       // The Sass should be converted to CSS.
    grunt.loadNpmTasks('grunt-contrib-watch');      // Watch for file changes.
    grunt.loadNpmTasks('grunt-contrib-cssmin');     // CSS file should be minified.
    grunt.loadNpmTasks('grunt-browser-sync');       // Browser to reload on any file change.
    grunt.loadNpmTasks('grunt-imagemin');           // Minify images.
    grunt.loadNpmTasks('grunt-contrib-copy');       // Copy files
    grunt.loadNpmTasks('grunt-contrib-imagemin');   // Minify Images
    
    // RUN ON "GRUNT" COMMAND
    grunt.registerTask('default',['imagemin','browserSync','watch']);
}