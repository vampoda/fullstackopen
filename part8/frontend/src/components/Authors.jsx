import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../query";

const Authors = ({ show, authors, setError }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // local state for error message

  const [changeAuthor, { loading, error, data }] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onCompleted: (data) => {
      if (data.editAuthor === null) {
        setErrorMessage("Author not found.");
      } else {
        setName("");
        setBorn("");
        setErrorMessage(""); // Clear any existing error on success
      }
    },
    onError: (error) => {
      setErrorMessage(error.message); // Update the local error state on mutation error
    },
  });

  const submit = (event) => {
    event.preventDefault();

    // Validation
    if (!name || !born) {
      setErrorMessage("Both name and born fields are required.");
      return;
    }

    // Execute mutation
    changeAuthor({ variables: { name, born } });
  };

  useEffect(() => {
    if (data && data.editAuthor === null) {
      setErrorMessage("Author not found.");
    }
  }, [data]);

  if (!show) {
    return null;
  }

  return (
    <div>
      <h1>Authors</h1>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>} {/* Show error message if exists */}
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Born</th>
            <th>Books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={submit}>
        <label>
          Select author to update library
          <br />
          <select
            value={name}
            onChange={({ target }) => setName(target.value)}
            disabled={loading}
          >
            <option value="" disabled>
              Select an author
            </option>
            {authors.map((a) => (
              <option value={a.name} key={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
        <div>
          Born
          <input
            type="number" // Ensure the year is numeric
            value={born}
            onChange={({ target }) => setBorn(target.value)}
            placeholder="Year of birth"
            disabled={loading} // Disable input while loading
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Author"}
        </button>
      </form>
    </div>
  );
};

export default Authors;
