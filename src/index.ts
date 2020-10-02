import { gql } from 'apollo-server';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    book(id: Int): Book
  }
`;

// const books = [
//   {
//     title: "Big",
//     author: 'Nancy',
//   },
//   {
//     title: 'On God',
//     author: 'Ryan',
//   },
// ];

// // Resolvers define the technique for fetching the types defined in the
// // schema. This resolver retrieves books from the "books" array above.
// const resolvers = {
//   Query: {
//     book: (parent: any, args: any, context: any, info: any)=>{
//       return books[args.id]
//     },
//     books: () => books,
//   },
// };

// // The ApolloServer constructor requires two parameters: your schema
// // definition and your set of resolvers.
// const server = new ApolloServer({ typeDefs, resolvers });

// // The `listen` method launches a web server.
// server.listen(3000).then((props: any) => {
//   console.log("server running on " + props.url);
// });

console.log('hello world');

console.log(typeDefs);
console.log('12');
