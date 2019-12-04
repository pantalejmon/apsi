import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Doctor extends User {
    // ToDo: decide between enum or table in db
    @Column()
    public specialization: string = '';

}