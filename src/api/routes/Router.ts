import express from 'express';
import { Const } from '../../config/Constants';
import DatabaseController from '../../database/DatabaseController';
import AuthenticationController from './security/AuthenticationController';
import UserController from './controllers/UserController';
import AuthorisationController from './security/AuthorisationController';
import { Request, Response } from 'express-serve-static-core';
import DataController from "./controllers/DataController";

export default class Router {
    private router: express.Application | undefined;
    private api: string;
    private dbController: DatabaseController
    private authController: AuthenticationController;
    private permController: AuthorisationController;
    private userController: UserController;
    private dataController: DataController;

    constructor(app: express.Application, db: DatabaseController) {
        this.api = Const.api;
        this.router = app;
        this.dbController = db;

        this.authController = new AuthenticationController(this.dbController);
        this.userController = new UserController(this.dbController);
        this.permController = new AuthorisationController(this.dbController);
        this.dataController = new DataController(this.dbController);
        this.createApi();

    }

    private createApi() {
        /**
         * Logika
         * Api ogólnodostępne
         */
        this.router.post(this.api + "login", this.authController.checkLoginAndPass, this.userController.login);
        this.router.post(this.api + "register", this.userController.signUp);
        this.router.get(this.api + "mailactivation/:token", this.userController.mailActivation);

        /**
         * Api dla zalogowanych
         */
        this.router.get(this.api + "doctor/appointment", this.permController.verifyUser, this.permController.checkRoleDoctor, this.dataController.getAllMyDoctorAppointments);
        this.router.get(this.api + "patient/appointment", this.permController.verifyUser, this.permController.checkRolePatient, this.dataController.getAllMyPatientAppointments);
        this.router.post(this.api + "appointment/new", this.permController.verifyUser, this.dataController.saveNewAppointment);
        this.router.put(this.api + "appointment/status", this.permController.verifyUser, this.permController.checkRoleDoctor, this.dataController.setAppointmentStatus);

        /**
         * Wystawienie publicznych htmli
         */
        this.router.use(express.static("./src/public", { index: false, extensions: ['html'] }));
        this.router.get('/', (req, res) => res.redirect('/index'));

        /**
         * Htmle statyczne prywatne
         */
        this.router.use("/user", this.permController.verifyUser, this.userController.staticDashboard); // Tutaj przekierowujemy na patient albo doctor
        this.router.use("/patient", this.permController.verifyUser, this.permController.checkRolePatient, express.static("./src/private/patient", {
            index: false,
            extensions: ['html']
        }));
        this.router.use("/doctor", this.permController.verifyUser, this.permController.checkRoleDoctor, express.static("./src/private/doctor", {
            index: false,
            extensions: ['html']
        }));

        /**
         * Błędy
         */
        this.router.use((req: Request, res: Response) => res.status(404).send("Strona nie istnieje (-_-)"))
        this.router.use((req: Request, res: Response) => res.status(500).send("Błąd który nie ma prawa wystąpić (-_-)"))
    }
}
