import "reflect-metadata";
import * as express from 'express';
import DatabaseController from '../../../database/DatabaseController';
import { Const } from '../../../config/Constants';
import { Appointment } from '../../../database/entity/Appointment';
import { AppointmentStatus, Role, Errors } from '../../../database/util/Enums';
import { Request, Response } from 'express';
import Doctor from '../../../database/entity/Doctor';
import Patient from '../../../database/entity/Patient';

export default class DataController {
    private dbController: DatabaseController;

    constructor(db: DatabaseController) {
        this.dbController = db;

        this.getAllAppointments = this.getAllAppointments.bind(this);
        this.getAllMyPatientAppointments = this.getAllMyPatientAppointments.bind(this);
        this.getAllMyDoctorAppointments = this.getAllMyDoctorAppointments.bind(this);
        this.saveNewAppointment = this.saveNewAppointment.bind(this);
        this.setAppointmentStatus = this.setAppointmentStatus.bind(this);
        this.deleteAppointment = this.deleteAppointment.bind(this);
    }

    /**
     * All my patient appointments
     * @param req 
     * @param res 
     */
    public async getAllAppointments(req: Request, res: Response) {
        if (req.session.role === Role.ADMIN) {
            const appointmentRepo = this.dbController.getAppointmentRepository();
            const appointments = await appointmentRepo.find({ relations: ["patient", "doctor"] });
            res.send(appointments);
        } else {
            res.send({ error: Errors.PERMISSION_DENIED });
        }
    }

    /**
     * Get all appointments for particular patient
     * @param req 
     * @param res 
     */
    public async getAllMyPatientAppointments(req: Request, res: Response) {
        if (req.session.role === Role.PATIENT) {
            const appointmentRepo = this.dbController.getAppointmentRepository();
            const myAppointments = await appointmentRepo.find({ where: { patient: req.session.userid } });
            res.send(myAppointments);
        } else {
            res.send({ error: Errors.PERMISSION_DENIED });
        }
    }

    /**
     * Get all appointments for particular doctor
     * @param req 
     * @param res 
     */
    public async getAllMyDoctorAppointments(req: Request, res: Response) {
        if (req.session.role === Role.DOCTOR) {
            const appointmentRepo = this.dbController.getAppointmentRepository();
            const myAppointments = await appointmentRepo.find({ where: { doctor: req.session.userid } });
            res.send(myAppointments);
        } else {
            res.send({ error: Errors.PERMISSION_DENIED });
        }
    }

    /**
     * Save new appointment
     * Request should contain appointment fields without status (automatically set to Pending)
     * and patientId and doctorId
     * @param req 
     * @param res 
     */
    public async saveNewAppointment(req: Request, res: Response) {
        if (!req.body.startDate ||
            !req.body.duration ||
            !req.body.mail) {
            res.send({ message: "Invalid data" });
            return;
        }
        let patient: Patient;
        let doctor: Doctor;

        if (req.session.role === Role.PATIENT) {
            patient = await this.dbController.getPatientRepository().findOne(req.session.userid);
            doctor = await this.dbController.getDoctorRepository().findOne({ where: { mail: req.body.mail } });
        } else if (req.session.role === Role.DOCTOR) {
            patient = await this.dbController.getPatientRepository().findOne({ where: { mail: req.body.mail } });
            doctor = await this.dbController.getDoctorRepository().findOne(req.session.userid);
        } else {
            res.send({ error: Errors.OTHER_ERROR });
        }

        if (!patient) {
            res.send({ message: "No patient with this id" });
            return
        }

        if (!doctor) {
            res.send({ message: "No doctor with this id" });
            return
        }
        const appointmentRepo = this.dbController.getAppointmentRepository();
        const newAppointment = new Appointment();
        newAppointment.startDate = req.body.startDate;
        newAppointment.duration = req.body.duration;
        newAppointment.patient = patient;
        newAppointment.doctor = doctor;
        newAppointment.status = AppointmentStatus.PENDING;
        await appointmentRepo.save(newAppointment);

        res.send(newAppointment);
    }

    /**
     * Set new status to appointment
     * Request should contain @appointmentId and @newStatus
     * @param req 
     * @param res 
     */
    public async setAppointmentStatus(req: Request, res: Response) {
        if (!req.body.appointmentId || !req.body.newStatus) {
            res.send({ error: Errors.INVALID_DATA });
            return;
        }
        if (req.session.role !== Role.DOCTOR) {
            res.send({ error: Errors.PERMISSION_DENIED });
            return;
        }

        const repository = this.dbController.getAppointmentRepository();
        let appointment: Appointment = await this.dbController.getAppointmentRepository().findOne({
            relations: ["doctor"],
            where: {
                id: req.body.appointmentId
            }
        })
        if (appointment.doctor.id !== req.session.userid) {
            res.send({ error: Errors.PERMISSION_DENIED });
            return;
        }

        try {
            await repository.update(req.body.appointmentId, { status: req.body.newStatus });
        } catch (err) {
            res.send({ error: Errors.INVALID_DATA });
            console.log(err)
        }
    }

    /*
        Remove appointment by sent appointmentId
    */
    public async deleteAppointment(req: Request, res: Response) {
        if (!req.body.appointmentId) {
            res.send({ message: "No appointmentId sent" });
            return;
        }
        if (req.session.role !== Role.DOCTOR) {
            res.send({ error: Errors.PERMISSION_DENIED });
            return;
        }

        const repository = this.dbController.getAppointmentRepository();
        let deleteResponse = await repository.delete({ id: req.body.appointmentId });
        if (deleteResponse.raw[1]) {
            res.send({ message: "Post successfully deleted" });
        } else res.send({ message: "No post with given ID" });
    }
}