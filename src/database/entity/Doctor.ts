import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ChildEntity } from 'typeorm';
import User from './User';
import { Appointment } from './Appointment';

/**
 * Struktura danych odpowiadająca lekarzowi
 */
@Entity()
export default class Doctor extends User {
    // ToDo: decide between enum or table in db
    @Column()
    public specialization: string = '';

    @OneToMany(type => Appointment, appointments => appointments.doctor)
    public appointments: Appointment[];
}