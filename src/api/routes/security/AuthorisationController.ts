import DatabaseController from "../../../database/DatabaseController";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken"
export default class AuthorisationController {
    private dbController: DatabaseController;
    constructor(db: DatabaseController) {
        this.dbController = db;
    }
    public verifyUser(req: Request, res: Response, next: NextFunction) {
        let token: any = req.headers['x-access-token'] || req.headers['authorization'] || req!.session!.token; // Express headers are auto converted to lowercase
        if (token.startsWith('Bearer ')) token = token.slice(7, token.length);
        jwt.verify(token, "tajnehaslo(pozniej_bedzie_z_credentiali)", (err, decoded) => {
            if (err) {
                req.session.destroy((err) => console.log(err));
                res.redirect("/");
            }
            else {
                if (req.session.mail !== decoded.mail) req.session.mail = decoded.mail
                if (req.session.role !== decoded.role) req.session.role = decoded.role
                next();
            }
        })
    }
}