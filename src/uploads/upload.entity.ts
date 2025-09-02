import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileType } from './enums/file-types.enum';
import { FileResource } from './enums/file-resources.enum';
import { Post } from 'src/posts/post.entity';

@Entity()
export class Upload {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 1024, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 1024, nullable: false })
  path!: string;

  @Column({
    type: 'enum',
    enum: FileType,
    nullable: false,
    default: FileType.IMAGE,
  })
  type!: FileType;

  @Column({
    type: 'enum',
    enum: FileResource,
    nullable: false,
    default: FileResource.POST_IMAGE,
  })
  resource!: FileResource;

  @Column({ type: 'varchar', length: 128, nullable: false })
  mime!: string;

  @Column({ type: 'int', nullable: false })
  size!: number;

  @OneToMany(() => Post, (post) => post.author)
  posts?: Post[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
