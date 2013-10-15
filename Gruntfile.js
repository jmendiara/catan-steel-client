'use strict';

/**
 * Grunt tasks definitions
 *
 * @param {Object} grunt
 */
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkgFile: 'package.json',
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            gruntfile: {
                src: 'Gruntfile.js',
                options: {
                    jshintrc: '.jshintrc'
                }
            },
            lib: {
                src: ['lib/**/*.js'],
                options: {
                    jshintrc: 'lib/.jshintrc'
                }
            },
            test: {
                src: ['test/**/*.js'],
                options: {
                    jshintrc: 'test/.jshintrc'
                }
            },
            reportGruntfile: {
                src: 'Gruntfile.js',
                options: {
                    reporter: 'checkstyle',
                    reporterOutput: 'report/lint/jshint-gruntfile.xml',
                    jshintrc: '.jshintrc'
                }
            },
            reportLib: {
                src: 'lib/**/*.js',
                options: {
                    reporter: 'checkstyle',
                    reporterOutput: 'report/lint/jshint-lib.xml',
                    jshintrc: 'lib/.jshintrc'
                }
            },
            reportTest: {
                src: 'test/**/*.js',
                options: {
                    reporter: 'checkstyle',
                    reporterOutput: 'report/lint/jshint-test.xml',
                    jshintrc: 'test/.jshintrc'
                }
            }
        },

        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib: {
                files: '<%= jshint.lib.src %>',
                tasks: ['jshint:lib', 'test']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'test']
            }
        },

        mochaTest: {
            unit: {
                options: {
                    ui: 'bdd',
                    reporter: 'spec'
                },
                src: [
                    'tools/mocha-globals.js',
                    'test/unit/**/*.js'
                ]
            },
            unitReport: {
                options: {
                    ui: 'bdd',
                    reporter: 'tap',
                    quiet: true,
                    captureFile: 'report/test/unit_tests.tap'
                },
                src: [
                    'tools/mocha-globals.js',
                    'test/unit/**/*.js'
                ]
            }
        },

        githubPages: {
            target: {
                options: {
                    commitMessage: 'UPDATE Doc'
                },
                src: 'site'
            }
        },

        exec: {
            istanbul: {
                cmd: 'bash -c "rm -Rf report/coverage ; mkdir -p report/coverage ; ' +
                    './node_modules/.bin/istanbul cover --root lib/ --dir site/coverage -- grunt test && ' +
                    './node_modules/.bin/istanbul report --dir site/coverage cobertura && ' +
                    'mv site/coverage/cobertura-coverage.xml report/coverage"'
            },
            doxfoundation: {
                cmd: 'bash -c "rm -Rf site/doc ; ./node_modules/.bin/dox-foundation --source lib --target site/doc"'
            },
            githubPagesInit: {
                cmd: 'bash tools/github-pages.sh'
            },
            reportLintClean: {
                cmd: 'bash -c "rm -Rf report/lint ; mkdir -p report/lint"'
            },
            reportTestClean: {
                cmd: 'bash -c "rm -Rf report/test ; mkdir -p report/test"'
            }
        },

        plato: {
            options: {
                jshint: grunt.file.readJSON('.jshintrc')
            },
            lib: {
                files: {
                    'site/report': '<%= jshint.lib.src %>'
                }
            }
        },

        gjslint: {
            options: {
                reporter: {
                    name: 'console'
                },
                flags: [
                    '--flagfile .gjslintrc' //use flag file'
                ],
                force: false
            },
            gruntfile: {
                src: '<%= jshint.gruntfile.src %>'
            },
            lib: {
                src: '<%= jshint.lib.src %>'
            },
            test: {
                src: '<%= jshint.test.src %>'
            },
            report: {
                options: {
                    reporter: {
                        name: 'gjslint_xml',
                        dest: 'report/lint/gjslint.xml'
                    },
                    flags: [
                        '--flagfile .gjslintrc'
                    ],
                    force: false
                },
                src: ['<%= jshint.gruntfile.src %>', '<%= jshint.lib.src %>', '<%= jshint.test.src %>']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-github-pages');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-plato');
    grunt.loadNpmTasks('grunt-gjslint');

    grunt.loadTasks('tools/tasks');

    grunt.registerTask('init-pages', ['exec:githubPagesInit']);

    grunt.registerTask('init-dev-env', 'Initialize your environment with git hooks', ['hook:pre-commit']);

    grunt.registerTask('test', 'Run tests', ['mochaTest:unit']);

    grunt.registerTask('test-report', 'Generate tests reports in "report/test/"',
        ['exec:reportTestClean', 'mochaTest:unitReport']);

    grunt.registerTask('coverage', 'Generate code coverage reports in "report/coverage/" and "site/coverage/"',
        ['exec:istanbul']);

    grunt.registerTask('complexity', 'Generate code complexity reports in "site/report/"', ['plato']);

    grunt.registerTask('doc', 'Generate source code JSDoc in "site/doc/"', ['exec:doxfoundation']);

    grunt.registerTask('lint-jshint', 'Check source code style with JsHint',
        ['jshint:gruntfile', 'jshint:lib', 'jshint:test']);

    grunt.registerTask('lint-gjslint', 'Check source code style with Google Closure Linter',
        ['gjslint:gruntfile', 'gjslint:lib', 'gjslint:test']);

    grunt.registerTask('lint', 'Check source code style', ['lint-jshint', 'lint-gjslint']);

    grunt.registerTask('lint-report', 'Generate checkstyle reports in "report/lint/"',
        ['exec:reportLintClean', 'jshint:reportGruntfile', 'jshint:reportLib', 'jshint:reportTest', 'gjslint:report']);

    grunt.registerTask('site', ['doc', 'coverage', 'complexity', 'githubPages']);

    // Default task.
    grunt.registerTask('default', ['lint-jshint', 'test']);

};
