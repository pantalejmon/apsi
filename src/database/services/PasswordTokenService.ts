import "reflect-metadata";
import PasswordToken from "../entity/PasswordToken";
import { Repository } from "typeorm";
import crypto from "crypto";
import User from "../entity/User";
import bcrypt from 'bcryptjs';
import DatabaseController from "../DatabaseController";
import e from "express";
import MailController from "../../api/mail/MailController";

export default class PasswordTokenService {
    private tokenRepository: Repository<PasswordToken>;
    private owner: DatabaseController;

    constructor(repo: Repository<PasswordToken>, owner: DatabaseController) {
        this.tokenRepository = repo;
        this.owner = owner;
        this.checkToken = this.checkToken.bind(this);
        this.getToken = this.getToken.bind(this)
        this.getTokenUser = this.getTokenUser.bind(this);
        this.changeUserPassword = this.changeUserPassword.bind(this);
    }

    /**
     * Generowanie nowego tokena lub otrzymanie ważnego tokena
     * @param mail Mail na jaki token ma być wygenerowany
     */
    public async getToken(mail: string): Promise<string> {
        let tokenModel = await this.tokenRepository.findOne({
            where: { user: { mail: mail } }
        })
        if (tokenModel && tokenModel.endDate > new Date().getTime()) {
            const user: User =
                await this.owner.getPatientRepository().findOne({ where: { mail: tokenModel.userMail } }) ||
                await this.owner.getDoctorRepository().findOne({ where: { mail: tokenModel.userMail } });
            MailController.ChangePassMail(user, tokenModel)
            return tokenModel.token;
        }
        else if (tokenModel) {
            await this.tokenRepository.remove(tokenModel);
            const token = crypto.randomBytes(64).toString('hex');
            const newToken: PasswordToken = new PasswordToken();
            newToken.endDate = new Date().getTime() + 1000 * 60 * 15;
            newToken.token = token
            newToken.userMail = tokenModel.userMail;
            this.tokenRepository.save(newToken);
            const user: User =
                await this.owner.getPatientRepository().findOne({ where: { mail: tokenModel.userMail } }) ||
                await this.owner.getDoctorRepository().findOne({ where: { mail: tokenModel.userMail } });
            MailController.ChangePassMail(user, newToken)
            return token;
        }
        else {
            const user: User =
                await this.owner.getPatientRepository().findOne({ where: { mail: mail } }) ||
                await this.owner.getDoctorRepository().findOne({ where: { mail: mail } });
            if (user) {
                const token = crypto.randomBytes(64).toString('hex');
                const newToken: PasswordToken = new PasswordToken();
                newToken.endDate = new Date().getTime() + 1000 * 60 * 15;
                newToken.token = token
                newToken.userMail = user.mail;
                this.tokenRepository.save(newToken);
                MailController.ChangePassMail(user, newToken)
                return token;
            }
        }
    }

    /**
     * Sprawdzenie czy dany token jest ważny
     * @param token token sprawdzany
     * @param mail mail sprawdzany
     */
    // public async checkToken(token: string, mail: string): Promise<boolean> {
    //     let tokenModel = await this.tokenRepository.findOne({
    //         where: { token: token, userMail: mail }
    //     })
    //     if (tokenModel && tokenModel.endDate > new Date().getTime()) return true;
    //     else return false;
    // }

    /**
     * Sprawdzenie czy dany token jest ważny
     * @param token token sprawdzany
     * @param mail mail sprawdzany
     */
    public async checkToken(token: string): Promise<boolean> {
        let tokenModel = await this.tokenRepository.findOne({
            where: { token: token }
        })
        if (tokenModel && tokenModel.endDate > new Date().getTime()) return true;
        else return false;
    }

    public async getTokenUser(token: String): Promise<User> {
        let tokenModel = await this.tokenRepository.findOne({
            where: { token: token }
        })
        const user =
            await this.owner.getPatientRepository().findOne({ where: { mail: tokenModel.userMail } }) ||
            await this.owner.getDoctorRepository().findOne({ where: { mail: tokenModel.userMail } });
        return user;
    }

    public async changeUserPassword(mail: string, password: string) {
        const patient = await this.owner.getPatientRepository().findOne({ where: { mail: mail } });
        const doctor = await this.owner.getDoctorRepository().findOne({ where: { mail: mail } });
        if (!patient && !doctor) return false;
        if (doctor) {
            doctor.hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
            await this.owner.getDoctorRepository().save(doctor)
        }
        if (patient) {
            patient.hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
            await this.owner.getPatientRepository().save(patient)
        }
        return true;


    }
}