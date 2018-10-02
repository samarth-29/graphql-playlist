import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

//components
import BookList from './components/BookList';

//
//npm install apollo-boost react-apollo graphql --save

//apollo client setup
const client = new ApolloClient({
	uri: 'http://localhost:4000/graphql';
})

class App extends Component {
  render() {
    return (
    	<ApolloProvider clinet={client}>
	      <div className="main">
		      <h1>My reading list</h1>
		      <BookList/>
	      </div>
	    </ApolloProvider>
    );
  }
}

export default App;
