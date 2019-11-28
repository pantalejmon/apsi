import Server from "./api/Server";
import fs from "fs"
import { Const } from "./config/Constants";
/**
 * Uruchomienie serwera
 */
if (fs.existsSync(Const.credentialPath)) new Server();
else console.log("Brak pliku z poświadczeniami");
