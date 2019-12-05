import DatabaseController from "../../../database/DatabaseController";
import { NextFunction, Request, Response } from "express";
import User from "../../../database/entity/User";
import bcrypt from 'bcryptjs';
import { Role } from "../../../database/util/Enums";

export default class AuthenticationController {
    private dbController: DatabaseController;
    constructor(db: DatabaseController) {
        this.dbController = db;
    }
    public async check(req: Request, res: Response, next: NextFunction) {
        let email: string = req.body.email;
        let pass: string = req.body.pass;
        try {
            let user: User =
                await this.dbController.getPatientRepository().findOne({ where: { mail: email } }) ||
                await this.dbController.getDoctorRepository().findOne({ where: { mail: email } });

            if (user) {
                let status = await bcrypt.compare(pass, user.hashedPassword);
                if (status) {
                    req.session.role = await this.checkRole(user);
                    req.session.mail = user.mail
                    next();
                }
                else {
                    // Temporary answer:
                    res.send("Złe hasło")
                }
            }
        }
        catch (e) {
            console.log(e);
            res.send("Błąd serwera")
        }
    }

    private async checkRole(user: User): Promise<Role> {
        if (await this.dbController.getPatientRepository().findOne({ where: { mail: user.mail } })) return Role.PATIENT;
        else if (await this.dbController.getDoctorRepository().findOne({ where: { mail: user.mail } })) return Role.DOCTOR
        else return Role.UNKNOWN;
    }
}