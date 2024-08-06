import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ULID } from 'ulid';
import { Category } from './category.entity';
import { Product } from './product.entity';

@Entity({ name: 'flavours' })
export class Flavour {
    @PrimaryGeneratedColumn()
    id: ULID;

    @Column()
    name: string;

    @Column()
    state: boolean;

    @OneToMany(() => Category, (category) => category.id)
    category_id: Category[]

    @OneToMany(() => Product, (product) => product.id)
    product_id: Product[]


}