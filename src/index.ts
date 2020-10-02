import { MikroORM } from '@mikro-orm/core';
import { Post } from './entities/Post';
import mikroOrmConfig from './mikro-orm.config';

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();
  const post = new Post('title');
  await orm.em.persist(post);
  await orm.em.flush();
  console.log({ Post, post });

  // console.log('------------Sql 2 ----------------');
  // await orm.em.nativeInsert(Post, { title: 'Post 2' });
};

main().catch((error) => console.log(error));
