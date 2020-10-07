import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

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

  @Field(() => Date)
  @CreateDateColumn()
  createdAt = new Date();

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt = new Date();
}
