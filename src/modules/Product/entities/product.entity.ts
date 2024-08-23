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

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'varchar',
    default: `${process.env.IMAGE_DEFAULT}`,
    nullable: true,
  })
  image: string;

  @Column({ type: 'boolean', default: false })
  state: boolean;

  @ManyToOne(() => Flavour, (flavour) => flavour.products)
  flavour: Flavour;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
  @BeforeInsert()
  generateId() {
    this.id = ulid();
  }
}
