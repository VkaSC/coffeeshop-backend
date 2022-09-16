import { Jwt } from "jsonwebtoken";
import * as bcryptjs from "bcryptjs";
import { getConnection } from "../database/database";

//procedimiento para el registro
const singUp = async (req, res) => {
    const { name, user, pass } = req.body;
    
}

export const methods = {
    singUp
};
