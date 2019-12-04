import express from 'express';
import { Const } from '../../config/Constants';
import DatabaseController from '../../database/DatabaseController';
import AuthenticationController from './security/AuthenticationController';
import UserController from './controllers/UserController';

export default class Router {
    private router: express.Application | undefined;
    private api: string;
    private dbController: DatabaseController;
    private authController: AuthenticationController;
    private userController: UserController;
    constructor(app: express.Application, db: DatabaseController) {
        this.api = Const.api;
        this.router = app;
        this.dbController = db;
        this.authController = new AuthenticationController(this.dbController);
        this.userController = new UserController(this.dbController);
        this.createApi();
    }

    private createApi() {
        this.router.post(this.api + "login/", this.authController.check, this.userController.login);
    }
}
