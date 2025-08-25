import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileType } from './enums/file-types.enum';

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

  @Column({ type: 'varchar', length: 128, nullable: false })
  mime!: string;

  @Column({ type: 'int', nullable: false })
  size!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
