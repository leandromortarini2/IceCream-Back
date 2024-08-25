import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';
import { ulid } from 'ulid';

export enum Role {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity({
  name: 'users',
})
export class User {
  @PrimaryColumn({ type: 'varchar', length: 26 })
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  email: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  validate: boolean;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ type: 'timestamp', nullable: true, name: 'last_login' })
  lastLogin: Date;

  @BeforeInsert()
  generateId() {
    this.id = ulid();
  }
}
