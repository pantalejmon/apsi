export class Const {
    private static port: any = process.env.PORT || 8080;
    private static _credentialPath = "./src/config/Credentials.ts";
    private static _api = "/api/";

    public static get api() {
        return Const._api;
    }
    public static get credentialPath() {
        return Const._credentialPath;
    }

    public static getPort(): number {
        return this.port;
    }
}
