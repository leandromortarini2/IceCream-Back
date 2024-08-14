import { Product } from 'src/modules/Product/entities/product.entity';
import {
  Entity,
  Column,
  OneToMany,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';
import { ulid } from 'ulid';

@Entity('categories')
export class Category {
  @PrimaryColumn({ type: 'varchar', length: 26 })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @BeforeInsert()
  generateId() {
    console.log('BeforeInsert hook called');
    this.id = ulid();
  }
}
