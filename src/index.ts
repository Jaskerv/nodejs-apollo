import 'reflect-metadata';
import { createConnection } from 'typeorm';
import path from 'path';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import colors from 'colors';
import UserResolver from './resolvers/User';
import PostResolver from './resolvers/Post';
import { __port__ } from './constants';

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red',
});

const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'docker',
    password: 'docker',
    database: 'lireddit',
    entities: [path.join(__dirname, './entities/*')],
    migrations: [path.join(__dirname, './migrations/*')],
    logging: true,
    // dropSchema: true,
  });
  await conn.runMigrations();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(__port__, () => {
    console.log(`\nServer started on port ${colors.yellow(`${__port__}`)}\n`);
    console.log(`${'Graphql playgound here:'.blue} ${colors.magenta.underline(`http://localhost:${__port__}/graphql`)} 🚀\n`);
  });
};

main();
