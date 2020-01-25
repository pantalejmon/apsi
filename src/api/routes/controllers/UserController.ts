import "reflect-metadata";
import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import DatabaseController from '../../../database/DatabaseController';
import { Role, Errors } from '../../../database/util/Enums';
import Patient from '../../../database/entity/Patient';
import Doctor from '../../../database/entity/Doctor';
import User from '../../../database/entity/User';
import crypto from "crypto";
import MailController from '../../mail/MailController';
import path from 'path';
import {jsonIgnoreReplacer} from "json-ignore";

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
        this.passwordChangeRequest = this.passwordChangeRequest.bind(this);
        this.passwordChangeLink = this.passwordChangeLink.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.getMyInfo = this.getMyInfo.bind(this);
    }

    /*******************DOTYCZĄCE API*************/

    public async login(req: Request, res: Response): Promise<void> {
        res.send({ token: req.session.token, role: req.session.role });

    }

    public async logout(req: Request, res: Response): Promise<void> {
        req.session.destroy((err) => { if (err) console.log(err) });
        res.redirect("/index");
    }

    public async getMyRole(req: Request, res: Response): Promise<void> {
        res.status(200).send({ role: req.session.role });
    }

    public async getMyInfo(req: Request, res: Response): Promise<void> {
        let me: User;
        switch (req.session.role) {
            case Role.DOCTOR:
                me = await this.dbController.getDoctorRepository().findOne({ where: { email: req.session.email } });
                break;
            case Role.PATIENT:
                me = await this.dbController.getPatientRepository().findOne({ where: { email: req.session.email } });
                break;
            default:
                break;
        }
        if (me) res.send(JSON.parse(JSON.stringify(me, jsonIgnoreReplacer)));
        else res.send({ error: Errors.PERMISSION_DENIED })
    }

    public async signUp(req: Request, res: Response): Promise<void> {
        // ToDo: Add mail and phone number checks
        if (!req.body.role) {
            res.status(400).send({ error: "Access denied - unknown access right (role)" });
            return;
        } else if (!this.isStringNotEmpty(req.body.firstName)) {
            res.status(400).send({ error: "Invalid first name" });
            return;
        } else if (!this.isStringNotEmpty(req.body.lastName)) {
            res.status(400).send({ error: "Invalid last name" });
            return;
        } else if (!req.body.mail) {
            res.status(400).send({ error: "Invalid email address" });
            return;
        } else if (!req.body.phoneNumber) {
            res.status(400).send({ error: "Invalid phone number" });
            return;
        } else if (!req.body.password) {
            res.status(400).send({ error: "No password sent" });
            return;
        }

        // tslint:disable-next-line: triple-equals
        if (req.body.role == Role.PATIENT) {
            if (!this.isCitizenIdValid(req.body.citizenId)) {
                res.status(400).send({ error: "Invalid citizenId" });
                return;
            } else if (!this.isDateOfBirthValid(req.body.dateOfBirth)) {
                res.status(400).send({ error: "Invalid date of birth" });
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
            await this.savePatient(newPatient);
            res.status(200).send({ message: "Patient registered" });
            // tslint:disable-next-line: triple-equals
        } else if (req.body.role == Role.DOCTOR) {
            if (!req.body.specialization ||
                !req.body.specialization.trim()) {
                res.status(400).send({ error: "Invalid specialization" });
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
            await this.saveDoctor(newDoctor);
            res.status(200).send({ message: "Doctor registered" });
        } else {
            res.status(400).send({ error: "Invalid data" });
        }
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

    public async getAllPatients(req: Request, res: Response) {
        const repository = this.dbController.getPatientRepository();
        const patients = await repository.find();
        res.send(JSON.parse(JSON.stringify(patients, jsonIgnoreReplacer)));
    }

    public async getAllDoctors(req: Request, res: Response) {
        const repository = this.dbController.getDoctorRepository();
        const doctors = await repository.find();
        res.send(JSON.parse(JSON.stringify(doctors, jsonIgnoreReplacer)));
    }

    // ToDo: check if request.params.email is OK
    public async getPatientByEmail(req: Request, res: Response) {
        const email = req.params.email;
        const patient = this.dbController.getPatientRepository().findOne({ where: { email: email } });

        if (!patient) {
            res.status(404);
            res.end();
            return;
        } else res.send(patient);
    }

    // ToDo: check if request.params.email is OK
    public async getDoctorByEmail(req: Request, res: Response) {
        const email = req.params.email;
        const doctor = this.dbController.getDoctorRepository().findOne({ where: { email: email } });

        if (!doctor) {
            res.status(404);
            res.end();
            return;
        } else res.send(JSON.parse(JSON.stringify(doctor, jsonIgnoreReplacer)));
    }

    public async deletePatientByEmail(req: Request, res: Response) {
        const repository = this.dbController.getPatientRepository();
        const patientToDelete = await repository.findOne({ mail: req.body.mail });
        await repository.remove(patientToDelete);
        res.send(JSON.parse(JSON.stringify(patientToDelete, jsonIgnoreReplacer)));
    }

    public async deleteDoctorByEmail(req: Request, res: Response) {
        const repository = this.dbController.getDoctorRepository();
        const doctorToDelete = await repository.findOne({ mail: req.body.mail });
        await repository.remove(doctorToDelete);
        res.send(JSON.parse(JSON.stringify(doctorToDelete, jsonIgnoreReplacer)));
    }

    public async mailActivation(req: Request, res: Response) {
        const token = req.params.token;
        const p = await this.dbController.getPatientRepository().update({ registrationToken: token }, { isActive: true });
        const d = await this.dbController.getDoctorRepository().update({ registrationToken: token }, { isActive: true });
        if (p || d) res.send({ message: "Poprawna weryfikacja konta" });
        else res.send({ error: Errors.WRONG_CREDENTIALS })
    }

    public async passwordChangeRequest(req: Request, res: Response) {
        const email = req.body.email;
        let user: User =
            await this.dbController.getPatientRepository().findOne({ where: { mail: email } }) ||
            await this.dbController.getDoctorRepository().findOne({ where: { mail: email } });
        if (user) {
            await this.dbController.getPasswordService().getToken(user.mail);
            res.send({ message: "Mail send" })
        }
        else res.send({ error: Errors.WRONG_CREDENTIALS })
    }

    public async passwordChangeLink(req: Request, res: Response) {
        const token = req.params.token;
        const valid = await this.dbController.getPasswordService().checkToken(token);
        if (!valid) {
            res.send({ error: Errors.WRONG_CREDENTIALS })
        } else {
            req.session.userPassChange = (await
                this.dbController
                    .getPasswordService()
                    .getTokenUser(token))
                .mail;
            res.sendFile(path.resolve("src/private/util/passwordForm.html"));
        }
    }
    public async passwordChange(req: Request, res: Response) {
        const pass = req.body.pass;
        let email = req!.session!.userPassChange;
        await this.dbController.getPasswordService().changeUserPassword(email, pass);
        res.redirect("/")
    }

    /*************POMOCNICZE ***************************/

    /**
     * 
     * @param patient 
     */
    private async savePatient(patient: Patient) {
        const repository = this.dbController.getPatientRepository();
        await repository.save(patient);
    }

    /**
     * 
     * @param doctor 
     */
    private async saveDoctor(doctor: Doctor) {
        const repository = this.dbController.getDoctorRepository();
        await repository.save(doctor)
    }

    /**
     * 
     */
    public generateToken(): string {
        return crypto.randomBytes(64).toString('hex');
    }

    /**
     * 
     * @param citizenId 
     */
    private isCitizenIdValid(citizenId: string): boolean {
        let onlyDigitsRegex = /^\d{11}$/;
        if (!citizenId ||
            !citizenId.trim() ||
            citizenId.length !== 11 ||
            !onlyDigitsRegex.test(citizenId)) {
            return false;
        } else return true;
    }

    /**
     * 
     * @param dateOfBirth 
     */
    private isDateOfBirthValid(dateOfBirth: number): boolean {
        if (isNaN(dateOfBirth)) {
            return false;
        } else return true;
    }

    /**
     * 
     * @param input 
     */
    private isStringNotEmpty(input: string): boolean {
        if (!input ||
            !input.trim()) {
            return false;
        } else return true;
    }
}

