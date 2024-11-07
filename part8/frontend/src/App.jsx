import { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import { useQuery, useApolloClient, useSubscription } from '@apollo/client';
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED, USER } from './query';
import Notify from './components/Notify';
import LoginForm from './components/LoginForm';
import Recommend from './components/Recommend';
import './App.css';

export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.title;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook)),
    };
  });
};

function App() {
  const [page, setPage] = useState('authors');
  const { loading: loadingAuthors, error: authorsError, data: authorsData } = useQuery(ALL_AUTHORS);
  const { loading: loadingBooks, error: booksError, data: booksData } = useQuery(ALL_BOOKS);
  const { loading: loadingUser, error: userError, data: userData } = useQuery(USER);
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      try {
        window.alert(`${addedBook.title} added`);
        updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 1000);
  };

  if (loadingAuthors || loadingBooks || loadingUser) {
    return <div>Loading ....</div>;
  }

  if (authorsError || booksError || userError) {
    return <div>Error loading data</div>;
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />

      <div>
        <button onClick={() => setPage("authors")}>Authors</button>
        <button onClick={() => setPage("books")}>Books</button>
        {!token ? (
          <button onClick={() => setPage("login")}>Login</button>
        ) : (
          <div>
            <button onClick={() => setPage("add")}>Add Books</button>
            <button onClick={logout}>Logout</button>
          </div>
        )}
        <button onClick={() => setPage("recommend")}>Recommend</button>
      </div>

      <Authors show={page === "authors"} authors={authorsData.allAuthors} setError={notify} />
      <Books show={page === "books"} books={booksData.allBooks} />
      <NewBook show={page === "add"} setError={notify} />
      <LoginForm show={page === 'login'} setToken={setToken} setError={notify}
      setPage={setPage}
      />
      <Recommend show={page === 'recommend'} user={userData.me} books={booksData.allBooks} />
    </div>
  );
}

export default App;
