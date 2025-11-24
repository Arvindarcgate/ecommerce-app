
// module.exports = {
//     preset: "ts-jest",
//     testEnvironment: "node",
//     testMatch: ["**/__tests__/**/*.test.ts"],
//     verbose: true,
// };


/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    moduleFileExtensions: ['ts', 'js'],
    collectCoverage: true,
    coverageDirectory: '<rootDir>/coverage',
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
};
