export class Const {
    private static port: any = process.env.PORT || 8080;
    private static _credentialPath = "./src/config/credentials.ts";

    public static get credentialPath() {
        return Const._credentialPath;
    }

    public static getPort(): number {
        return this.port;
    }
}
