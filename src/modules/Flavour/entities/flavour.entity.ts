import { Product } from 'src/modules/Product/entities/product.entity';
import {
  Entity,
  Column,
  OneToMany,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { ulid } from 'ulid';

@Entity('flavours')
export class Flavour {
  @PrimaryColumn({ type: 'varchar', length: 26 })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'boolean' })
  state: boolean;

  @OneToMany(() => Product, (product) => product.flavour)
  products: Product[];

  @BeforeInsert()
  generateId() {
    console.log('BeforeInsert hook called');
    this.id = ulid();
  }
}