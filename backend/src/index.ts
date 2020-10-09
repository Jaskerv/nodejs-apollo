import 'reflect-metadata';
import { createConnection } from 'typeorm';
import path from 'path';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import colors from 'colors';
import dotenv from 'dotenv';
import connectRedis from 'connect-redis';
import redis from 'redis';
import session from 'express-session';
import cors from 'cors';
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
     * * logging - outputs SQL
     * * dropSchema - Drops the schema each time
     */
    logging: !__prod__,
    // dropSchema: !__prod__,
  });
  await conn.runMigrations();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  const app = express();

  /**
   * * Important, middleware order is important.
   * * Session middleware needs to come first before apollo.
   * * This is because so that apollo can use session.
   */

  app.use(
    cors({
      // TODO: Add origin to env
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  );

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redisClient,
        /**
         * * Updates sessions to upon interaction.
         * * set to true to reduce calls to redis.
         * */
        disableTouch: true,
      }),
      cookie: {
        // * One week cookie session
        maxAge: 1000 * 60 * 60 * 24 * 7,
        // * Frontend js cannot access the cookie
        httpOnly: true,
        // * cookie only works in https
        secure: __prod__,
        // * csrf
        sameSite: 'lax',
      },
      saveUninitialized: false,
      // TODO: Set secret to env variable.
      secret: 'RandomSTRING',
      resave: false,
    }),
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
    }),
    // * Debug - Enables stacktrace on GraphQL errors
    debug: !__prod__,
    // * Tracing - Enables query performance metrics
    tracing: !__prod__,
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(__port__, () => {
    console.log(`\nServer started on port ${colors.yellow(`${__port__}`)}\n`);
    console.log(
      `${'Graphql playgound here:'.blue} 🚀 ${colors.magenta.underline(`http://localhost:${__port__}/graphql`)} 🚀\n`,
    );
  });
};

main();
