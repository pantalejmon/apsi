import { Request, Response, NextFunction } from 'express';
import DatabaseController from '../../../database/DatabaseController';
import { Role } from '../../../database/util/Enums';
import express from "express"


export default class UserController {
    private dbController: DatabaseController;
    constructor(db: DatabaseController) {
        this.dbController = db;
    }

    public async login(req: Request, res: Response): Promise<void> {
        res.status(200).send({ token: req.session.token });
    }
    public async signUp(req: Request, res: Response): Promise<void> {

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
}