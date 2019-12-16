import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';
import DatabaseController from '../../../database/DatabaseController';
import { Role, Errors } from '../../../database/util/Enums';
import Patient from '../../../database/entity/Patient';
import Doctor from '../../../database/entity/Doctor';
import express from "express"
import User from '../../../database/entity/User';
import crypto from "crypto";
import MailController from '../../mail/MailController';

export default class UserController {
    private dbController: DatabaseController;
    constructor(db: DatabaseController) {
        // Bindowanie
        this.dbController = db;
        this.login = this.login.bind(this);
        this.signUp = this.signUp.bind(this);
        this.savePatient = this.savePatient.bind(this);
        this.saveDoctor = this.saveDoctor.bind(this);
        this.staticDashboard = this.staticDashboard.bind(this);
        this.getAllPatients = this.getAllPatients.bind(this);
        this.getAllDoctors = this.getAllDoctors.bind(this);
        this.getPatientByEmail = this.getPatientByEmail.bind(this);
        this.getDoctorByEmail = this.getDoctorByEmail.bind(this);
        this.deletePatientByEmail = this.deletePatientByEmail.bind(this);
        this.deleteDoctorByEmail = this.deleteDoctorByEmail.bind(this);
    }

    public async login(req: Request, res: Response): Promise<void> {
        res.status(200).send({ token: req.session.token });
    }

    public async signUp(req: Request, res: Response): Promise<void> {
        // ToDo: Check if everything in res.body is present/valid
        if (!req.body.role
            || !req.body.firstName
            || !req.body.lastName
            || !req.body.mail
            || !req.body.phoneNumber
            || !req.body.password) {
            res.send({ message: "Invalid data" });
            return;
        }
        // ToDo: check if data is valid before saving
        // tslint:disable-next-line: triple-equals
        if (req.body.role == Role.PATIENT) {
            if (!req.body.citizenId || !req.body.dateOfBirth) {
                res.send({ message: "Invalid citizenId or date of birth" });
                return;
            }
            const newPatient = new Patient();
            newPatient.firstName = req.body.firstName;
            newPatient.lastName = req.body.lastName;
            newPatient.mail = req.body.mail;
            newPatient.phoneNumber = req.body.phoneNumber;
            newPatient.hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync());
            newPatient.citizenId = req.body.citizenId;
            newPatient.dateOfBirth = req.body.dateOfBirth;
            newPatient.registrationToken = this.generateToken();
            MailController.ActivationMail(newPatient);
            this.savePatient(newPatient);
            // tslint:disable-next-line: triple-equals
        } else if (req.body.role == Role.DOCTOR) {
            if (!req.body.specialization) {
                res.send({ message: "Invalid specialization" });
                return;
            }
            const newDoctor = new Doctor();
            newDoctor.firstName = req.body.firstName;
            newDoctor.lastName = req.body.lastName;
            newDoctor.mail = req.body.mail;
            newDoctor.phoneNumber = req.body.phoneNumber;
            newDoctor.hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync());
            newDoctor.specialization = req.body.specialization;
            newDoctor.registrationToken = this.generateToken();
            MailController.ActivationMail(newDoctor);
            this.saveDoctor(newDoctor);
        } else {
            res.send({ message: "Invalid data" });
        }
    }

    private async savePatient(patient: Patient) {
        const repository = this.dbController.getPatientRepository();
        await repository.save(patient);
    }

    private async saveDoctor(doctor: Doctor) {
        const repository = this.dbController.getDoctorRepository();
        await repository.save(doctor)
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

    public async mailActivation(req: express.Request, res: express.Response) {
        const token = req.params.token;
        const p = await this.dbController.getPatientRepository().update({ registrationToken: token }, { isActive: true })
        const d = await this.dbController.getDoctorRepository().update({ registrationToken: token }, { isActive: true })
        if (p || d) res.send({ message: "Poprawna weryfikacja konta" });
        else res.send({ error: Errors.WRONG_CREDENTIALS })
    }

    public generateToken(): string {
        return crypto.randomBytes(64).toString('hex');
    }

}

