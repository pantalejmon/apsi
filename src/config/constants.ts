export class Const {
    private static port: any = process.env.PORT || 8080;
    public static getPort(): number {
        return this.port;
    }
}
