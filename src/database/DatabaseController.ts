import { createConnection, Connection } from 'typeorm';
import 'reflect-metadata';
import { User } from './entity/User';
export default class DatabaseController {
    private connection: Connection
    constructor() {
        createConnection()
            .then((connection) => {
                this.connection = connection
                const test: User = new User();
                this.connection.manager.save(test);
            })
            .catch((error) => console.log(error));
    }
}