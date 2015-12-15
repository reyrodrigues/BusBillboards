module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'bower_components/jquery/dist/', src: ['jquery.js'], dest: 'js/'},
                    {expand: true, cwd: 'bower_components/jquery-ui/', src: ['jquery-ui.js'], dest: 'js'},
                    {expand: true, cwd: 'bower_components/angular-ui-sortable/', src: ['sortable.js'], dest: 'js'},
                    {expand: true, cwd: 'bower_components/angular/', src: ['angular.js'], dest: 'js/'},
                    {expand: true, cwd: 'bower_components/angular-ckeditor/', src: ['angular-ckeditor.js'], dest: 'js/'},
                    {expand: true, cwd: 'bower_components/angular-ui-router/release/', src: ['angular-ui-router.js'], dest: 'js/'},
                    {expand: true, cwd: 'bower_components/moment/min/', src: ['moment-with-locales.js'], dest: 'js/'},
                    {expand: true, cwd: 'bower_components/ckeditor/', src: ['**'], dest: 'js/ckeditor/'},
                ]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['copy:main']);

};
