import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { Appointment } from './Appointment';

@Entity()
export class Patient extends User {
    // citizenId == PESEL
    @Column({ length: 11 })
    public citizenId: string = '';

    @Column({ type: "timestamp without time zone" })
    public dateOfBirth: number;

    @OneToMany(type => Appointment, appointments => appointments.patient)
    public appointments: Appointment[];
}