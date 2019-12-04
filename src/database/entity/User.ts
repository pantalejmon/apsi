import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Appointment } from './Appointment';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public firstName: string = '';

    @Column()
    public lastName: string = '';

    @Column()
    public mail: string = '';

    @Column()
    public phoneNumber: string = '';

    @Column()
    public hashedPassword: string = '';

    @Column()
    public isActive: boolean = false;

}