import React, { Component } from 'react';
 import ApolloClient from 'apollo-boost';
 import { ApolloProvider } from 'react-apollo';

//components
import BookList from './components/BookList';
import AddBook from './components/AddBook';

//
//npm install apollo-boost react-apollo graphql --save

//apollo client setup
const client = new ApolloClient({
	uri: 'http://localhost:4000/graphql'
})

class App extends Component {
  render() {
    return (
    	<ApolloProvider client={client}>
	      <div className="main">
		      <h1>My Reading List</h1>
		      <BookList/>
		      <AddBook/>
	      </div>
	    </ApolloProvider>
    );
  }
}

export default App;
