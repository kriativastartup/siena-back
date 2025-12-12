import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { hash_password, compare_password } from "../helper/encryption";
import { validate } from "uuid";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: "Email e senha são obrigatórios" });
    }
    try {
        const user = await prisma.usuario.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res.status(401).json({ message: "Usuário ou senha inválida" });
        }
        const isPasswordValid = await compare_password(senha, user.senha_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Usuário ou senha inválida" });
        }

        console.log("Usuário autenticado:", user.id);

        const token = jwt.sign(
            { userId: user.id, tipo_usuario: user.tipo_usuario },
            process.env.JWT_SECRET || "default_secret"
        );

        return res.status(200).json({ message: "Login bem-sucedido", token});
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao realizar login", error: error.message });
    }
};