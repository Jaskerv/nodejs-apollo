import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
} from 'typeorm';
import BasicEntity from '../util/BasicEntity';

@ObjectType({ implements: BasicEntity })
@Entity()
export default class Post extends BasicEntity {
  id: number;

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date;

  @Field()
  @Column({
    length: 100,
  })
  title: string;

  @Field()
  @Column('text')
  description: string;

  @Field()
  @Column('integer')
  likes: number;

  @Field()
  @Column('integer')
  views: number;
}
