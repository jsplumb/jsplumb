module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      all: ['test/**/*.js']
    },
    watch: {
      files: '<%= jshint.files %>',
      tasks: 'default'
    },
    markdown: {
      all: {
        options: {
          gfm: true,
          highlight: 'manual'
        },
        files: [
          {
            expand: true,
            src: 'test/samples/*.md',
            dest: 'test/out/',
            ext: '.html'
          }
        ]
      },
      wrap:{
        options: {
          gfm: true,
          highlight: 'manual',
          codeLines: {
            before: '<span>',
            after: '</span>'
          }
        },
        files: [
          {
            expand: true,
            src: 'test/samples/*.md',
            dest: 'test/out/',
            ext: '.html'
          }
        ]
      }

    },
    jshint: {
      files: ['Gruntfile.js', 'tasks/**/*.js', 'test/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      },
      globals: {}
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint', 'nodeunit']);

};
