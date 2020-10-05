import 'reflect-metadata';
import { createConnection } from 'typeorm';
import path from 'path';
import { Post } from './entities/Post';

const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'docker',
    password: 'docker',
    database: 'lireddit',
    entities: [Post],
    migrations: [path.join(__dirname, './migrations/*')],
    logging: true,
  });
  await conn.runMigrations();
};

main();
