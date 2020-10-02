import { MikroORM } from '@mikro-orm/core';
import path from 'path';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { __prod__ } from './constants';
import { Post } from './entities/Post';

export default {
  dbName: 'lireddit',
  debug: !__prod__,
  type: 'postgresql',
  user: 'docker',
  password: 'docker',
  entities: [Post],
  highlighter: new SqlHighlighter(),
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
} as Parameters<typeof MikroORM.init>[0];
