console.log('userLogin.js loaded');

// Update this line with your local API endpoint
const API_URL = 'http://localhost:8000/api/v1/dj-rest-auth/login/';

export const userLogin = async (username, password) => {
  console.log('userLogin function called with:', { username, password });
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('Login success data:', data);
  return data;
};

console.log('userLogin function:', userLogin);