import User from "../../database/entity/User";

export default class MailBuilder {
    public static createValidationMail(user: User): string {
        let content: string = `Witaj ${user.firstName} ${user.lastName} \n`
            + `Otrzymujesz tego maila ponieważ zarejestrowałeś się w systemie rejestracji pacjentów \n`
            + `W celu aktywacji konta prosimy o kliknięcie poniższego linku:\n`
            + `[DOMENA]/api/mailactivation/${user.registrationToken}`
            + `Pozdrawiamy`
            + `Zespół APSI`;

        return content;
    }
}