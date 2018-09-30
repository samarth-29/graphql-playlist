const graphql = require('graphql');
const _ = require('lodash');

const { 
	GraphQLObjectType, 
	GraphQLString, 
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList
} = graphql;



//dummy data
var books = [
	{name:'Name of the Wind',genre:'Fantasy',id:'1', authorid:'1'},
	{name:'The final Empire',genre:'Fantasy',id:'2', authorid:'2'},
	{name:'The long Earth',genre:'Sci-Fi',id:'3', authorid:'3'},
	{name:'ABC',genre:'Fantasy',id:'4', authorid:'2'},
	{name:'XYZ',genre:'Fantasy',id:'5', authorid:'3'},
	{name:'PQR',genre:'Sci-Fi',id:'6', authorid:'1'}
];

var authors = [
	{name:'Patrick Rothfuss',age:'44',id:'1'},
	{name:'Brandn Sanderson',age:'42',id:'2'},
	{name:'Terry Pratchett',age:'66',id:'3'}
];



const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: {type: GraphQLID},
		name: {type: GraphQLString},
		genre: {type: GraphQLString},
		author: {
			type: AuthorType,
			resolve(parent, args) {
				//console.log(parent);
				return _.find(authors, {id:parent.authorid});
			}
		}
	})
});

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields: () => ({
		id: {type: GraphQLID},
		name: {type: GraphQLString},
		age: {type: GraphQLInt} ,
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				return _.filter(books,{authorid: parent.id})
			} 
		}
	})
});


const RootQuery = new GraphQLObjectType({
	name:'RootQueryType',
	fields: {
		book: {
			type: BookType,
			args: {id: {type: GraphQLID}},
			resolve(parent, args) {
				//code to get data from db/ other source
				//console.log(typeof(args.id))
				return _.find(books, {id:args.id});
			}
		},
		author: {
			type: AuthorType,
			args: {id: {type: GraphQLID}},
			resolve(parent, args) {
				return _.find(authors, {id: args.id});
			}
		},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				return books
			}
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent, args) {
				return authors
			}
		}
	}
});


module.exports = new GraphQLSchema({
	query: RootQuery
});
	