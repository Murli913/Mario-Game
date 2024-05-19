module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Change test environment to jsdom
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};
