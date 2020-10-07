import { Field, ObjectType } from 'type-graphql';
import { Entity, Column } from 'typeorm';
import BasicEntity from '../util/BasicEntity';

@ObjectType()
@Entity()
export default class User extends BasicEntity {
  @Field()
  @Column({ type: 'text', unique: true })
  username!: string;

  @Field()
  @Column({ type: 'text', unique: true })
  password!: string;
}
