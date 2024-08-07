import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ULID } from 'ulid';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: ULID;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column()
    sucursal: string;

    @Column()
    phone: number;
    
    @Column()
    email: string;

    @Column()
    validate: boolean;

    @Column()
    role: string;

    @Column()
    created_at: Date;

    @Column()
    last_login: Date;
}