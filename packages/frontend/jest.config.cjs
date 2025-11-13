// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'jest-environment-jsdom',
//   moduleNameMapper: {
//     '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
//   },
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
// };


/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',

  // ✅ Map CSS imports (so Jest doesn't break when seeing .css files)
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // ✅ Run setup file before tests (if you have one)
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // ✅ Enable code coverage
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage', // where reports will be saved

  // ✅ Choose output formats
  coverageReporters: ['text', 'lcov', 'html'],

  // ✅ Optional: make tests fail if coverage drops below threshold
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
