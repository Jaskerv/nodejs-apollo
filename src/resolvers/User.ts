import {
  Arg, Field, InputType, Int, Mutation, ObjectType, Query, Resolver,
} from 'type-graphql';
import argon2 from 'argon2';
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

@ObjectType()
class FieldError {
  @Field()
  field: string

  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User

  @Field(() => User, { nullable: true })
  users?: User[]
}

const idDoesNotExistError: UserResponse = {
  errors: [{
    field: 'id',
    message: 'that user does not exist',
  }],
};

const passwordMismatchError: UserResponse = {
  errors: [{
    field: 'confirmPassword',
    message: 'password does not match',
  }],
};

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

  @Query(() => UserResponse, { nullable: true })
  async user(
    @Arg('id', () => Int) id: number,
  ) : Promise<UserResponse> {
    const user = await User.findOne(id);
    if (!user) return idDoesNotExistError;
    return { user };
  }

  @Mutation(() => UserResponse, { nullable: true })
  async register(
    @Arg('options') options: UsernamePasswordConfirmInput,
  ) : Promise<UserResponse> {
    if (options.password !== options.confirmPassword) return passwordMismatchError;
    const hashedPassword = await argon2.hash(options.password);
    const user = User.create({
      username: options.username, password: hashedPassword,
    });
    await user.save();
    return { user };
  }

  @Mutation(() => UserResponse, { nullable: true })
  async updatePassword(
    @Arg('id', () => Int) id: number,
    @Arg('options') options: PasswordConfirmInput,
  ) : Promise<UserResponse> {
    const user = await User.findOne(id);
    if (!user) return idDoesNotExistError;
    if (typeof options.password !== 'undefined'
    && typeof options.confirmPassword !== 'undefined'
    && options.password === options.confirmPassword) {
      const hashedPassword = await argon2.hash(options.password);
      user.password = hashedPassword;
    } else return passwordMismatchError;

    await user.save();
    return { user };
  }

  @Mutation(() => UserResponse, { nullable: true })
  async login(
    @Arg('options') options: UsernamePasswordInput,
  ) : Promise<UserResponse> {
    const user = await User.findOne({ username: options.username });
    if (!user) {
      return {
        errors: [{
          field: 'username',
          message: 'that user does not exist',
        }],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'invalid login',
          },
        ],
      };
    }
    return { user };
  }
}
