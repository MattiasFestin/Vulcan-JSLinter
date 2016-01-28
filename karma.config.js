'use strict';

module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        plugins: [
            require('karma-jasmine'),

            require('karma-chrome-launcher'),
            require('karma-firefox-launcher'),
            require('karma-ie-launcher'),
            require('karma-phantomjs-launcher'),

            require('karma-coverage')
        ],

        browsers : ['Chrome', 'Firefox', 'IE', 'PhantomJS'],

        files: [
            'test/specs/**/*.js'
        ],

        basePath: '',
        reporters: ['progress', 'coverage'],
        preprocessors: { '*.js': ['coverage'] },

        singleRun: true,

        coverageReporter: {
            dir : 'coverage/',
            reporters: [
                { type: 'html', subdir: 'html' },
                { type: 'lcovonly', subdir: 'lcov' },
                { type: 'cobertura', subdir: 'cobertura' }
            ]
        },
    });
};
