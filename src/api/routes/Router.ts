import express from 'express';
import { Const } from '../../config/Constants';
import DatabaseController from '../../database/DatabaseController';
import AuthenticationController from './security/AuthenticationController';
import UserController from './controllers/UserController';
import AuthorisationController from './security/AuthorisationController';
import { Request, Response } from 'express-serve-static-core';

export default class Router {
    private router: express.Application | undefined;
    private api: string;
    private dbController: DatabaseController;
    private authController: AuthenticationController;
    private permController: AuthorisationController;
    private userController: UserController;
    constructor(app: express.Application, db: DatabaseController) {
        this.api = Const.api;
        this.router = app;
        this.dbController = db;
        this.authController = new AuthenticationController(this.dbController);
        this.userController = new UserController(this.dbController);
        this.permController = new AuthorisationController(this.dbController);
        this.createApi();
    }

    private createApi() {
        /**
         * Logika
         */
        this.router.post(this.api + "login", this.authController.checkLoginAndPass, this.userController.login);
        this.router.post(this.api + "register", this.userController.signUp);

        /**
         * Wystawienie publicznych htmli
         */
        this.router.use(express.static("./src/public", { index: false, extensions: ['html'] }));
        this.router.get('/', (req, res) => res.redirect('/index'));

        /**
         * Htmle statyczne prywatne
         */
        this.router.use("/user", this.permController.verifyUser, this.userController.staticDashboard); // Tutaj przekierowujemy na patient albo doctor
        this.router.use("/patient", this.permController.verifyUser, express.static("../../../private/patient", { index: false, extensions: ['html'] }));
        this.router.use("/doctor", this.permController.verifyUser, express.static("../../../private/doctor", { index: false, extensions: ['html'] }));

        /**
         * Błędy
         */
        this.router.use((req: Request, res: Response) => res.status(404).send("Strona nie istnieje (-_-)"))
        this.router.use((req: Request, res: Response) => res.status(500).send("Błąd który nie ma prawa wystąpić (-_-)"))
    }
}
