import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma/client";
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
        const decoded = jwt.verify(token, jwtSecret) as any;
        (async () => {
            const user = await prisma.usuario.findFirst({
                where: {
                    id: decoded.id,
                },
            });
            if (!user) {
                res.status(401).json({
                    message: "Usuário não encontrado. Por favor, faça login novamente."
                });
                return;
            }
            req.userId = user.id;
            console.log("Authenticated user ID:", user.id);
            if (user.ativo === false) {
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

export const verifyAuthenticationAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            message: "Usuário não autenticado. Por favor, faça login."
        });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, jwtSecret) as { id: string; username: string; email: string; role: string };
        (req as any).userId = decoded.id;
        (async () => {
            const user = await prisma.usuario.findFirst({
                where: {
                    id: decoded.id,
                },
            });
            if (!user) {
                res.status(401).json({
                    message: "Usuário não encontrado. Por favor, faça login novamente."
                });
                return;
            }

            if (user.tipo_usuario !== "ADMIN") {
                res.status(403).json({
                    message: "Acesso negado. Permissões insuficientes."
                });
                return;
            }
            if (user.ativo === false) {
                res.status(400).json({
                    message: "Conta inativa. Por favor, ative sua conta."
                });
                return;
            }
        })();
    } catch (error) {
        res.status(401).json({
            message: "Usuário não autenticado. Por favor, faça login."
        });
        return;
    }
    next();
};

export const verifyAuthenticationAdminSuper = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            message: "Usuário não autenticado. Por favor, faça login."
        });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, jwtSecret) as { id: string; username: string; email: string; role: string };
        (req as any).userId = decoded.id;
        (async () => {
            const user = await prisma.usuario.findFirst({
                where: {
                    id: decoded.id,
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
                    message: "Acesso negado. Permissões insuficientes."
                });
                return;
            }
            if (user.ativo === false) {
                res.status(400).json({
                    message: "Conta inativa. Por favor, ative sua conta."
                });
                return;
            }
        })();
    } catch (error) {
        res.status(401).json({
            message: "Usuário não autenticado. Por favor, faça login."
        });
        return;
    }
    next();
};


export const verifyAuthenticationGerencia = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            message: "Usuário não autenticado. Por favor, faça login."
        });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, jwtSecret) as { id: string; username: string; email: string; role: string };
        (req as any).userId = decoded.id;
        (async () => {
            const user = await prisma.usuario.findFirst({
                where: {
                    id: decoded.id,
                },
            });
            if (!user) {
                res.status(401).json({
                    message: "Usuário não encontrado. Por favor, faça login novamente."
                });
                return;
            }

            if (user.tipo_usuario !== "SECRETARIA" && user.tipo_usuario !== "COORDENADOR" && user.tipo_usuario !== "DIRETOR" && user.tipo_usuario !== "ADMIN") {
                res.status(403).json({
                    message: "Acesso negado. Permissões insuficientes."
                });
                return;
            }
            if (user.ativo === false) {
                res.status(400).json({
                    message: "Conta inativa. Por favor, ative sua conta."
                });
                return;
            }
        })();
    } catch (error) {
        res.status(401).json({
            message: "Usuário não autenticado. Por favor, faça login."
        });
        return;
    }
    next();
};

export const verifyAuthenticationProf = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            message: "Usuário não autenticado. Por favor, faça login."
        });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, jwtSecret) as { id: string; username: string; email: string; role: string };
        (req as any).userId = decoded.id;
        (async () => {
            const user = await prisma.usuario.findFirst({
                where: {
                    id: decoded.id,
                },
            });
            if (!user) {
                res.status(401).json({
                    message: "Usuário não encontrado. Por favor, faça login novamente."
                });
                return;
            }

            if (user.tipo_usuario !== "PROFESSOR" && user.tipo_usuario !== "ADMIN") {
                res.status(403).json({
                    message: "Acesso negado. Permissões insuficientes."
                });
                return;
            }
            if (user.ativo === false) {
                res.status(400).json({
                    message: "Conta inativa. Por favor, ative sua conta."
                });
                return;
            }
        })();
    } catch (error) {
        res.status(401).json({
            message: "Usuário não autenticado. Por favor, faça login."
        });
        return;
    }
    next();
};