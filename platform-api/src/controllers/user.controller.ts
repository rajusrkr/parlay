import { Request, Response } from "express";
import {registerUserSchema} from "../../../shared/src/validators/user.schema"

const userRegistration = async (req: Request, res: Response) => {
    const data = req.body
    // do zod validation here
    const parseRes = registerUserSchema.safeParse(req.body)

    console.log(parseRes);
    
}


export { userRegistration }