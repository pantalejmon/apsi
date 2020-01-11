import { createConnection, Connection, getRepository, Repository } from 'typeorm';
import 'reflect-metadata';
import User from './entity/User';
import Patient from './entity/Patient';
import Doctor from './entity/Doctor';
import Credentials from '../config/Credentials';
import Server from '../api/Server';
import { Appointment } from './entity/Appointment';
import PasswordTokenService from './services/PasswordTokenService';
import PasswordToken from './entity/PasswordToken';
export default class DatabaseController {
    private connection: Connection
    private patientRepository: Repository<Patient>;
    private doctorRepository: Repository<Doctor>;
    private appointmentRepository: Repository<Appointment>;
    private passwordService: PasswordTokenService;

    constructor(owner: Server) {
        createConnection({
            type: "postgres",
            host: Credentials.dbHost,
            port: Credentials.dbPort,
            username: Credentials.dbUsername,
            password: Credentials.dbPassword,
            database: Credentials.dbname,
            entities: [
                "./dist/database/entity/*.js"
            ],
            extra: {
                ssl: true
            },
            synchronize: true,
            logging: false
        }).then((connection) => {
            this.connection = connection;
            owner.sessionInit();
            this.patientRepository = getRepository(Patient);
            this.doctorRepository = getRepository(Doctor);
            this.appointmentRepository = getRepository(Appointment);
            this.passwordService = new PasswordTokenService(getRepository(PasswordToken), this);
            owner.apiInit(this);
            owner.serverStart();
            console.log("Uruchomiono mechanizm sesji");
        }).catch((error) => {
            console.log(error)
        });
    }


    /**
     * Gettery
     */
    public getPatientRepository(): Repository<Patient> { return this.patientRepository; }
    public getDoctorRepository(): Repository<Doctor> { return this.doctorRepository; }
    public getAppointmentRepository(): Repository<Appointment> { return this.appointmentRepository; }
    public getPasswordService(): PasswordTokenService { return this.passwordService }


}