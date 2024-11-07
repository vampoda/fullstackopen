async function createUser() {
    const username = 'exampleUser';
    const password = 'examplePassword';
    const favouriteGenre = 'Fantasy';
  
    const query = `
      mutation {
        createUser(username: "${username}", password: "${password}", favouriteGenre: "${favouriteGenre}") {
          favouriteGenre
        }
      }
    `;
  
    const response = await fetch('http://localhost:4000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
  
    const data = await response.json();
  
    if (response.ok) {
      console.log('User created successfully:', data);
    } else {
      console.error('Error creating user:', data.errors);
    }
  }
  
  // Example usage
  createUser();
  

