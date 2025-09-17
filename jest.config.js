module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.js'],
    collectCoverageFrom: [
        'lib/**/*.js',
        'middleware/**/*.js',
        'models/**/*.js',
        'index.js'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
    testTimeout: 30000,
    verbose: true
};
