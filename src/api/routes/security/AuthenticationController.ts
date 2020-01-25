import "reflect-metadata";
import DatabaseController from "../../../database/DatabaseController";
import { NextFunction, Request, Response } from "express";
import User from "../../../database/entity/User";
import bcrypt from 'bcryptjs';
import { Role, Errors } from "../../../database/util/Enums";
import * as jwt from "jsonwebtoken"
import httpstatus from "http-status-codes"

export default class AuthenticationController {
    private dbController: DatabaseController;
    constructor(db: DatabaseController) {
        this.dbController = db;
        this.checkLoginAndPass = this.checkLoginAndPass.bind(this);
        this.checkRole = this.checkRole.bind(this);
    }

    public async checkLoginAndPass(req: Request, res: Response, next: NextFunction) {
        if (!req.body.email || !req.body.password) res.status(httpstatus.UNAUTHORIZED).send({ error: Errors.WRONG_CREDENTIALS })
        let email: string = req.body.email;
        let pass: string = req.body.password;

        try {
            let user: User =
                await this.dbController.getPatientRepository().findOne({ where: { mail: email } }) ||
                await this.dbController.getDoctorRepository().findOne({ where: { mail: email } });

            if (user) {
                let status = await bcrypt.compare(pass, user.hashedPassword);
                if (status) {
                    req.session.role = await this.checkRole(user);
                    req.session.mail = user.mail;
                    req.session.userid = user.id;
                    req.session.token = jwt.sign({ mail: user.mail, role: req.session.role, userid: req.session.userid }, "tajnehaslo(pozniej_bedzie_z_credentiali)", {
                        expiresIn: 1000 * 60 * 30
                    })
                    next();

                }
                else {
                    // Temporary answer:
                    console.log("Niepoprawne hasło")
                    req.session.destroy((err) => console.log(err));
                    res.send({ error: Errors.WRONG_CREDENTIALS })
                }
            }
        }
        catch (e) {
            console.log(e);
            req.session.destroy((err) => console.log(err));
            res.send("Błąd serwera")
        }
    }

    public async checkToken(req: Request, res: Response, next: NextFunction) {

    }

    private async checkRole(user: User): Promise<Role> {
        if (await this.dbController.getPatientRepository().findOne({ where: { mail: user.mail } })) return Role.PATIENT;
        else if (await this.dbController.getDoctorRepository().findOne({ where: { mail: user.mail } })) return Role.DOCTOR
        else return Role.UNKNOWN;
    }
}