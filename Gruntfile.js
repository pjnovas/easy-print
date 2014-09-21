
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    paths: {
      printer: {
        root: "src/",
        js: "src/js/",
        css: "src/css/printer.css"
      },
      dist: {
        root: "dist/",
        printerJS: "printer.js",
        printerCSS: "printer.css"
      }
    },

    clean: {
      before: {
        src: [
          "<%= paths.dist.root %>*"
        ],
      } 
    },

    browserify: {
      printer: {
        options:{
          extension: [ '.js' ]
        },
        src: ['<%= paths.printer.js %>index.js'],
        dest: '<%= paths.dist.root %><%= paths.dist.printerJS %>'
      }
    },

    copy: {
      css: {
        cwd: "./", 
        files: {
          "<%= paths.dist.root %><%= paths.dist.printerCSS %>": "<%= paths.printer.css %>",
        }
      }
    },

    jshint: {
      all: {
        files: {
          src: ["<%= paths.printer.root %>**/*.js"]
        },
        options: {
          bitwise: true
          ,curly: true
          ,eqeqeq: true
          ,immed: true
          ,latedef: true
          ,newcap: true
          ,noempty: true
          ,nonew: true
          ,undef: true
          ,unused: true
          ,laxcomma: true
          ,quotmark: false
          ,loopfunc: false
          ,forin: false

          ,globals: {
            window: true
            ,document: true
            ,console: true
            ,module: true
            ,require: true
            ,printer: true
          }
        }

      }
    },

    connect: {
      options: {
        hostname: 'localhost',
        livereload: 35729,
        port: 3000
      },
      server: {
        options: {
          base: '',
          open: {
            target: 'http://localhost:3000/examples/index.html',
          }
        }
      }
    },

    watch: {
      options: {
        livereload: '<%= connect.options.livereload %>'
      },
      all: {
        files: ["<%= paths.printer.root %>**/*"],
        tasks: ['default']
      }
    },

    // EXPORT TASKS

    uglify: {
      all: {
        files: {
          '<%= paths.dist.root %><%= paths.dist.printerJS %>': 
            [ '<%= paths.dist.root %><%= paths.dist.printerJS %>' ]
        }
      }
    },

    cssmin: {
      all: {
        files: {
          "<%= paths.dist.root %><%= paths.dist.printerCSS %>": 
            ["<%= paths.dist.root %><%= paths.dist.printerCSS %>"],
        }
      }
    }

  });

  // server
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // compile
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // export
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  
  var build = [
    "clean", 
    "jshint:all", 
    "browserify", 
    "copy"
  ];

  var dist = [
    "uglify", 
    "cssmin"
  ];

  grunt.registerTask("default", build);
  grunt.registerTask("export", build.concat(dist));
  
  return grunt.registerTask('server', function() {
    grunt.task.run(build);
    grunt.task.run('connect:server');
    return grunt.task.run('watch:all');
  });
  
};
