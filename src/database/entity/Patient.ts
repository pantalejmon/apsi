import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ChildEntity } from 'typeorm';
import User from './User';
import { Appointment } from './Appointment';

/**
 * Struktura danych odpowiadająca pacjentowi
 */
@Entity()
export default class Patient extends User {
    // citizenId == PESEL
    @Column({ length: 11 })
    public citizenId: string = '';

    // dateOfBirth is Unix Timestamp (seconds since 01.01.1970(UTC))
    @Column({ type: "integer", default: 0 })
    public dateOfBirth: number = 0;

    @OneToMany(type => Appointment, appointments => appointments.patient)
    public appointments: Appointment[];
}