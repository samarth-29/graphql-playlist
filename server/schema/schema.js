const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

const { 
	GraphQLObjectType, 
	GraphQLString, 
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull
} = graphql;



//dummy data
// var books = [
// 	{name:'Name of the Wind',genre:'Fantasy',id:'1', authorid:'1'},
// 	{name:'The final Empire',genre:'Fantasy',id:'2', authorid:'2'},
// 	{name:'The long Earth',genre:'Sci-Fi',id:'3', authorid:'3'},
// 	{name:'ABC',genre:'Fantasy',id:'4', authorid:'2'},
// 	{name:'XYZ',genre:'Fantasy',id:'5', authorid:'3'},
// 	{name:'PQR',genre:'Sci-Fi',id:'6', authorid:'1'}
// ];

// var authors = [
// 	{name:'Patrick Rothfuss',age:'44',id:'1'},
// 	{name:'Brandn Sanderson',age:'42',id:'2'},
// 	{name:'Terry Pratchett',age:'66',id:'3'}
// ];



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
				//return _.find(authors, {id:parent.authorid});
				return Author.findById(parent.authorid);
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
				//return _.filter(books,{authorid: parent.id})
				return Book.find({authorid: parent.id});
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
				//return _.find(books, {id:args.id});
				return Book.findById(args.id);
			}
		},
		author: {
			type: AuthorType,
			args: {id: {type: GraphQLID}},
			resolve(parent, args) {
				//return _.find(authors, {id: args.id});
				return Author.findById(args.id);
			}
		},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				//return books
				return Book.find({});
			}
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent, args) {
				//return authors
				return Author.find({});
			}
		}
	}
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addAuthor: {
			type: AuthorType,
			args: {
				name: {type:new GraphQLNonNull(GraphQLString)},
				age: {type:new GraphQLNonNull(GraphQLInt)}
			},
			resolve(parent, args) {
				let author = new Author({
					name: args.name,
					age: args.age
				});
				return author.save();
			}
		},
		updateAuthor: {
			type: AuthorType,
			args: {
				id: {
					name: 'id',
					type: GraphQLID
				},
				name: {
					type: new GraphQLNonNull(GraphQLString)
				},
				age: {
					type:new GraphQLNonNull(GraphQLInt)
				}
			},
			resolve(parent, args) {
				return Author.findByIdAndUpdate(
					args.id,
					{ $set: {name: args.name, age: args.age} },
					{ new: true }
				)
				.catch(err => {
					console.log(err);
				});
			}
		},
		removeAuthor: {
			type: AuthorType,
			args: {
				id: {
					type: GraphQLID
				}
			},
			resolve(parent, args) {
				const removedAuthor = Author.findByIdAndRemove(args.id).exec();
				if(!removedAuthor) {
					throw new Error('Error')
				}
				return removedAuthor
			}
		},
		addBook: {
			type: BookType,
			args: {
				name: {type:new GraphQLNonNull(GraphQLString)},
				genre: {type:new GraphQLNonNull(GraphQLString)},
				authorid: {type:new GraphQLNonNull(GraphQLID)}
			},
			resolve(parent,args) {
				let book = new Book({
					name: args.name,
					genre: args.genre,
					authorid: args.authorid
				});
				return book.save();
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
	