module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options : {
        jshintrc: true
      },
      all : ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
    }
  });

  // Load the jshint plugin
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['jshint']);

};
