module.exports = {
  testEnvironment: 'node', 
  collectCoverage: true, 
  collectCoverageFrom: [
    'server/**/*.js', 
    '!server/__test__/**', 
    '!server/seeders/**', 
    '!server/migrations/**', 
  ],
  coverageDirectory: 'coverage', 
  coverageReporters: ['text', 'lcov'], 
};