import express from "express";
import bodyParser from "body-parser"
import { Const } from "../config/Constants";
import "reflect-metadata";
import DatabaseController from "../database/DatabaseController";
import { getConnection } from 'typeorm';
import { TypeormStore } from 'typeorm-store';
import session from 'express-session';
import Session from "../database/entity/Session"
import UserApi from "./routes/controllers/UserController";
import helmet from 'helmet';
import Router from "./routes/Router";

/**
 * Klasa główna serwera aplikacji
 */
export default class Server {
    private app: express.Application;
    private router: Router
    private dbController: DatabaseController;

    /**
     * Uruchomienie bazy danych
     */
    private databaseInit(): void {
        this.dbController = new DatabaseController(this);
    }

    /**
     * Konfiguracja sesji
     */
    public sessionInit(): void {
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
    public apiInit(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(helmet());
        this.router = new Router(this.app, this.dbController)
    }

    /**
     * Konfiguracja statycznego hostingu
     */
    public publicInit(): void {
        this.app.use(express.static("./src/public", { index: false, extensions: ['html'] }));
        this.app.get('/', function (req, res) {
            res.redirect('/index');
        });
    }

    /**
     * Uruchomienie serwera
     */
    public serverStart(): void {
        this.app.listen(Const.getPort(), () => console.log(`Serwer started on port: ` + Const.getPort()))
    }



    constructor() {
        this.app = express();
        this.databaseInit();

    }
}