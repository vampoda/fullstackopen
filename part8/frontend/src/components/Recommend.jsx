import React from 'react';

const Recommend = ({ show, user, books }) => {
  const favouriteGenre = user ? user.favouriteGenre : null;

  if (!show) {
    return null;
  }

  // Filter books based on the favorite genre
  const filteredBooks = favouriteGenre
    ? books.filter(book => book.genres.includes(favouriteGenre))
    : [];

  return (
    <div>
      <h2>Recommendations</h2>
      <p>Books in your favouritegenre: {favouriteGenre || 'N/A'}</p>
      
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No books found in this genre.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Recommend;
