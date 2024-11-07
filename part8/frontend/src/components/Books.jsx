import { useState } from "react";

const Books = ({ show, books }) => {
  const [filter, setFilter] = useState("all genres");
  
  const genreDuplicateArray = books.map(b => b.genres).flat();
  const genres = [...new Set(genreDuplicateArray)];
  genres.push("all genres");

  console.log("genreArray", genres);

  if (!show) {
    return null;
  }

  const filteredBooks = books.filter(book => 
    filter === "all genres" ? true : book.genres.includes(filter)
  );

  return (
    <div>
      <h1>Books</h1>
      <p>In genre: <strong>{filter}</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {filteredBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => setFilter(g)}>
            {g}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
