import {
  Arg, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import Post from '../entities/Post';

@Resolver(Post)
export default class PostResolver {
  @Query(() => [Post])
  posts(
    @Arg('withDeleted', { nullable: true }) withDeleted: boolean,
  ): Promise<Post[]> {
    return Post.find({
      order: {
        createdAt: 'DESC',
      },
      withDeleted,
    });
  }

  @Query(() => Post)
  async post(
    @Arg('id', () => Int) id: number,
    @Arg('withDeleted', { nullable: true }) withDeleted: boolean,
  ) : Promise<Post> {
    const post = await Post.findOneOrFail(id, { withDeleted });
    return post;
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('title') title: string,
    @Arg('description') description: string,
    @Arg('likes', () => Int, { defaultValue: 0 }) likes: number,
    @Arg('views', () => Int, { defaultValue: 0 }) views: number,
  ) : Promise<Post> {
    const post = Post.create({
      title, description, likes, views,
    });
    await post.save();
    return post;
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title', { nullable: true }) title: string,
    @Arg('description', { nullable: true }) description: string,
    @Arg('likes', () => Int, { defaultValue: 0 }) likes: number,
    @Arg('views', () => Int, { defaultValue: 0 }) views: number,
  ) : Promise<Post> {
    const post = await Post.findOneOrFail(id);
    if (typeof title === 'string') post.title = title;
    if (typeof description === 'string') post.description = description;
    if (typeof likes === 'number') post.likes = likes;
    if (typeof views === 'number') post.views = views;
    await post.save();
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async deletePost(
    @Arg('id', () => Int) id: number,
  ) : Promise<Post> {
    const post = await Post.findOneOrFail(id);
    await post.softRemove();
    return post;
  }
}
