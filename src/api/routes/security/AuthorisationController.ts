import DatabaseController from "../../../database/DatabaseController";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken"

/**
 * Kontroler autoryzacji użytkowników.
 */
export default class AuthorisationController {
    private dbController: DatabaseController;

    constructor(db: DatabaseController) {
        this.dbController = db;
    }

    /**
     * Metoda weryfikująca czy dany użytkownik posiada token(Np w aktywnej sesji i w przypadku posiadania przekierowuje go dalej)
     * @param req 
     * @param res 
     * @param next 
     */
    public verifyUser(req: Request, res: Response, next: NextFunction) {
        let token: string = req.headers['x-access-token'] || req.headers['authorization'] || req.session.token; // Express headers are auto converted to lowercase
        if (token) {
            if (token.startsWith('Bearer ')) token = token.slice(7, token.length);

            jwt.verify(token, "tajnehaslo(pozniej_bedzie_z_credentiali)", (err, decoded: any) => {
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

        else {
            res.location("brak/dostepu/xd");
            res.send("Nie masz dostępu do prywatnej strony, zaloguj się najpierw :)");
        }
    }
}