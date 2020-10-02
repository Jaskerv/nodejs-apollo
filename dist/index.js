"use strict";

const {
  ApolloServer,
  gql
} = require('apollo-server'); // A schema is a collection of type definitions (hence "typeDefs")
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
const books = [{
  title: "Big mommy's milkers",
  author: 'Nanna Banana'
}, {
  title: 'On Cap',
  author: 'Ryce Milk'
}]; // Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.

const resolvers = {
  Query: {
    book: (parent, args, context, info) => {
      return books[args.id];
    },
    books: () => books
  }
};
const a = 3 ** 3;
console.log(a);
const b = {
  a: 123,
  v: 3
};
const c = { ...b,
  c: 123
};
console.log(c);
console.log([[1, 2], 3].flat());

console.log(0n === 0);

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

const server = new ApolloServer({
  typeDefs,
  resolvers
}); // The `listen` method launches a web server.

server.listen(3000).then(props => {
  console.log("server running on " + props.url);
});