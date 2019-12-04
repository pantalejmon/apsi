import DatabaseController from "../../../database/DatabaseController";
import { NextFunction, Request, Response } from "express";

export default class AuthenticationController {
    private dbController: DatabaseController;
    constructor(db: DatabaseController) {
        this.dbController = db;
    }
    public checkDoctor(req: Request, res: Response, next: NextFunction) {

        // TODO: Add implementation... 
        next();
    }

    public checkPatient(req: Request, res: Response, next: NextFunction) {

        // TODO: Add implementation... 
        next();
    }
}