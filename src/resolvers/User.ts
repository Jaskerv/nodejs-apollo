import {
  Arg, Field, InputType, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import argon2 from 'argon2';
import { UserInputError, ApolloError, AuthenticationError } from 'apollo-server-express';
import User from '../entities/User';

@InputType()
class PasswordConfirmInput {
  @Field()
  password: string

  @Field()
  confirmPassword: string
}

@InputType()
class UsernamePasswordConfirmInput {
  @Field()
  username: string

  @Field()
  password: string

  @Field()
  confirmPassword: string
}

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string

  @Field()
  password: string
}

const idDoesNotExistError = new ApolloError("This user doesn't exist");

const passwordMismatchError = new UserInputError('Password mismatch');

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
  async user(
    @Arg('id', () => Int) id: number,
  ) : Promise<User> {
    const user = await User.findOne(id);
    if (!user) throw idDoesNotExistError;
    return user;
  }

  @Mutation(() => User, { nullable: true })
  async register(
    @Arg('options') options: UsernamePasswordConfirmInput,
  ) : Promise<User> {
    if (options.password !== options.confirmPassword) throw passwordMismatchError;
    const hashedPassword = await argon2.hash(options.password);
    const user = User.create({
      username: options.username, password: hashedPassword,
    });
    await user.save();
    return user;
  }

  @Mutation(() => User, { nullable: true })
  async updatePassword(
    @Arg('id', () => Int) id: number,
    @Arg('options') options: PasswordConfirmInput,
  ) : Promise<User> {
    const user = await User.findOne(id);
    if (!user) throw idDoesNotExistError;
    if (typeof options.password !== 'undefined'
    && typeof options.confirmPassword !== 'undefined'
    && options.password === options.confirmPassword) {
      const hashedPassword = await argon2.hash(options.password);
      user.password = hashedPassword;
    } else throw passwordMismatchError;

    await user.save();
    return user;
  }

  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('options') options: UsernamePasswordInput,
  ) : Promise<User> {
    const user = await User.findOne({ username: options.username });
    if (!user) throw new AuthenticationError('username does not exist');

    const valid = await argon2.verify(user.password, options.password);
    if (!valid) throw new AuthenticationError('Invalid login');

    return user;
  }
}
