import express from 'express';
import DatabaseController from '../../../database/DatabaseController';


export default class UserController {
    private dbController: DatabaseController;
    constructor(db: DatabaseController) {
        this.dbController = db;
    }

    public async login(req: express.Request, res: express.Response): Promise<void> {
        // TODO: Add redirection after success login
    }
    public async signUp(req: express.Request, res: express.Response): Promise<void> {

    }
}