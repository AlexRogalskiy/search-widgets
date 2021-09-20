module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/jest/jest-preprocess.js',
  },
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules', 'src'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [],
};
