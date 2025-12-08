// /** @type {import('jest').Config} */
// module.exports = {
//     preset: "ts-jest",
//     testEnvironment: "jsdom", //  ensures document/window exist
//     transform: {
//         "^.+\\.(ts|tsx)$": "ts-jest", //  compile TS and TSX
//     },
//     moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
//     //  mock CSS imports so Jest doesn’t try to parse them
//     moduleNameMapper: {
//         "\\.(css|less|scss|sass)$": "identity-obj-proxy",
//     },
//     setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], //  load jest-dom, etc.
//     transformIgnorePatterns: [
//         "node_modules/(?!(your-esm-package)/)", // optional for ESM deps
//     ],
// };



/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^.+\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  transformIgnorePatterns: [
    "node_modules/(?!.*)",
  ],
};
