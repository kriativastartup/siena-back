import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { hash_password } from "../helper/encryption";
import { validate } from "uuid";

const prisma = new PrismaClient();

export const getAlunoLetivoById = async (req: Request, res: Response) => {
    const { anoId } = req.params;

    if (!anoId || !validate(anoId)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const alunoLetivo = await prisma.academic_year.findUnique({
            where: { id: anoId },
        });

        if (!alunoLetivo) {
            return res.status(404).json({ message: "Aluno Letivo não encontrado" });
        }

        return res.status(200).json(alunoLetivo);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar Aluno Letivo", error: error.message });
    }
};

export const createAnoLetivo = async (req: Request, res: Response) => {
    const { nome, data_de_inicio, data_de_fim, escola_id } = req.body;

    if (!nome || !data_de_inicio || !data_de_fim) {
        return res.status(400).json({ message: "Dados inválidos" });
    }

    if (!escola_id || validate(escola_id) === false) {
        return res.status(400).json({ message: "ID de escola inválido" });
    }

    const existEscola = await prisma.escola.findFirst({
        where: { id: escola_id },
    });

    if (!existEscola) {
        return res.status(404).json({ message: "Escola não encontrada" });
    }

    try {
        const existAnoLetivo = await prisma.academic_year.findFirst({
            where: { nome },
        });

        if (existAnoLetivo) {
            return res.status(404).json({ message: "Ano Letivo já existe" });
        }

        const newAnoLetivo = await prisma.academic_year.create({
            data: {
                nome,
                data_de_inicio : new Date(data_de_inicio),
                data_de_fim : new Date(data_de_fim),
                escola_id
            },
        });

        return res.status(201).json(newAnoLetivo);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao criar Ano Letivo", error: error.message });
    }
};

export const getAnosLetivos = async (req: Request, res: Response) => {
    try {
        const escola_id = req.params.escola_id as string;
        if (!escola_id || validate(escola_id) === false) {
            return res.status(400).json({ message: "ID de escola inválido" });
        }
        const existEscola = await prisma.escola.findFirst({
            where: { id: escola_id },
        });

        if (!existEscola) {
            return res.status(404).json({ message: "Escola não encontrada" });
        }
        const anosLetivos = await prisma.academic_year.findMany();
        return res.status(200).json(anosLetivos);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar Anos Letivos", error: error.message });
    }
};

export const updateAnoLetivo = async (req: Request, res: Response) => {
    const { anoId } = req.params;
    const { nome, data_de_inicio, data_de_fim } = req.body;

    if (!anoId || !validate(anoId)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const existAnoLetivo = await prisma.academic_year.findUnique({
            where: { id: anoId },
        });

        if (!existAnoLetivo) {
            return res.status(404).json({ message: "Ano Letivo não encontrado" });
        }

        const updatedAnoLetivo = await prisma.academic_year.update({
            where: { id: anoId },
            data: {
                nome: nome ? nome : existAnoLetivo.nome,
                data_de_inicio: data_de_inicio ? data_de_inicio : existAnoLetivo.data_de_inicio,
                data_de_fim: data_de_fim ? data_de_fim : existAnoLetivo.data_de_fim,
            },
        });

        return res.status(200).json(updatedAnoLetivo);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao atualizar Ano Letivo", error: error.message });
    }
};

export const deleteAnoLetivo = async (req: Request, res: Response) => {
    const { anoId } = req.params;

    if (!anoId || !validate(anoId)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const existAnoLetivo = await prisma.academic_year.findUnique({
            where: { id: anoId },
        });

        if (!existAnoLetivo) {
            return res.status(404).json({ message: "Ano Letivo não encontrado" });
        }

        await prisma.academic_year.delete({
            where: { id: anoId },
        });

        return res.status(200).json({ message: "Ano Letivo deletado com sucesso" });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao deletar Ano Letivo", error: error.message });
    }
};
