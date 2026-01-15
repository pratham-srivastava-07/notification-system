import { NextFunction, Request, Response } from "express";

const TENANTS = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Demo Tenant",
    apiKey: "test-api-key-123"
  }
];


export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("REQUEST HEADERS", req.headers)
        const apiKey = req.headers["x-api-key"];

        if(!apiKey) {
            return res.status(401).json({
                message: "Missing api key"
            })
        }

        const tenant_id = TENANTS.find(t => t.apiKey === apiKey);

        if(!tenant_id) {
            return res.status(401).json({
                message: "Tenant id does not exist"
            })
        }

        req.context = {
            tenant_id: tenant_id
        }

        next()
    } catch(er: any) {
        console.log(`An error occured in middleware ${er}`)
    }
}