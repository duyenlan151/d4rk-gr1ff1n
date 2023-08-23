module.exports = {
  // roots: ['./src'],
  clearMocks: true,

  preset: "ts-jest",
  testEnvironment: "jsdom",
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
  ],

  setupFilesAfterEnv: ["<rootDir>/__test__/setup-tests.ts"],

  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleDirectories: ["node_modules", "./src"],
  moduleNameMapper: {
    "^~(.*)$": "<rootDir>/src/$1"
  },

  testMatch: [
    "<rootDir>/**/*.{spec,test}.{js,jsx,ts,tsx}"
  ],
  // testRegex: '(/__tests__/jest/.*|(\\.|/)(test|spec))\\.(ts|tsx)$',
};