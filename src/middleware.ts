import type { Request, Response, NextFunction } from "express";
import  Jwt  from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers['authorization'];
    if(!header){
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    try {
        const token = header.split(' ')[1] || header;
        const decoded = Jwt.verify(token, JWT_PASSWORD as string) as Jwt.JwtPayload;
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(403).json({
            message: "Unauthorized"
        });
    }
}