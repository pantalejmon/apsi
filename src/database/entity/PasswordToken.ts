import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import User from "./User";


@Entity()
export default class PasswordToken {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: "timestamp" })
    public endDate: number;

    @Column()
    userMail: string;

    @Column()
    public token: string;
}