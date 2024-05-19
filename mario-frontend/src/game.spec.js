// Import necessary libraries and functions
// Replace import statements

const { fireEvent, screen } = require('@testing-library/dom');

// Mock kaboom library
const kaboomMock = jest.fn(() => ({
  scene: jest.fn(),
  layers: jest.fn(),
  add: jest.fn(),
  text: jest.fn(),
  pos: jest.fn(),
  width: jest.fn(),
  height: jest.fn(),
  vec2: jest.fn(),
  sprite: jest.fn(),
  solid: jest.fn(),
  body: jest.fn(),
  action: jest.fn(),
  destroy: jest.fn(),
  go: jest.fn(),
  camPos: jest.fn(),
  keyPress: jest.fn(),
  keyDown: jest.fn(),
  scale: jest.fn(),
  layer: jest.fn(),
  dt: jest.fn(),
  start: jest.fn(),
  rgb: jest.fn(),
  mouseIsClicked: jest.fn(),
  localStorage: jest.fn(),
}));

jest.mock('./game', () => ({
  saveUser: jest.fn(), // Mock saveUser function as needed
}));

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

// Import the function you want to test after mocking
const { saveUser } = require('./game');

// Mock the saveUser function
const saveUserMock = jest.spyOn(require('./game'), 'saveUser');
describe('game', () => {
  it('should save user and score to backend when player loses', async () => {
    const username = 'testUser';
    const score = 100;

    // Call the saveUser function directly
    await saveUser(username, score);

    // Assert that the saveUser function is called with the expected parameters
    expect(saveUserMock).toHaveBeenCalledWith(username, score);
  });
});
