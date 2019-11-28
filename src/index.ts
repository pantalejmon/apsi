import Server from "./api/server";
import fs from "fs"
import { Const } from "./config/constants";
/**
 * Uruchomienie serwera
 */
if (fs.existsSync(Const.credentialPath)) new Server();
else console.log("Brak pliku z poświadczeniami");
