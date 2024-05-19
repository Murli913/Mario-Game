export function saveUser(username, score) {
    const data = { username, score };
    return fetch('http://localhost:8081/saveUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => response.json());
  }