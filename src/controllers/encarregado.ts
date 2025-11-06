import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { hash_password } from "../helper/encryption";
import { validate } from "uuid";

const prisma = new PrismaClient();

export const getEncarregados = async (req: Request, res: Response) => {
    try {
        const escola_id = req.params.escolaId as string;
        if (!escola_id || validate(escola_id)) {
            return res.status(400).json({
                message: "O ID da escola é inválido"
            });
        }

        const existEscola = await prisma.escola.findFirst({
            where: {
                id: escola_id
            }
        });

        if (!existEscola) {
            return res.status(404).json({
                message: "Escola não encontrada"
            });
        }

        const encarregados = await prisma.encarregado.findMany({
            where: {
                escola_id: escola_id
            }
        });
        return res.status(200).json(encarregados);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar encarregados", error: error.message });
    }
}

export const createEncarregado = async (req: Request | any, res: Response) => {
    const { nome_completo, email, senha, telefone, grau_parentesco, profissao, escola_id } = req.body;
    try {
        if (!nome_completo || !email || !senha) {
            return res.status(400).json({ message: "Nome completo, email e senha são obrigatórios" });
        }

        if (!escola_id || validate(escola_id)) {
            return res.status(400).json({
                message: "O ID da escola é inválido"
            });
        }

        const hashedPassword = await hash_password(senha);

        const newUsuario = await prisma.usuario.create({
            data: {
                nome_completo,
                email,
                senha_hash: hashedPassword,
                tipo_usuario: "ENCARREGADO",
            },
        });

        const newEncarregado = await prisma.encarregado.create({
            data: {
                usuario_id: newUsuario.id,
                telefone,
                grau_parentesco,
                profissao,
                escola_id
            },
        });
        
        return res.status(201).json({
            ...newEncarregado,
            nome_completo: newUsuario.nome_completo,
            email: newUsuario.email,
            tipo_usuario: newUsuario.tipo_usuario
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao criar encarregado", error: error.message });
    }
};

export const getEncarregadoById = async (req : Request | any, res : Response) => {

}

export const updateEncarregadoById = async (req : Request | any, res : Response) => {

}
