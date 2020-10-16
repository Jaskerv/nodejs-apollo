import { IsEmail } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { Entity, Column } from 'typeorm';
import BasicEntity from '../util/BasicEntity';

@ObjectType({ implements: BasicEntity })
@Entity()
export default class User extends BasicEntity {
  id: number;

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date;

  @Field()
  @Column({ type: 'text', unique: true })
  username: string;

  @Field()
  @Column({ type: 'text', unique: true })
  password: string;

  @Field()
  @IsEmail()
  @Column({ type: 'text', unique: true })
  email: string
}
