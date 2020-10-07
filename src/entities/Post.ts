import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
} from 'typeorm';
import BasicEntity from '../util/BasicEntity';

@ObjectType()
@Entity()
export default class Post extends BasicEntity {
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
