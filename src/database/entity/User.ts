import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string = '';

    @Column()
    public mail: string = '';

    @Column()
    public hashedPassword: string = '';

    @Column()
    public isActive: boolean = false;

}