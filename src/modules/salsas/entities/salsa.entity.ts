import {
    Entity,
    Column,
    PrimaryColumn,
    BeforeInsert,
  } from 'typeorm';
  import { ulid } from 'ulid';
  
  @Entity('salsas')
  export class Salsa {
    @PrimaryColumn({ type: 'varchar', length: 26 })
    id: string;
  
    @Column({ type: 'varchar', unique: true })
    name: string;
  
    @Column({ type: 'boolean', default: false })
    state: boolean;
  
    @BeforeInsert()
    generateId() {
      this.id = ulid();
    }
  }
  