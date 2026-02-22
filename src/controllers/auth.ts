import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hash_password, compare_password } from "../helper/encryption";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: "Email e senha são obrigatórios" });
    }
    try {
        const pessoa = await prisma.pessoa.findUnique({
            where: {
                email: email,
            },
        });
        if (!pessoa) {
            return res.status(401).json({ message: "Usuário ou senha inválida" });
        }

        const user = await prisma.usuario.findFirst({
            where: {
                pessoa_id: pessoa.id,
            },
        });

        if (!user) {
            return res.status(401).json({ message: "Usuário ou senha inválida" });
        }
        const isPasswordValid = await compare_password(senha, user.senha_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Usuário ou senha inválida" });
        }

        const payload = {
            userId: user.id,
            tipo_usuario: user.tipo_usuario,
        };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || "default_secret"
        );

        return res.status(200).json({ message: "Login bem-sucedido", token});
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao realizar login", error: error.message });
    }
};