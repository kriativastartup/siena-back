import { Request, Response } from "express";
import { PrismaClient, tipo_avaliacao_enum } from "../generated/prisma/client";
import { hash_password } from "../helper/encryption";
import { validate } from "uuid";

const prisma = new PrismaClient();

// REGIAO
export const addRegiao = async (req: Request | any, res: Response) => {
    const { nome, descricao, nivel } = req.body;
    if (!nome) {
        return res.status(400).json({ message: "Dados inválidos, preencha o campo nome" });
    }

    if (!nivel) {
        return res.status(400).json({ message: "Dados inválidos, preencha o campo nível" });
    }

    if (!["NACIONAL", "PROVINCIAL", "MUNICIPAL", "LOCAL"].includes(nivel)) {
        return res.status(400).json({ message: "Dados inválidos,  : NACIONAL, PROVINCIAL, MUNICIPAL, LOCAL" });
    }

    try {
        const existRegiao = await prisma.regiao.findFirst({
            where: {
                nome: nome
            }
        });

        if (existRegiao) {
            return res.status(400).json({ message: "Região com esse nome já existe" });
        }

        const newRegiao = await prisma.regiao.create({
            data: {
                nome: nome,
                descricao: descricao,
                nivel: nivel,
            },
        });
        return res.status(201).json(newRegiao);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao criar região", error: error.message });
    }
};

export const getRegioes = async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const offset = (limit * (page - 1));

    try {
        const regioes = await prisma.regiao.findMany({
            skip: offset,
            take: limit,
        });
        return res.status(200).json(regioes);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar regiões", error: error.message });
    }
};