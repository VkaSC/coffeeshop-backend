import { Jwt } from "jsonwebtoken";
import * as bcryptjs from "bcryptjs";
import { getConnection } from "../database/database";

//procedimiento para el registro
const register = async (req, res) => {
    console.log(req.body);
    const name = req.body.name;
    const user = req.body.user;
    const pass = req.body.pass;
    console.log(name + "-" + user + "-" + pass);
}

export const methods = {
    register
};
