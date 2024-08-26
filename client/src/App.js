import React from 'react';
import './App.css';
import { gql, useQuery } from '@apollo/client';

// The GraphQL query
const GET_ALL_TODOS = gql`
  query GetAllTodos {
    getTodos {
      title
      completed
      user {
        name
        username
      }
    }
  }
`;

function App() {
  const { data, loading, error } = useQuery(GET_ALL_TODOS);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error: {error.message}</h1>;
  }

  return (
    <div className="App">
      {JSON.stringify(data, null, 2)}
    </div>
  );
}

export default App;
