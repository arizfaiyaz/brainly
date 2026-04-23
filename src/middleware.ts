import type { Request, Response, NextFunction } from "express";
import  Jwt  from "jsonwebtoken";
const JWT_PASSWORD = process.env.JWT_PASSWORD;

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers['authorization'];
    const decoded = Jwt.verify(header as string, JWT_PASSWORD as string);
    if(decoded) {
        //@ts-ignore
        req.userId = decoded.id
        next();
    } else {
        res.status(403).json({
            message: "not logged in"
        });
    }
}