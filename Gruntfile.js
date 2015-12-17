
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'lib/jquery/dist/', src: ['jquery.js'], dest: 'board/static/bower/'},
                    {expand: true, cwd: 'lib/jquery-ui/', src: ['jquery-ui.js'], dest: 'board/static/bower'},
                    {expand: true, cwd: 'lib/angular-ui-sortable/', src: ['sortable.js'], dest: 'board/static/bower'},
                    {expand: true, cwd: 'lib/angular/', src: ['angular.js'], dest: 'board/static/bower/'},
                    {expand: true, cwd: 'lib/angular-ckeditor/', src: ['angular-ckeditor.js'], dest: 'board/static/bower/'},
                    {expand: true, cwd: 'lib/angular-ui-router/release/', src: ['angular-ui-router.js'], dest: 'board/static/bower/'},
                    {expand: true, cwd: 'lib/moment/min/', src: ['moment-with-locales.js'], dest: 'board/static/bower/'},

                ]
            }
        },
        'bower-install-simple': {
            options: {
                color: true,
                directory: "lib"
            },
            "prod": {
                options: {
                    production: true
                }
            },
            "dev": {
                options: {
                    production: false
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-bower-install-simple');

    // Default task(s).
    grunt.registerTask('dokku:production', ['bower-install-simple', 'copy:main']);
    grunt.registerTask('default', ['dokku:production']);

};
