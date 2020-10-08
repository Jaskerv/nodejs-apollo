import 'reflect-metadata';
import { createConnection } from 'typeorm';
import path from 'path';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import colors from 'colors';
import dotenv from 'dotenv';
import UserResolver from './resolvers/User';
import PostResolver from './resolvers/Post';
import { __port__, __prod__ } from './constants';

dotenv.config();

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
    /**
     * ! Development or debugging only!
     * ! Do not enable dropSchema in production
     * * logging - outputs sql
     * * dropSchema - Drops the schema each time
     */
    logging: !__prod__,
    // dropSchema: true,
  });
  await conn.runMigrations();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    debug: !__prod__,
  });

  apolloServer.applyMiddleware({ app });

  app.listen(__port__, () => {
    console.log(`\nServer started on port ${colors.yellow(`${__port__}`)}\n`);
    console.log(`${'Graphql playgound here:'.blue} 🚀 ${colors.magenta.underline(`http://localhost:${__port__}/graphql`)} 🚀\n`);
  });
};

main();
