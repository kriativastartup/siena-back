import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { hash_password } from "../helper/encryption";
import { validate } from "uuid";


const prisma = new PrismaClient();

export const MatricularALuno = async (req: Request, res: Response) => {
    const { aluno_id, turma_id, escola_id, ano_letivo_id } = req.body;

    try {
        if (!aluno_id || !turma_id || !escola_id || !ano_letivo_id) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios" });
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

        const existAno = await prisma.academic_year.findUnique({
            where: {
                id: ano_letivo_id
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
