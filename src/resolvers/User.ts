import {
  Arg, Field, InputType, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import argon2 from 'argon2';
import User from '../entities/User';

// class PasswordConfirmationError extends Error {
//   constructor(m: string) {
//     super(m);

//     // Set the prototype explicitly.
//     Object.setPrototypeOf(this, PasswordConfirmationError.prototype);
//   }

//   sayHello() {
//     return `hello ${this.message}`;
//   }
// }

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string

  @Field()
  password: string

  @Field()
  confirmPassword: string
}

@Resolver()
export default class UserResolver {
  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find({
      order: {
        id: 'ASC',
      },
    });
  }

  @Query(() => User, { nullable: true })
  user(
    @Arg('id', () => Int) id: number,
  ) : Promise<User | undefined> {
    return User.findOne(id);
  }

  @Mutation(() => User, { nullable: true })
  async register(
    @Arg('options') options: UsernamePasswordInput,
  ) : Promise<User | undefined | null> {
    if (options.password !== options.confirmPassword) return null;
    const hashedPassword = await argon2.hash(options.password);
    const user = User.create({
      username: options.username, password: hashedPassword,
    });
    await user.save();
    return user;
  }

  @Mutation(() => User, { nullable: true })
  async updatePost(
    @Arg('id', () => Int, { nullable: false }) id: number,
    // @Arg('password') password: string,
    // @Arg('confirmPassword') confirmPassword: string,
  ) : Promise<User | null> {
    const user = await User.findOne(id);
    if (!user) return null;
    await user.save();
    return user;
  }

  @Mutation(() => Boolean, { nullable: true })
  async deletePost(
    @Arg('id', () => Int, { nullable: false }) id: number,
  ) : Promise<boolean> {
    const post = await User.findOne(id);
    if (!post) return false;
    if (typeof await post.remove() !== 'undefined') {
      return true;
    }
    return false;
  }
}
