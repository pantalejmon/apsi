import sendmail from "sendmail"
import User from "../../database/entity/User";
import MailBuilder from "./MailBuilder";
import PasswordToken from "../../database/entity/PasswordToken";
export default class MailController {

    public static ActivationMail(user: User) {
        const sender = sendmail({})
        sender({
            from: 'no-reply@apsi.com',
            to: user.mail,
            subject: 'Weryfikacja konta',
            html: MailBuilder.createValidationMail(user),
        }, function (err, reply) {
            console.log(err && err.stack);
            console.dir(reply);
        });
    }

    public static ChangePassMail(user: User, token: PasswordToken) {
        const sender = sendmail({})
        sender({
            from: 'no-reply@apsi.com',
            to: user.mail,
            subject: 'Zmiana hasła',
            html: MailBuilder.createPassChangeMail(user, token),
        }, function (err, reply) {
            console.log(err && err.stack);
            console.dir(reply);
        });
    }

}