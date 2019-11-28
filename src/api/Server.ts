import express from "express";
import bodyParser from "body-parser"
import { Const } from "../config/Constants";
import "reflect-metadata";
import DatabaseController from "../database/DatabaseController";

export default class Server {
    private app: express.Application;
    private db: DatabaseController;
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(express.static("./src/public", { index: false, extensions: ['html'] }));
        this.app.get('/', function (req, res) {
            res.redirect('/index');
        });
        this.app.listen(Const.getPort(), () => console.log(`Serwer started at port: ${Const.getPort()}`));
        this.db = new DatabaseController();
    }
}