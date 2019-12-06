import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';
import DatabaseController from '../../../database/DatabaseController';
import { Role } from '../../../database/util/Enums';
import Patient from '../../../database/entity/Patient';
import Doctor from '../../../database/entity/Doctor';
import express from "express"

export default class UserController {
    private dbController: DatabaseController;
    constructor(db: DatabaseController) {
        this.dbController = db;
    }

    public async login(req: Request, res: Response): Promise<void> {
        res.status(200).send({ token: req.session.token });
    }
    public async signUp(req: Request, res: Response): Promise<void> {

    }
    public async staticDashboard(req: Request, res: Response): Promise<void> {
        // tslint:disable-next-line: triple-equals
        if (req.session.role == Role.PATIENT) {
            req.url = `/patient/${req.url}`;
        }
        // tslint:disable-next-line: triple-equals
        else if (req.session.role == Role.DOCTOR) {
            req.url = `/doctor/${req.url}`;
        }
    }

    public async getAllPatients(req: express.Request, res: express.Response) {
        const repository = this.dbController.getPatientRepository();
        const patients = await repository.find();
        res.send(patients);
    }

    public async getAllDoctors(req: express.Request, res: express.Response) {
        const repository = this.dbController.getDoctorRepository();
        const doctors = await repository.find();
        res.send(doctors);
    }

    // ToDo: check if request.params.email is OK
    public async getPatientByEmail(req: express.Request, res: express.Response) {
        const repository = this.dbController.getPatientRepository();
        const patient = repository.findOne(req.session.email);

        if (!patient) {
            res.status(404);
            res.end();
            return;
        } else res.send(patient);
    }

    // ToDo: check if request.params.email is OK
    public async getDoctorByEmail(req: express.Request, res: express.Response) {
        const repository = this.dbController.getDoctorRepository();
        const doctor = repository.findOne(req.session.email);

        if (!doctor) {
            res.status(404);
            res.end();
            return;
        } else res.send(doctor);
    }

    public async savePatient(req: express.Request, res: express.Response) {
        const repository = this.dbController.getPatientRepository();
        const newPatient = new Patient();
        newPatient.firstName = req.body.firstName;
        newPatient.lastName = req.body.lastName;
        newPatient.mail = req.body.mail;
        newPatient.phoneNumber = req.body.phoneNumber;
        newPatient.hashedPassword = this.hashPasswordSync(req.body.password);
        newPatient.citizenId = req.body.citizenId;
        newPatient.dateOfBirth = req.body.dateOfBirth;

        await repository.save(newPatient);

        res.send(newPatient);
    }

    public async saveDoctor(req: express.Request, res: express.Response) {
        const repository = this.dbController.getDoctorRepository();
        const newDoctor = new Doctor();
        newDoctor.firstName = req.body.firstName;
        newDoctor.lastName = req.body.lastName;
        newDoctor.mail = req.body.mail;
        newDoctor.phoneNumber = req.body.phoneNumber;
        newDoctor.hashedPassword = this.hashPasswordSync(req.body.password);
        newDoctor.specialization = req.body.specialization;

        await repository.save(newDoctor);

        res.send(newDoctor);
    }

    public async deletePatientByEmail(req: express.Request, res: express.Response) {
        const repository = this.dbController.getPatientRepository();
        const patientToDelete = await repository.findOne({ mail: req.body.mail });
        await repository.remove(patientToDelete);

        res.send(patientToDelete);
    }

    public async deleteDoctorByEmail(req: express.Request, res: express.Response) {
        const repository = this.dbController.getDoctorRepository();
        const doctorToDelete = await repository.findOne({ mail: req.body.mail });
        await repository.remove(doctorToDelete);

        res.send(doctorToDelete);
    }

    private hashPasswordSync(passwordToHash: string) {
        const salt = bcrypt.genSaltSync(10);
        const hash: string = bcrypt.hashSync(passwordToHash, salt);
        return hash;
    }

}

