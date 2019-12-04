import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Doctor } from './Doctor';
import { Patient } from './Patient';

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
    @Column()
    public patient: Patient;

    // ToDo: update column
    @Column()
    public doctor: Doctor;

    // pending / finished / confirmed
    @Column({
        type: "enum",
        enum: AppointmentStatus,
        default: AppointmentStatus.PENDING
    })
    public status: AppointmentStatus;

}