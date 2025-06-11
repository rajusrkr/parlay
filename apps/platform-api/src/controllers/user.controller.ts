import { Request, Response } from "express";

const userRegister = async (req: Request, res: Response) => {
    console.log("gola");
    const body = req.body;
    console.log(body);
}


export { userRegister }