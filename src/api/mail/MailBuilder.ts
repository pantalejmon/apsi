import User from "../../database/entity/User";

export default class MailBuilder {
    public static createValidationMail(user: User): string {
        let content: string = `Witaj ${user.firstName} ${user.lastName} \n`
            + `\nOtrzymujesz tego maila ponieważ zarejestrowałeś się w systemie rejestracji pacjentów \n`
            + `W celu aktywacji konta prosimy o kliknięcie poniższego linku:\n`
            + `<p><a href="localhost:8080/api/mailactivation/${user.registrationToken}">Potwierdź rejestrację</a></p>`
            // + `[DOMENA]/api/mailactivation/${user.registrationToken}`
            + `\nPozdrawiamy`
            + `\nZespół APSI`;

        return content;
    }
}