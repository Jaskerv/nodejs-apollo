import {
  BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  title: string;

  @Column('text')
  description: string;

  @Column('integer')
  likes: number;

  @Column('integer')
  views: number;

  @CreateDateColumn()
  createdAt = new Date();

  @UpdateDateColumn()
  updatedAt = new Date();
}
