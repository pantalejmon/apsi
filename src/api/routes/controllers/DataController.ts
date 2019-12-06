import * as express from 'express';
import DatabaseController from '../../../database/DatabaseController';
import { Const } from '../../../config/Constants';
import { Appointment } from '../../../database/entity/Appointment';

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

}