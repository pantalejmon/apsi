import User from "../../database/entity/User";
import PasswordToken from "../../database/entity/PasswordToken";

export default class MailBuilder {
    public static createValidationMail(user: User): string {
        let content: string = `Witaj ${user.firstName} ${user.lastName} \n`
            + `\nOtrzymujesz tego maila ponieważ zarejestrowałeś się w systemie rejestracji pacjentów \n`
            + `W celu aktywacji konta prosimy o kliknięcie poniższego linku:\n`
            + `<a href="http://localhost:8080/api/mailactivation/${user.registrationToken}">Potwierdź rejestrację</a>`
            // + `[DOMENA]/api/mailactivation/${user.registrationToken}`
            + `\nPozdrawiamy`
            + `\nZespół APSI`;

        return content;
    }

    public static createPassChangeMail(user: User, token: PasswordToken): string {
        let content: string = `Witaj ${user.firstName} ${user.lastName} \n`
            + `\nOtrzymujesz tego maila ponieważ zmieniasz hasło w systemie rejestracji pacjentów \n`
            + `W celu zmiany hasła prosimy o kliknięcie poniższego linku:\n`
            + `<a href="http://localhost:8080/api/passchangelink/${token.token}">Potwierdź rejestrację</a>`
            // + `[DOMENA]/api/mailactivation/${user.registrationToken}`
            + `\nPozdrawiamy`
            + `\nZespół APSI`;

        return content;
    }
}