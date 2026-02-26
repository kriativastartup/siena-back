import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const jwtSecret = process.env.JWT_SECRET as string;

export const verifyAuthentication = (req: Request | any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            message: "Usuário não autenticado. Por favor, faça login."
        });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, jwtSecret) as { userId: string; tipo_usuario: string };
        (async () => {
            const user = await prisma.usuario.findFirst({
                where: {
                    id: decoded.userId,
                },
            });
            if (!user) {
                res.status(401).json({
                    message: "Usuário não encontrado. Por favor, faça login novamente."
                });
                return;
            }

            req.userId = user.id;
            if (user.estado === "BLOQUEADO") {
                res.status(400).json({
                    message: "Conta inativa. Por favor, ative sua conta."
                });
                return;
            }
            next();
        })();
    } catch (error: any) {
        res.status(401).json({
            message: "Usuário não autenticado. Por favor, faça login."
        });
        return;
    }
};

export const verifyAuthenticationMasterSchool = (req: Request | any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            message: "Usuário não autenticado. Por favor, faça login."
        });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, jwtSecret) as { userId: string; tipo_usuario: string };
        (async () => {
            const user = await prisma.usuario.findFirst({
                where: {
                    id: decoded.userId,
                },
            });
            if (!user) {
                res.status(401).json({
                    message: "Usuário não encontrado. Por favor, faça login novamente."
                });
                return;
            }

            if (user.tipo_usuario !== "ADMIN_ESCOLA"
                && user.tipo_usuario !== "DIRETOR"
            ) {
                res.status(403).json({
                    message: "Acesso negado. Você não tem permissão para acessar este recurso."
                });
                return;
            }
            req.userId = user.id;
            if (user.estado === "BLOQUEADO") {
                res.status(400).json({
                    message: "Conta inativa. Por favor, ative sua conta."
                });
                return;
            }
            next();
        })();
    } catch (error: any) {
        res.status(401).json({
            message: "Usuário não autenticado. Por favor, faça login."
        });
        return;
    }
};



export const verifyAuthenticationSuperAdmin = (req: Request | any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            message: "Usuário não autenticado. Por favor, faça login."
        });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, jwtSecret) as { userId: string; tipo_usuario: string };
        (async () => {
            const user = await prisma.usuario.findFirst({
                where: {
                    id: decoded.userId,
                },
            });
            if (!user) {
                res.status(401).json({
                    message: "Usuário não encontrado. Por favor, faça login novamente."
                });
                return;
            }

            if (user.tipo_usuario !== "SUPER_ADMIN") {
                res.status(403).json({
                    message: "Acesso negado. Você não tem permissão para acessar este recurso."
                });
                return;
            }
            req.userId = user.id;
            if (user.estado === "BLOQUEADO") {
                res.status(400).json({
                    message: "Conta inativa. Por favor, ative sua conta."
                });
                return;
            }
            next();
        })();
    } catch (error: any) {
        res.status(401).json({
            message: "Usuário não autenticado. Por favor, faça login."
        });
        return;
    }
};

export const verifyAuthenticationSchool = (req: Request | any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            message: "Usuário não autenticado. Por favor, faça login."
        });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, jwtSecret) as { userId: string; tipo_usuario: string };
        (async () => {
            const user = await prisma.usuario.findFirst({
                where: {
                    id: decoded.userId,
                },
            });
            if (!user) {
                res.status(401).json({
                    message: "Usuário não encontrado. Por favor, faça login novamente."
                });
                return;
            }

            if (user.tipo_usuario !== "ADMIN_ESCOLA"
                && user.tipo_usuario !== "SECRETARIA"
                && user.tipo_usuario !== "COORDENADOR"
                && user.tipo_usuario !== "DIRETOR"
                && user.tipo_usuario !== "PROFESSOR"
                
            ) {
                res.status(403).json({
                    message: "Acesso negado. Você não tem permissão para acessar este recurso."
                });
                return;
            }
            req.userId = user.id;
           if (user.estado === "BLOQUEADO") {
                res.status(400).json({
                    message: "Conta inativa. Por favor, ative sua conta."
                });
                return;
            }
            next();
        })();
    } catch (error: any) {
        res.status(401).json({
            message: "Usuário não autenticado. Por favor, faça login."
        });
        return;
    }
};


