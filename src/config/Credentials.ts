export default class Credentials {
    private static _dbHost: string = "ec2-46-137-120-243.eu-west-1.compute.amazonaws.com";
    private static _dbPort: number = 5432;
    private static _dbUsername: string = "sxggylyddrdxts";
    private static _dbPassword: string = "826249048194d45139c52ad103c6246fd46ed46f85234b49f77c4f359591d5ca";
    private static _dbname: string = "d7rqdud7ms428f";

    public static get dbHost(): string { return Credentials._dbHost; }
    public static get dbname(): string { return Credentials._dbname; }
    public static get dbPort(): number { return Credentials._dbPort; }
    public static get dbUsername(): string { return Credentials._dbUsername; }
    public static get dbPassword(): string { return Credentials._dbPassword; }
}