import { Field, InterfaceType } from 'type-graphql';
import {
  BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';

@InterfaceType()
export default abstract class BasicEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt = new Date();

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt = new Date();

  @Field(() => Date)
  @DeleteDateColumn()
  deletedAt = new Date();
}
