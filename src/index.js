import app from "./app";
import Database from "./database/database"
const main=()=>{
    app.listen(app.get("port"));
    console.log('Server on port ${app.get("port")}');
    Database.getInstance().open();
    console.log('Database opened');
}; 

main();