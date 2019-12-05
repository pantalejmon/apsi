import * as express from 'express';
import DatabaseController from '../../../database/DatabaseController';
import { Const } from '../../../config/Constants';
import * as bcrypt from 'bcryptjs';
import Patient from '../../../database/entity/Patient';
import { Appointment } from '../../../database/entity/Appointment';
import Doctor from '../../../database/entity/Doctor';
export default class DataController {
    private router: express.Application | undefined;
    private api: string;
    private dbController: DatabaseController;

    constructor(app: express.Application, db: DatabaseController) {
        this.api = Const.api;
        this.router = app;
        this.dbController = db;
    }

    // ToDo: add appointment

    // ToDo: change appointment status

    public async getAllPatients(request: express.Request, response: express.Response) {
        const repository = this.dbController.getPatientRepository();
        const patients = await repository.find();
        response.send(patients);
    }

    public async getAllDoctors(request: express.Request, response: express.Response) {
        const repository = this.dbController.getDoctorRepository();
        const doctors = await repository.find();
        response.send(doctors);
    }

    // ToDo: check if request.params.email is OK
    public async getPatientByEmail(request: express.Request, response: express.Response) {
        const repository = this.dbController.getPatientRepository();
        const patient = repository.findOne(request.session.email);

        if (!patient) {
            response.status(404);
            response.end();
            return;
        } else response.send(patient);
    }

    // ToDo: check if request.params.email is OK
    public async getDoctorByEmail(request: express.Request, response: express.Response) {
        const repository = this.dbController.getDoctorRepository();
        const doctor = repository.findOne(request.session.email);

        if (!doctor) {
            response.status(404);
            response.end();
            return;
        } else response.send(doctor);
    }

    public async savePatient(request: express.Request, response: express.Response) {
        const repository = this.dbController.getPatientRepository();
        const newPatient = new Patient();
        newPatient.firstName = request.body.firstName;
        newPatient.lastName = request.body.lastName;
        newPatient.mail = request.body.mail;
        newPatient.phoneNumber = request.body.phoneNumber;
        newPatient.hashedPassword = this.hashPasswordSync(request.body.password);
        newPatient.citizenId = request.body.citizenId;
        newPatient.dateOfBirth = request.body.dateOfBirth;

        await repository.save(newPatient);

        response.send(newPatient);
    }

    public async saveDoctor(request: express.Request, response: express.Response) {
        const repository = this.dbController.getDoctorRepository();
        const newDoctor = new Doctor();
        newDoctor.firstName = request.body.firstName;
        newDoctor.lastName = request.body.lastName;
        newDoctor.mail = request.body.mail;
        newDoctor.phoneNumber = request.body.phoneNumber;
        newDoctor.hashedPassword = this.hashPasswordSync(request.body.password);
        newDoctor.specialization = request.body.specialization;
        
        await repository.save(newDoctor);

        response.send(newDoctor);
    }

    public async deletePatientByEmail(request: express.Request, response: express.Response) {
        const repository = this.dbController.getPatientRepository();
        const patientToDelete = await repository.findOne({ mail: request.body.mail });
        await repository.remove(patientToDelete);

        response.send(patientToDelete);
    }

    public async deleteDoctorByEmail(request: express.Request, response: express.Response) {
        const repository = this.dbController.getDoctorRepository();
        const doctorToDelete = await repository.findOne({ mail: request.body.mail });
        await repository.remove(doctorToDelete);

        response.send(doctorToDelete);
    }

    private hashPasswordSync(passwordToHash: string) {
        const salt = bcrypt.genSaltSync(10);
        const hash: string = bcrypt.hashSync(passwordToHash, salt);
        return hash;
    }
}