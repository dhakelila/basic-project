module.exports = function(grunt) {

  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({

    root: {
      app: 'app',
      dist: 'dist',
      tmp: '.tmp'
    },

    connect: {
      options: {
        port: 8000,
        hostname: 'localhost'
      },
      server: {
        options: {
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static('app')
            ];
          }
        }
      }
    },

    clean: {
      dist: [
        '<%= root.tmp %>',
        '<%= root.dist %>'
      ],
      server: '<%= root.tmp %>'
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= root.app %>',
          dest: '<%= root.dist %>',
          src: [
            '*.{ico,png,txt,xml}',
            '{,*/}*.html',
            'CNAME',
            'fonts/*.*'
          ]
        }]
      }
    },

    bower: {
      install: {
        options: {
          copy: false
        }
      }
    },

    sass: {
      options: {
        style: 'expanded'
      },
      app: {
        files: {
          '<%= root.tmp %>/styles/main.css': '<%= root.app %>/styles/main.scss'
        }
      }
    },

    scsslint: {
      allFiles: [
        '<%= root.app %>/styles/{,*/}*{,*/}*.scss'
      ],
      options: {
        bundleExec: false,
        config: '.scss-lint.yml',
        colorizeOutput: true
      },
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'ie 9']
      },
      build: {
        src: '<%= root.tmp %>/styles/main.css',
        dest: '<%= root.tmp %>/styles/main.css'
      },
    },

    cssmin: {
      dist: {
        files: {
          '<%= root.dist %>/styles/main.css': [
            './bower_components/normalize-css/normalize.css',
            './bower_components/selectize/dist/css/selectize.css',
            '<%= root.tmp %>/styles/{,*/}*.css'
          ]
        }
      }
    },

    grunticon: {
      myIcons: {
        files: [{
          expand: true,
          cwd: '<%= root.app %>/images/icons',
          src: ['*.svg', '*.png'],
          dest: '<%= root.app %>/images/icons-output'
        }],
        options: {
          enhanceSVG: true,
          loadersnipper: 'grunticon.loader.js',
          defaultWidth:'30px',
          defaultHeight: '30px'
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= root.app %>/scripts/{,*/}{,*/}*.js',
        '<%= root.test %>/specs/{,*/}{,*/}*.js',
        '<%= root.test %>/runner.js'
      ]
    },

    requirejs: {
      options: {
        baseUrl: '<%= root.app %>/scripts',
        mainConfigFile: '<%= root.app %>/scripts/config.js',
        name: '../../bower_components/almond/almond',
      },
      compile: {
        options: {
          out: '<%= root.dist %>/scripts/main.js',
          include: 'main'
        }
      },
    },

    useminPrepare: {
      options: {
        dest: '<%= root.dist %>',
        flow: {
          html: {
            steps: { js: [], css: [] },
            post: {}
          }
        }
      },
      html: '<%= root.app %>/index.html'
    },

    usemin: {
      options: {
        assetsDirs: ['<%= root.dist %>', '<%= root.dist %>/images']
      },
      html: ['<%= root.dist %>/{,*/}*.html'],
      css: ['<%= root.dist %>/styles/{,*/}*.css']
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%= root.dist %>',
          src: '{,*/}*.html',
          dest: '<%= root.dist %>'
        }]
      }
    },

    watch: {
      styles: {
        files: [
          '<%= root.app %>/styles/{,*/}{,*/}*.scss'
        ],
        tasks: [
          'sass',
          'grunticon',
          'autoprefixer',
          'scsslint'
        ]
      },
      scripts: {
        options: {
          livereload: true
        },
        files: '<%= jshint.all %>',
        tasks: ['jshint']
      }
    },

    'gh-pages': {
      options: {
        base: 'dist'
      },
      src: ['**']
    },

    concurrent: {
      server: [
        'sass',
        'grunticon'
      ]
    }

  });

  grunt.registerTask('server', [
    'clean:server',
    'bower',
    'concurrent:server',
    'connect:server',
    'watch',
    'sass',
    'grunticon'
  ]);

  grunt.registerTask('test', [
    'jshint'
  ]);

  grunt.registerTask('default', [
    'server',
    'sass',
    'grunticon'
  ]);

  grunt.registerTask('build', [
    'test',
    'clean:dist',
    'bower',
    'useminPrepare',
    'copy:dist',
    'sass',
    'grunticon',
    'requirejs',
    'cssmin',
    'autoprefixer',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'gh-pages'
  ]);

};