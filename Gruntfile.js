'use strict';

module.exports = function(grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin'
    });

    // Define the configuration for all the tasks
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Make sure code styles are up to par and there are no obious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    'public/src/scripts/app.js',
                    'public/src/scripts/controllers/{,*/}*.js',
                    'public/src/scripts/services/{,*/}*.js',
                    'public/src/scripts/js/{,*/}*.js'
                ]
            }
        },
        useminPrepare: {
            html: 'public/src/index.html',
            options: {
                dest: 'public/dist'
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            // dist configuration is provided by useminPrepare
            dist: {}
        },
        uglify: {
            // dist configuration is provided by useminPrepare
            dist: {}
        },
        cssmin: {
            // dist configuration is provided by useminPrepare
            dist: {}
        },
        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 20
            },
            release: {
                // filerev:release hashes(md5) all assets (images, js and css) in dist directory
                files: [{
                    src: [
                        'public/dist/scripts/*.js',
                        'public/dist/styles/*.css',
                    ]
                }]
            }
        },
        // usemin replaces all assets with their revved version in html and css files.
        // options.assetDirs contains the directories for finding the assets according to their relative paths
        usemin: {
            html: ['public/dist/*.html'],
            css: ['public/dist/styles/*.css'],
            options: {
                assetsDirs: ['public/dist', 'public/dist/styles']
            }
        },
        copy: {
            dist: {
                files: [{
                    cwd: 'public/src',
                    src: ['*.*', '!bower.json'],
                    dest: 'public/dist',
                    expand: true
                }, {
                    cwd: 'public/src/img',
                    src: ['{,*/}*.{png,jpg,jpeg,gif,webp,svg}'],
                    dest: 'public/dist/img',
                    expand: true
                }, {
                    cwd: 'public/src/templates',
                    src: ['**'],
                    dest: 'public/dist/templates',
                    expand: true
                }]
            },
            fonts: {
                files: [{
                        // for bootstrap fonts
                        expand: true,
                        dot: true,
                        cwd: 'public/src/bower_components/bootstrap/dist/',
                        src: ['fonts/*.*'],
                        dest: 'public/dist'
                    },
                    {
                        // for font-awesome fonts
                        expand: true,
                        dot: true,
                        cwd: 'public/src/bower_components/font-awesome/',
                        src: ['fonts/*.*'],
                        dest: 'public/dist'
                    }
                ]
            }
        },
        watch: {
            copy: {
                files: ['public/src/**', '!public/src/**/*.css', '!public/src/**/*.js'],
                tasks: ['build']
            },
            scripts: {
                files: ['public/src/scripts/*.js'],
                tasks: ['build']
            },
            styles: {
                files: ['public/src/styles/*.css'],
                tasks: ['build']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    'public/src/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    'public/src/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            dist: {
                options: {
                    open: true,
                    base: {
                        path: 'public/dist',
                        options: {
                            index: 'index.html',
                            maxAge: 300000
                        }
                    }
                }
            }
        },
        clean: {
            build: {
                src: ['public/dist/']
            }
        }
    });

    grunt.registerTask('build', [
        'clean',
        'jshint',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'copy',
        'filerev',
        'usemin'
    ]);

    grunt.registerTask('serve', ['build', 'connect:dist', 'watch']);

    grunt.registerTask('default', ['build']);


};