import express from "express"

declare global {
    namespace Express {
        interface Request {
            context?: {
                tenant_id: string | any;
            };
        }
    }
}