import { Category } from 'src/modules/category/entities/category.entity';
import { Flavour } from 'src/modules/Flavour/entities/flavour.entity';
import {
  Entity,
  Column,
  ManyToOne,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';
import { ulid } from 'ulid';

@Entity('products')
export class Product {
  @PrimaryColumn({ type: 'varchar', length: 26 })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'boolean' })
  state: boolean;

  @ManyToOne(() => Flavour, (flavour) => flavour.products)
  flavour: Flavour;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
  @BeforeInsert()
  generateId() {
    console.log('BeforeInsert hook called');
    this.id = ulid();
  }
}
