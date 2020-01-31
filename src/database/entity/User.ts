import { Column, PrimaryGeneratedColumn} from 'typeorm';
import {jsonIgnore} from "json-ignore";

/**
 * Abstrakcyjna klasa bazowa będąca modelem użytkownika aplikacji
 */
export default abstract class User {
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
    @jsonIgnore()
    public hashedPassword: string = '';

    @Column()
    @jsonIgnore()
    public isActive: boolean = false;

    @Column()
    @jsonIgnore()
    public registrationToken: string = '';
}