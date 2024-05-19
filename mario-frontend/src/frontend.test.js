// Import the function you want to test
import { saveUser } from './game.js'; // Adjust the path as per your file structure

// Mock the fetch function since you don't want to make actual HTTP requests during tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ status: 'success' }), // Mocked response
  })
);

describe('saveUser', () => {
  test('saves user with given username and score', async () => {
    const username = 'testUser';
    const score = 100;
    const savedUser = await saveUser(username, score);
    expect(savedUser.status).toEqual('success');
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8081/saveUser',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, score }),
      })
    );
  });
});
