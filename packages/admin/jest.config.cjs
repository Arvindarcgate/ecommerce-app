/** @type {import('jest').Config} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom", // ✅ ensures document/window exist
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest", // ✅ compile TS and TSX
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    // ✅ mock CSS imports so Jest doesn’t try to parse them
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // ✅ load jest-dom, etc.
    transformIgnorePatterns: [
        "node_modules/(?!(your-esm-package)/)", // optional for ESM deps
    ],
};
