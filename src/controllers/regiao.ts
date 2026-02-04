import { Request, Response } from "express";
import { PrismaClient, tipo_avaliacao_enum } from "../generated/prisma/client";
import { hash_password } from "../helper/encryption";
import { validate } from "uuid";

const prisma = new PrismaClient();

// REGIAO
export const criarRegiao = async (req: Request | any, res: Response) => {
    const { nome, descricao, nivel } = req.body;
    if (!nome) {
        return res.status(400).json({ message: "Dados inválidos, preencha o campo nome" });
    }

    if (!nivel) {
        return res.status(400).json({ message: "Dados inválidos, preencha o campo nível" });
    }

    if (!["NACIONAL", "PROVINCIAL", "MUNICIPAL", "LOCAL"].includes(nivel)) {
        return res.status(400).json({ message: "Nível inválido, níveis possíveis: NACIONAL, PROVINCIAL, MUNICIPAL, LOCAL" });
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

export const getRegiaoById = async (req: Request, res: Response) => {
    const { regiao_id } = req.params;

    if (!validate(regiao_id)) {
        return res.status(400).json({ message: "ID de região inválido" });
    }

    try {
        const regiao = await prisma.regiao.findUnique({
            where: {
                id: regiao_id,
            },
        });

        if (!regiao) {
            return res.status(404).json({ message: "Região não encontrada" });
        }

        return res.status(200).json(regiao);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar região", error: error.message });
    }
};

export const updateRegiao = async (req: Request, res: Response) => {
    const { regiao_id } = req.params;
    const { nome, descricao, nivel } = req.body;

    if (!validate(regiao_id)) {
        return res.status(400).json({ message: "ID de região inválido" });
    }

    try {
        const regiao = await prisma.regiao.findFirst({
            where: {
                id: regiao_id,
            },
        });

        if (!regiao) {
            return res.status(404).json({ message: "Região não encontrada" });
        }

        if (nivel && !["NACIONAL", "PROVINCIAL", "MUNICIPAL", "LOCAL"].includes(nivel)) {
            return res.status(400).json({ message: "Nível inválido, níveis possíveis: NACIONAL, PROVINCIAL, MUNICIPAL, LOCAL" });
        }

        const updatedRegiao = await prisma.regiao.update({
            where: {
                id: regiao_id,
            },
            data: {
                nome: nome || regiao.nome,
                descricao: descricao || regiao.descricao,
                nivel: nivel || regiao.nivel,
            },
        });

        return res.status(200).json(updatedRegiao);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao atualizar região", error: error.message });
    }
};

export const deleteRegiao = async (req: Request, res: Response) => {
    const { regiao_id } = req.params;

    if (!validate(regiao_id)) {
        return res.status(400).json({ message: "ID de região inválido" });
    }

    try {
        const regiao = await prisma.regiao.findUnique({
            where: {
                id: regiao_id,
            },
        });

        if (!regiao) {
            return res.status(404).json({ message: "Região não encontrada" });
        }

        await prisma.escola_regiao.deleteMany({
            where: {
                regiao_id: regiao_id,
            },
        });

        await prisma.regiao.delete({
            where: {
                id: regiao_id,
            },
        });

        return res.status(200).json({ message: "Região deletada com sucesso" });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao deletar região", error: error.message });
    }   
};


export const assignRegiaoToEscola = async (req: Request, res: Response) => {
    const { escola_id, regiao_id } = req.body;

    if (!escola_id || !validate(escola_id)) {
        return res.status(400).json({ message: "ID de escola inválido" });
    }

    if (!regiao_id || !validate(regiao_id)) {
        return res.status(400).json({ message: "ID de região inválido" });
    }
    try {
        const existEscola = await prisma.escola.findFirst({
            where: { id: escola_id },
        });
        if (!existEscola) {
            return res.status(404).json({ message: "Escola não encontrada" });
        }

        const existRegiao = await prisma.regiao.findFirst({
            where: { id: regiao_id },
        });
        if (!existRegiao) {
            return res.status(404).json({ message: "Região não encontrada" });
        }
        const existAssignment = await prisma.escola_regiao.findFirst({
            where: {
                escola_id: escola_id,
                regiao_id: regiao_id,
            },
        });

        if (existAssignment) {
            return res.status(400).json({ message: `A Região ${existRegiao.nome} já está atribuída a escola ${existEscola.nome}` });
        }

        await prisma.escola_regiao.create({
            data: {
                escola_id: escola_id,
                regiao_id: regiao_id,
            },
        });
        return res.json({ message: `Região ${existRegiao.nome} atribuída à escola ${existEscola.nome} com sucesso` });
    } catch (error) {
        console.error("Erro ao atribuir região à escola:", error);
    }
};

export const unassignRegiaoFromEscola = async (req: Request, res: Response) => {
    const { escola_id, regiao_id } = req.body;

    if (!escola_id || !validate(escola_id)) {
        return res.status(400).json({ message: "ID de escola inválido" });
    }

    if (!regiao_id || !validate(regiao_id)) {
        return res.status(400).json({ message: "ID de região inválido" });
    }

    try {
        const existEscola = await prisma.escola.findFirst({
            where: { id: escola_id },
        });
        if (!existEscola) {
            return res.status(404).json({ message: "Escola não encontrada" });
        }
        
        const existRegiao = await prisma.regiao.findFirst({
            where: { id: regiao_id },
        });
        if (!existRegiao) {
            return res.status(404).json({ message: "Região não encontrada" });
        }
        const existAssignment = await prisma.escola_regiao.findFirst({
            where: {
                escola_id: escola_id,
                regiao_id: regiao_id,
            },
        });

        if (!existAssignment) {
            return res.status(404).json({ message: `A Região ${existRegiao.nome} não está atribuída à escola ${existEscola.nome}` });
        }

        await prisma.escola_regiao.delete({
            where: {
                id: existAssignment.id,
            },
        });

        return res.json({ message: `Região ${existRegiao.nome} desvinculada da escola 
            ${existEscola.nome} com sucesso` });
    } catch (error) {
        console.error("Erro ao desvincular região da escola:", error);
    }
};