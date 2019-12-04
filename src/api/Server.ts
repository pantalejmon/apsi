import express from "express";
import bodyParser from "body-parser"
import { Const } from "../config/Constants";
import "reflect-metadata";
import DatabaseController from "../database/DatabaseController";
import { getConnection } from 'typeorm';
import { TypeormStore } from 'typeorm-store';
import * as session from 'express-session';
import Session from "../database/entity/Session"
import UserApi from "./routes/UserApi";
import helmet from 'helmet';


export default class Server {
    private app: express.Application;
    private userApi: UserApi;
    private dbController: DatabaseController;

    /**
     * Uruchomienie bazy danych
     */
    private databaseInit(): void {
        this.dbController = new DatabaseController(this.sessionInit());
    }

    /**
     * Konfiguracja sesji
     */
    private sessionInit(): void {
        const repository: any = getConnection().getRepository(Session);
        this.app.use(session({
            secret: 'secret',
            resave: false,
            saveUninitialized: false,
            store: new TypeormStore({ repository })
        }))
    }

    /**
     * Konfiguracja Api
     */
    private apiInit(): void {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(helmet());
        this.userApi = new UserApi(this.app, this.dbController)
    }

    /**
     * Konfiguracja statycznego hostingu
     */
    private publicInit(): void {
        this.app.use(express.static("./src/public", { index: false, extensions: ['html'] }));
        this.app.get('/', function (req, res) {
            res.redirect('/index');
        });
    }

    /**
     * Uruchomienie serwera
     */
    private serverStart(): void {
        this.app.listen(Const.getPort(), () => console.log(`Serwer started on port: ` + Const.getPort()))
    }

    constructor() {
        this.databaseInit();
        this.apiInit();
        this.publicInit();
        this.serverStart();
    }
}