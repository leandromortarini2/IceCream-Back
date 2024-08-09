import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ULID } from 'ulid';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: ULID;

    @Column({unique: true})
    name: string;
}