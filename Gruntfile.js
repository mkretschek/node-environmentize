module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: true
      },
      all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'dot',
          ui: 'bdd',
          ignoreLeaks: false
        },
        src: ['test/**/*.js']
      }
    }
  });

  // Load the jshint plugin
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Load the mocha runner plugin
  grunt.loadNpmTasks('grunt-mocha-test');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'mochaTest']);

};
