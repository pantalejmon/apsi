import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Doctor } from './Doctor';
import { Patient } from './Patient';
import { User } from './User';

export enum AppointmentStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    FINISHED = 'finished'
}

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: "timestamp" })
    public startDate: number;

    @Column()
    public duration: number;




    // ToDo: update column
    @ManyToOne(type => Patient, patient => patient.appointments)
    public patient: Patient;

    // ToDo: update column
    @ManyToOne(type => Doctor, doctor => doctor.appointments)
    public doctor: Doctor;

    // pending / finished / confirmed
    @Column({
        type: "enum",
        enum: AppointmentStatus,
        default: AppointmentStatus.PENDING
    })
    public status: AppointmentStatus;

}