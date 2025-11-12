import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { hash_password } from "../helper/encryption";
import { validate } from "uuid";


const prisma = new PrismaClient();

export const getTurmas = async (req: Request, res: Response) => {
    try {
        const escolaId = req.params.escola_id as string;
        const limit = parseInt(req.query.limit as string) || 100;
        const page = parseInt(req.query.page as string) || 1;
        const offset = (page - 1) * limit;
        if (!escolaId || !validate(escolaId)) {
            return res.status(400).json({ message: "ID de escola inválido" });
        }

        const existEscola = await prisma.escola.findUnique({
            where: {
                id: escolaId
            }
        });

        if (!existEscola) {
            return res.status(404).json({ message: "Escola não encontrada" });
        }

        const turmas = await prisma.turma.findMany({
            where: { escola_id: escolaId },
            skip: offset,
            take: limit
        });
        return res.status(200).json(turmas);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar turmas", error: error.message });
    }
}

export const createTurma = async (req: Request | any, res: Response) => {
    const { nome, ano_escolaridade, capacidade_maxima, escola_id, ano_letivo } = req.body;
    try {
        if (!nome || !ano_escolaridade) {
            return res.status(400).json({ message: "O  nome da turma e o ano de escolaridade são obrigatórios" });
        }

        if (!capacidade_maxima || typeof capacidade_maxima !== 'number' || capacidade_maxima <= 0) {
            return res.status(400).json({
                message: "A capacidade máxima deve ser um número inteiro"
            });
        }

        if (typeof ano_escolaridade !== 'number' || ano_escolaridade < 1 || ano_escolaridade > 13) {
            return res.status(400).json({
                message: "O ano de escolaridade deve ser um número entre 1 e 13"
            });
        }

        if (!escola_id || !validate(escola_id)) {
            return res.status(400).json({
                message: "O ID da escola é inválido"
            });
        }

        if (!ano_letivo) {
            return res.status(400).json({
                message: "O ano letivo é obrigatório"
            });
        }

        console.log("capacidade maxima:", capacidade_maxima);

        const existTurma = await prisma.turma.findFirst({
            where: {
                nome: nome,
                escola_id: escola_id,
                ano_escolaridade: ano_escolaridade
            }
        });

        if (existTurma) {
            return res.status(400).json({
                message: "Já existe uma turma com esse nome nesta escola"
            });
        }

        const exitAnoLetivo = await prisma.academic_year.findFirst({
            where: {
                nome: ano_letivo,
                escola_id: escola_id
            }
        });

        if (!exitAnoLetivo || !exitAnoLetivo.nome) {
            return res.status(400).json({
                message: "Ano letivo não encontrado ou o seu nome não especificado"
            });
        }

        const newTurma = await prisma.turma.create({
            data: {
                nome,
                ano_letivo: exitAnoLetivo.nome,
                ano_escolaridade,
                escola_id,
                academic_year_id: exitAnoLetivo.id,
                capacidade_maxima
            },
        });
        return res.status(201).json(newTurma);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao criar turma", error: error.message });
    }
}

export const getTurmaById = async (req: Request | any, res: Response) => {
    const { turmaId } = req.params;

    if (!turmaId || !validate(turmaId)) {
        return res.status(400).json({ message: "ID de turma inválido" });
    }

    try {
        const turma = await prisma.turma.findUnique({
            where: { id: turmaId },
        });

        if (!turma) {
            return res.status(404).json({ message: "Turma não encontrada" });
        }

        return res.status(200).json(turma);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar turma", error: error.message });
    }
}

export const updateTurmaId = async (req: Request | any, res: Response) => {
    const { turmaId } = req.params;
    const { nome, ano_escolaridade, ano_letivo, capacidade_maxima } = req.body;

    if (!turmaId || !validate(turmaId)) {
        return res.status(400).json({ message: "ID de turma inválido" });
    }

    const existTurma = await prisma.turma.findUnique({
        where: { id: turmaId },
    });

    if (!existTurma) {
        return res.status(404).json({ message: "Turma não encontrada" });
    }

    const duplicateTurma = await prisma.turma.findFirst({
        where: {
            OR: [
                { nome: nome },
                { ano_escolaridade: ano_escolaridade }
            ],
            escola_id: existTurma.escola_id,
            NOT: {
                id: turmaId
            }
        }
    });

    if (duplicateTurma) {
        return res.status(400).json({ message: "Já existe uma turma com esse nome ou ano de escolaridade nesta escola" });
    }

    const anoLetivoExists = await prisma.academic_year.findFirst({
        where: {
            nome: ano_letivo,
            escola_id: existTurma?.escola_id
        }
    });

    if (!anoLetivoExists && ano_letivo) {
        return res.status(404).json({ message: "Ano letivo não encontrado para esta escola" });
    }

    try {
        const updatedTurma = await prisma.turma.update({
            where: { id: turmaId },
            data: {
                nome: nome ? nome : existTurma.nome,
                ano_escolaridade: ano_escolaridade ? ano_escolaridade : existTurma.ano_escolaridade,
                ano_letivo: ano_letivo ? ano_letivo : existTurma.ano_letivo,
                capacidade_maxima: capacidade_maxima ? capacidade_maxima : existTurma.capacidade_maxima
            },
        });
        return res.status(200).json(updatedTurma);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao atualizar turma", error: error.message });
    }
}

export const deleteTurmaId = async (req: Request | any, res: Response) => {
    const { turmaId } = req.params;

    if (!turmaId || !validate(turmaId)) {
        return res.status(400).json({ message: "ID de turma inválido" });
    }

    try {
        const existTurma = await prisma.turma.findUnique({
            where: { id: turmaId },
        });

        if (!existTurma) {
            return res.status(404).json({ message: "Turma não encontrada" });
        }

        await prisma.matricula.deleteMany({
            where: {
                turma_id: turmaId
            }
        });

        await prisma.turma_disciplina.deleteMany({
            where: {
                turma_id: turmaId
            }
        });

        await prisma.professor_turma.deleteMany({
            where: {
                turma_id: turmaId
            }
        });

        await prisma.aluno_turma.deleteMany({
            where: {
                turma_id: turmaId
            }
        });

        await prisma.turma.delete({
            where: { id: turmaId },
        });

        return res.status(200).json({
            message: "Turma deletada com sucesso"
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao deletar turma", error: error.message });
    }

}
