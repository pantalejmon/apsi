import { createConnection, Connection } from 'typeorm';
import 'reflect-metadata';
import { User } from './entity/User';
import Credentials from '../config/Credentials';
import Server from '../api/Server';
export default class DatabaseController {

    private connection: Connection
    constructor(owner: Server) {

        createConnection({
            type: "postgres",
            host: Credentials.dbHost,
            port: Credentials.dbPort,
            username: Credentials.dbUsername,
            password: Credentials.dbPassword,
            database: Credentials.dbname,
            entities: [
                "./dist/database/entity/*.js"
            ],
            extra: {
                ssl: true
            },
            synchronize: true,
            logging: false
        }).then((connection) => {
            this.connection = connection;
            owner.sessionInit();
        }).catch((error) => {
            console.log(error)
        });
        console.log("Utworzono dbcontroller");
    }

}