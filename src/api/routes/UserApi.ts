import express from 'express';
import DatabaseController from '../../database/DatabaseController';
import { Const } from '../../config/Constants';
import { NextFunction } from 'connect';
import AuthenticationController from './security/AuthenticationController';

export default class UserApi {
    private router: express.Application | undefined;
    private api: string;
    private dbController: DatabaseController;
    private authController: AuthenticationController;
    constructor(app: express.Application, db: DatabaseController) {
        this.api = Const.api;
        this.router = app;
        this.dbController = db;
        this.authController = new AuthenticationController(this.dbController);
        this.createApi();
    }

    private createApi() {
        /**
         * Logowanie do panelu lekarza
         */
        this.router.post(this.api + "login/doctor/", this.authController.checkDoctor, (req: express.Request, res: express.Response, next: express.NextFunction) => {
            // TODO: Add redirection after success login

        })
        /**
         * Logowanie do panelu pacjenta
         */
        this.router.post(this.api + "login/patient", this.authController.checkPatient, (req: express.Request, res: express.Response, next: express.NextFunction) => {
            // TODO: Add redirection after success login
        })
    }
}