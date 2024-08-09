import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ULID } from 'ulid';
import { Flavour } from './flavour.entity';
import { Category } from './category.entity';

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn({primaryKeyConstraintName: 'product_pkey'})
    id: ULID;

    @Column({unique: true})
    name: string;

    @Column({default: 'Aun no se ha agregado una descripción'})
    description: string;

    @Column()
    price: number;

    @Column({default: 'https://ibb.co/n1whqyQ'})
    image: string;

    @Column({default: false})
    state: boolean;

    @OneToMany(() => Flavour, (flavour) => flavour.id)
    flavour: Flavour[];

    @OneToOne(() => Category, (category) => category.id)
    @JoinColumn()
    category: Category;
}