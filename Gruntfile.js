
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
        printerCSS: "printer.css",
        printerJSMin: "printer.min.js",
        printerCSSMin: "printer.min.css"
      },
      test: {
        root: "test/",
        specs: "test/specs/"
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
      },
      watchify: {
        options:{
          extension: [ '.js' ],
          debug: true,
          watch: true
        },
        files: {
          '<%= paths.test.root %>browserified_tests.js': ['<%= paths.test.root %>suite.js'],
          '<%= paths.dist.root %><%= paths.dist.printerJS %>': ['<%= paths.printer.js %>index.js']
        },
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
          src: ["<%= paths.printer.root %>**/*.js", "<%= paths.test.specs %>**/*.js"]
        },
        options: {
          jshintrc: '.jshintrc'
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
      },
      servertest: {
        options: {
          base: '',
          open: false
        }
      }
    },

    watch: {
      options: {
        livereload: '<%= connect.options.livereload %>'
      },
      all: {
        files: [
          "<%= paths.printer.root %>**/*",
          "<%= paths.test.root %>browserified_tests.js"
        ],
        tasks: ['default']
      },
      tests: {
        files: [
          "<%= paths.printer.root %>**/*",
          "<%= paths.test.root %>browserified_tests.js"
        ],
        tasks: ['jshint', 'mocha_phantomjs']
      }
    },

    // EXPORT TASKS

    uglify: {
      all: {
        files: {
          '<%= paths.dist.root %><%= paths.dist.printerJSMin %>':
            [ '<%= paths.dist.root %><%= paths.dist.printerJS %>' ]
        }
      }
    },

    cssmin: {
      all: {
        files: {
          "<%= paths.dist.root %><%= paths.dist.printerCSSMin %>":
            ["<%= paths.dist.root %><%= paths.dist.printerCSS %>"],
        }
      }
    },

    mocha_phantomjs: {
      all: {
        options: {
          'reporter': 'spec',
          urls: ["http://localhost:3000/test/index.html"]
        }
      }
    }

  });

  // server
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');

  // compile
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // dist
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  var build = [
    "clean",
    "jshint:all",
    "browserify:printer",
    "copy"
  ];

  var test = [
    "browserify:watchify",
    "connect:servertest",
    "mocha_phantomjs",
    "watch:tests"
  ];

  var dist = [
    "uglify",
    "cssmin"
  ];

  grunt.registerTask("default", build);
  grunt.registerTask("dist", build.concat(dist));
  grunt.registerTask("server", build.concat(['connect:server', 'watch:all']));
  grunt.registerTask("test", build.concat(test));

};
