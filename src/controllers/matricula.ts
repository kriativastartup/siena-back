import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { validate } from "uuid";


const prisma = new PrismaClient();

export const MatricularALuno = async (req: Request, res: Response) => {
    const { aluno_id, turma_id, escola_id, ano_letivo } = req.body;

    try {
        if (!aluno_id || !turma_id || !escola_id || !ano_letivo) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios" });
        }

        if (!validate(aluno_id) || !validate(turma_id) || !validate(escola_id)) {
            return res.status(400).json({ message: "Id do aluno ou turma ou da escola são inválidos" });
        }

        const existMatricula = await prisma.matricula.findFirst({
            where: {
                OR: [
                    {
                        aluno_id: aluno_id,
                        turma_id: turma_id,
                        ano_letivo: ano_letivo
                    },
                    {
                        aluno_id: aluno_id,
                        ano_letivo: ano_letivo
                    }
                ],
                escola_id: escola_id
            },
        });

        if (existMatricula) {
            return res.status(400).json({ message: "Aluno já está matriculado nesta turma para o ano letivo informado" });
        }

        const existAluno = await prisma.aluno.findUnique({
            where: {
                id: aluno_id
            }
        });

        if (!existAluno) {
            return res.status(404).json({ message: "Aluno não encontrado" });
        }

        const existTurma = await prisma.turma.findUnique({
            where: {
                id: turma_id
            }
        });

        const countMatriculas = await prisma.matricula.count({
            where: {
                turma_id: turma_id
            }
        });

        if (existTurma && countMatriculas >= existTurma.capacidade_maxima) {
            return res.status(400).json({ message: "Capacidade máxima da turma atingida" });
        }

        if (!existTurma) {
            return res.status(404).json({ message: "Turma não encontrada" });
        }

        const existEscola = await prisma.escola.findUnique({
            where: {
                id: escola_id
            }
        });

        if (!existEscola) {
            return res.status(404).json({ message: "Escola não encontrada" });
        }

        const existAno = await prisma.academic_year.findFirst({
            where: {
                nome: ano_letivo
            }
        });

        if (!existAno || !existAno.nome) {
            return res.status(404).json({ message: "Ano letivo não encontrado" });
        }

        const matricula = await prisma.matricula.create({
            data: {
                aluno_id: aluno_id,
                turma_id: turma_id,
                escola_id: escola_id,
                ano_letivo: existAno.nome!
            }
        });

        return res.status(201).json(matricula);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao matricular aluno", error: error.message });
    }
}

export const getMatriculaById = async (req: Request, res: Response) => {
    const { matriculaId } = req.params;

    if (!matriculaId || !validate(matriculaId)) {
        return res.status(400).json({ message: "ID de matrícula inválido" });
    }

    try {
        const matricula = await prisma.matricula.findUnique({
            where: { id: matriculaId },
        });

        if (!matricula) {
            return res.status(404).json({ message: "Matrícula não encontrada" });
        }

        return res.status(200).json(matricula);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar matrícula", error: error.message });
    }
}

export const getAllMatriculas = async (req: Request, res: Response) => {
    const { turma_id, ano_letivo } = req.body;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const offset = (limit * (page - 1));


    if (!turma_id || !validate(turma_id)) {
        return res.status(400).json({ message: "ID de turma inválido" });
    }

    if (!ano_letivo) {
        return res.status(400).json({ message: "O ano letivo é obrigatório" });
    }

    const existTurma = await prisma.turma.findUnique({
        where: { id: turma_id },
    });

    if (!existTurma) {
        return res.status(404).json({ message: "Turma não encontrada" });
    }

    const existAnoLetivo = await prisma.academic_year.findFirst({
        where: { nome: ano_letivo },
    });

    if (!existAnoLetivo) {
        return res.status(404).json({ message: "Ano Letivo não encontrado" });
    }
    try {
        const matriculas = await prisma.matricula.findMany({
            where: { turma_id: turma_id, ano_letivo: existAnoLetivo.nome! },
            skip: offset,
            take: limit
        });

        return res.status(200).json(matriculas);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar matrículas", error: error.message });
    }
};

export const deleteMatricula = async (req: Request, res: Response) => {
    const { matriculaId } = req.params;

    if (!matriculaId || !validate(matriculaId)) {
        return res.status(400).json({ message: "ID de matrícula inválido" });
    }

    try {
        await prisma.matricula.delete({
            where: { id: matriculaId },
        });

        return res.status(200).json({ message: "Matrícula deletada com sucesso" });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao deletar matrícula", error: error.message });
    }
}
