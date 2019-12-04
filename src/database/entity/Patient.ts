import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Patient extends User {
    // citizenId == PESEL
    @Column({ length: 11 })
    public citizenId: string = '';

    @Column({ type: "timestamp without time zone" })
    public dateOfBirth: number;
}