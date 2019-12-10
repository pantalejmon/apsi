import * as express from 'express';
import DatabaseController from '../../../database/DatabaseController';
import { Const } from '../../../config/Constants';
import { Appointment } from '../../../database/entity/Appointment';
import { AppointmentStatus } from '../../../database/util/Enums';
import { Request, Response } from 'express';

export default class DataController {
    private router: express.Application | undefined;
    private api: string;
    private dbController: DatabaseController;

    constructor(app: express.Application, db: DatabaseController) {
        this.api = Const.api;
        this.router = app;
        this.dbController = db;
        this.getAllAppointments = this.getAllAppointments.bind(this);
        this.getAppointmentsForPatient = this.getAppointmentsForPatient.bind(this);
        this.getAppointmentsForDoctor = this.getAppointmentsForDoctor.bind(this);
        this.saveNewAppointment = this.saveNewAppointment.bind(this);
        this.setAppointmentStatus = this.setAppointmentStatus.bind(this);
        this.deleteAppointment = this.deleteAppointment.bind(this);
    }

    public async getAllAppointments(req: Request, res: Response) {
        const appointmentRepo = this.dbController.getAppointmentRepository();
        const appointments = await appointmentRepo.find({ relations: ["patient", "doctor"] });
        res.send(appointments);
    }

    public async getAppointmentsForDoctor(req: Request, res: Response) {
        const appointmentRepo = this.dbController.getAppointmentRepository();
        
    }

    public async getAppointmentsForPatient(req: Request, res: Response) {
        const appointmentRepo = this.dbController.getAppointmentRepository();

    }

    /*
        Save new appointment
        Request should contain appointment fields without status (automatically set to Pending)
        and patientId and doctorId
    */
    public async saveNewAppointment(req: Request, res: Response) {
        if (!req.body.startDate ||
            !req.body.duration ||
            !req.body.patientId ||
            !req.body.doctorId) {
            res.send({ message: "Invalid data" });
            return;
        }
        const patientRepo = this.dbController.getPatientRepository();
        const patient = await patientRepo.findOne({ id: req.body.patientId });
        if (!patient) {
            res.send({ message: "No patient with this id" });
            return
        }
        const doctorRepo = this.dbController.getDoctorRepository();
        const doctor = await doctorRepo.findOne({ id: req.body.doctorId });
        if (!doctor) {
            res.send({ message: "No doctor with this id" });
            return
        }
        const appointmentRepo = this.dbController.getAppointmentRepository();
        const newAppointment = new Appointment();
        newAppointment.startDate = req.body.startDate;
        newAppointment.duration = req.body.duration;
        newAppointment.patient = req.body.patient;
        newAppointment.doctor = req.body.doctor;
        newAppointment.status = AppointmentStatus.PENDING;
        await appointmentRepo.save(newAppointment);

        res.send(newAppointment);
    }

    /*
        Set new status to appointment
        Request should contain @appointmentId and @newStatus
    */
    public async setAppointmentStatus(req: Request, res: Response) {
        if (!req.body.appointmentId || !req.body.newStatus) {
            res.send({ message: "Invalid data" });
            return;
        }
        const repository = this.dbController.getAppointmentRepository();
        try {
            await repository.update(req.body.appointmentId, { status: req.body.newStatus });
        } catch (err) {
            res.send(err);
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
        const repository = this.dbController.getAppointmentRepository();
        await repository.delete({ id: req.body.appointmentId });
    }
}