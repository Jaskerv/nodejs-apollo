import {
  Arg, Ctx, Field, InputType, Int, Mutation, Query, Resolver,
} from 'type-graphql';
import argon2 from 'argon2';
import { UserInputError } from 'apollo-server-express';
import { IsEmail, MinLength } from 'class-validator';
import { v4 } from 'uuid';
import User from '../entities/User';
import { Context } from '../types';
import {
  REDIS_COOKIE_NAME, FRONTEND_RESET_PASSWORD_ROUTE, FRONTEND_URL, REDIS_PASSWORD_RESET_PREFIX,
} from '../constants';
import { sendMail } from '../util/mailer';

@InputType()
class PasswordConfirmInput {
  @Field()
  @MinLength(8)
  password: string

  @Field()
  @MinLength(8)
  confirmPassword: string
}

@InputType()
class EmailInput {
  @Field()
  @IsEmail()
  email: string
}

@InputType()
class UsernameEmailPasswordConfirmInput extends EmailInput {
  @Field()
  @MinLength(3)
  username: string

  @Field()
  @MinLength(8)
  password: string

  @Field()
  @MinLength(8)
  confirmPassword: string
}

@InputType()
class EmailPasswordInput extends EmailInput {
  @Field()
  @MinLength(8)
  password: string
}

const passwordMismatchError = new UserInputError('Password mismatch');

@Resolver(User)
export default class UserResolver {
  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { req }: Context,
  ) : Promise<User|null> {
    const id = req.session.userId;
    if (!id) {
      return null;
    }
    const user = await User.findOneOrFail(id);
    return user;
  }

  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find({
      order: {
        id: 'ASC',
      },
    });
  }

  @Query(() => User)
  async user(
    @Arg('id', () => Int) id: number,
  ) : Promise<User> {
    const user = await User.findOneOrFail(id);
    return user;
  }

  @Mutation(() => User)
  async register(
    @Arg('options') options: UsernameEmailPasswordConfirmInput,
    @Ctx() { req }: Context,
  ) : Promise<User> {
    if (await User.findOne({ username: options.username }, { withDeleted: true })) {
      throw new UserInputError('Username taken');
    }
    if (await User.findOne({ email: options.email }, { withDeleted: true })) {
      throw new UserInputError('Email taken');
    }
    if (options.password !== options.confirmPassword) throw passwordMismatchError;
    const hashedPassword = await argon2.hash(options.password);
    const user = User.create({
      username: options.username, password: hashedPassword, email: options.email,
    });
    await user.save();

    // ! This will auto log the user in
    req.session.userId = user.id;

    return user;
  }

  @Mutation(() => User)
  async updatePassword(
    @Arg('id', () => Int) id: number,
    @Arg('options') options: PasswordConfirmInput,
  ) : Promise<User> {
    const user = await User.findOneOrFail(id);
    if (typeof options.password !== 'undefined'
    && typeof options.confirmPassword !== 'undefined'
    && options.password === options.confirmPassword) {
      const hashedPassword = await argon2.hash(options.password);
      user.password = hashedPassword;
    } else throw passwordMismatchError;

    return user;
  }

  @Mutation(() => User)
  async signIn(
    @Arg('options') options: EmailPasswordInput,
    @Ctx() { req }: Context,
  ) : Promise<User> {
    const user = await User.findOne({ email: options.email });
    if (!user) throw new UserInputError('Email does not exist');

    const valid = await argon2.verify(user.password, options.password);
    if (!valid) throw new UserInputError('Email or password incorrect');

    req.session.userId = user.id;

    return user;
  }

  @Mutation(() => Boolean)
  signOut(
    @Ctx() { res, req }: Context,
  ) : Promise<boolean> {
    return new Promise((resolve) => req.session.destroy((err) => {
      res.clearCookie(REDIS_COOKIE_NAME);
      if (err) {
        resolve(false);
        return;
      }
      resolve(true);
    }));
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis }: Context,
  ) : Promise<boolean> {
    const user = await User.findOne({ email });
    if (user) {
      const token = v4();

      // * expires in 3 days
      redis.set(REDIS_PASSWORD_RESET_PREFIX + token, user.id, 'ex', 1000 * 60 * 60 * 24 * 3);

      const html = `<a href="${FRONTEND_URL}${FRONTEND_RESET_PASSWORD_ROUTE}/${token}">Reset Password</a>`;

      sendMail({
        to: user.email, from: 'password-recovery@test.com', subject: 'Password Recovery', html,
      });
    }
    return true;
  }
}
