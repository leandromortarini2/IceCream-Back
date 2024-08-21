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

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'boolean', default: false })
  state: boolean;

  @OneToMany(() => Product, (product) => product.flavour)
  products: Product[];

  @BeforeInsert()
  generateId() {
    this.id = ulid();
  }
}
