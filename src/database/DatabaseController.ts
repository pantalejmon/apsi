import { createConnection, Connection } from 'typeorm';
import 'reflect-metadata';
import { User } from './entity/User';
import { Patient } from './entity/Patient';
import { Doctor } from './entity/Doctor';
import Credentials from '../config/Credentials';
export default class DatabaseController {
    private connection: Connection
    constructor() {
        createConnection({
            type: "postgres",
            host: Credentials.dbHost,
            port: Credentials.dbPort,
            username: Credentials.dbUsername,
            password: Credentials.dbPassword,
            database: Credentials.dbname,
            entities: [
                "./dist/database/**/*.js"
            ],
            extra: {
                ssl: true
            },
            synchronize: true,
            logging: false
        })
            .then((connection) => {
                this.connection = connection
            })
            .catch((error) => console.log(error));
    }
}