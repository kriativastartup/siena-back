import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { hash_password } from "../helper/encryption";
import { validate } from "uuid";
import { generateRandomNumber } from "../helper/random";

const prisma = new PrismaClient();

export const criarDisciplina = async (req: Request | any, res: Response) => {
    const { nome, descricao, escola_id } = req.body;
    try {
        const existDisciplina = await prisma.disciplina.findFirst({
            where: {
                nome: nome,
                escola_id: escola_id
            },
        });

        if (existDisciplina) {
            return res.status(400).json({ message: "Disciplina com esse nome já existe nesta escola" });
        }

        if (!nome || !escola_id) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        const newDisciplina = await prisma.disciplina.create({
            data: {
                nome,
                descricao,
                escola_id: escola_id
            },
        });
        return res.status(201).json(newDisciplina);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao criar disciplina", error: error.message });
    }
}

export const getDisciplinas = async (req: Request, res: Response) => {
    const { escola_id } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const offset = (limit * (page - 1));

    if (!escola_id || !validate(escola_id)) {
        return res.status(400).json({ message: "ID de escola inválido" });
    }

    try {
        const disciplinas = await prisma.disciplina.findMany({
            where: { escola_id: escola_id },
            skip: offset,
            take: limit,
        });
        return res.status(200).json(disciplinas);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar disciplinas", error: error.message });
    }
};

export const getDisciplinaById = async (req: Request, res: Response) => {
    const { disciplina_id } = req.params;
    if (!disciplina_id || !validate(disciplina_id)) {
        return res.status(400).json({ message: "ID de disciplina inválido" });
    }
    try {
        const disciplina = await prisma.disciplina.findUnique({
            where: { id: disciplina_id },
        });
        if (!disciplina) {
            return res.status(404).json({ message: "Disciplina não encontrada" });
        }
        return res.status(200).json(disciplina);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar disciplina", error: error.message });
    }
};

export const updateDisciplina = async (req: Request, res: Response) => {
    const { disciplina_id } = req.params;
    const { nome, descricao } = req.body;
    if (!disciplina_id || !validate(disciplina_id)) {
        return res.status(400).json({ message: "ID de disciplina inválido" });
    }
    try {
        const existDisciplina = await prisma.disciplina.findUnique({
            where: { id: disciplina_id },
        });
        if (!existDisciplina) {
            return res.status(404).json({ message: "Disciplina não encontrada" });
        }

        const existOutraDisciplina = await prisma.disciplina.findFirst({
            where: {
                nome: nome,
                escola_id: existDisciplina.escola_id,
                NOT: { id: disciplina_id }
            },
        });

        if (existOutraDisciplina) {
            return res.status(400).json({ message: "Outra disciplina com esse nome já existe nesta escola" });
        }
        
        const updatedDisciplina = await prisma.disciplina.update({
            where: { id: disciplina_id },
            data: {
                nome: nome ? nome : existDisciplina.nome,
                descricao: descricao ? descricao : existDisciplina.descricao,
            },
        });
        return res.status(200).json(updatedDisciplina);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao atualizar disciplina", error: error.message });
    }
};

export const deleteDisciplina = async (req: Request, res: Response) => {
    const { disciplina_id } = req.params;

    if (!disciplina_id || !validate(disciplina_id)) {
        return res.status(400).json({ message: "ID de disciplina inválido" });
    }

    try {
        const existDisciplina = await prisma.disciplina.findUnique({
            where: { id: disciplina_id },
        });

        if (!existDisciplina) {
            return res.status(404).json({ message: "Disciplina não encontrada" });
        }

        await prisma.disciplina.delete({
            where: { id: disciplina_id },
        });

        return res.status(200).json({ message: "Disciplina deletada com sucesso" });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao deletar disciplina", error: error.message });
    }
}