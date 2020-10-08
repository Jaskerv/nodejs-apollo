import { ApolloError } from 'apollo-server-express';
import {
  Arg, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import Post from '../entities/Post';

const idDoesNotExistError = new ApolloError("This post doesn't exist");

@Resolver()
export default class PostResolver {
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find({
      order: {
        id: 'ASC',
      },
    });
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg('id', () => Int) id: number,
  ) : Promise<Post> {
    const post = await Post.findOne(id);
    if (!post) throw idDoesNotExistError;
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

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title', { nullable: true }) title: string,
    @Arg('description', { nullable: true }) description: string,
    @Arg('likes', () => Int, { defaultValue: 0 }) likes: number,
    @Arg('views', () => Int, { defaultValue: 0 }) views: number,
  ) : Promise<Post> {
    const post = await Post.findOne(id);
    if (!post) throw idDoesNotExistError;
    if (typeof title === 'string') post.title = title;
    if (typeof description === 'string') post.description = description;
    if (typeof likes === 'number') post.likes = likes;
    if (typeof views === 'number') post.views = views;
    await post.save();
    return post;
  }

  @Mutation(() => Boolean, { nullable: true })
  async deletePost(
    @Arg('id', () => Int) id: number,
  ) : Promise<boolean> {
    const post = await Post.findOne(id);
    if (!post) throw idDoesNotExistError;
    if (typeof await post.remove() !== 'undefined') {
      return true;
    }
    return false;
  }
}
