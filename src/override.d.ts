export {};

declare global {
    namespace Express {
        export interface Request {
            userId?: string; // Adding an optional `userId` property to the Express Request interface.
        }
    }
}