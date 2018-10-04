const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app  = express();
//npm install cors --save


//allow cross origin requests
app.use(cors());
//connect to mlab databse
mongoose.connect('mongodb://samarth:test123@ds251002.mlab.com:51002/gql-samarth')
mongoose.connection.once('open', () => {
	console.log('connected to database');
});

app.use('/graphql',graphqlHTTP({
	schema,
	graphiql: true
}));


app.listen(4000,() => {
	console.log('now istening request');
});