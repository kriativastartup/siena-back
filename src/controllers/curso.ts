import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { hash_password } from "../helper/encryption";
import { validate } from "uuid";
import { generateRandomNumber } from "../helper/random";

const prisma = new PrismaClient();



export const getCursoById = async (req: Request, res: Response) => {
    const { cursoId } = req.params;

    if (!cursoId || !validate(cursoId)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const curso = await prisma.curso.findUnique({
            where: { id: cursoId },
        });

        if (!curso) {
            return res.status(404).json({ message: "Curso não encontrado" });
        }

        return res.status(200).json(curso);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar Curso", error: error.message });
    }
};


export const createCurso = async (req: Request, res: Response) => {
    const { nome, escola_id, descricao, abreviacao } = req.body;

    if (!nome || !escola_id) {
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
        const curso = await prisma.curso.create({
            data: {
                nome,
                escola_id,
                descricao,
                abreviacao
            }
        });

        return res.status(201).json(curso);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao criar Curso", error: error.message });
    }
};


export const getCursosByEscola = async (req: Request, res: Response) => {
    const { escolaId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const offset = (limit * (page - 1));

    if (!escolaId || !validate(escolaId)) {
        return res.status(400).json({ message: "ID de escola inválido" });
    }

    try {
        const cursos = await prisma.curso.findMany({
            where: { escola_id: escolaId },
            skip: offset,
            take: limit,
        });
        return res.status(200).json(cursos);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar cursos", error: error.message });
    }
};

export const updateCurso = async (req: Request, res: Response) => {
    const { cursoId } = req.params;
    const { nome, descricao, abreviacao } = req.body;

    if (!cursoId || !validate(cursoId)) {
        return res.status(400).json({ message: "ID de curso inválido" });
    }

    try {
        const existingCurso = await prisma.curso.findUnique({
            where: { id: cursoId },
        });

        if (!existingCurso) {
            return res.status(404).json({ message: "Curso não encontrado" });
        }

        const updatedCurso = await prisma.curso.update({
            where: { id: cursoId },
            data: {
                nome: nome || existingCurso.nome,
                descricao: descricao || existingCurso.descricao,
                abreviacao: abreviacao || existingCurso.abreviacao
            },
        });

        return res.status(200).json(updatedCurso);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao atualizar Curso", error: error.message });
    }
};

export const deleteCurso = async (req: Request, res: Response) => {
    const { cursoId } = req.params;

    if (!cursoId || !validate(cursoId)) {
        return res.status(400).json({ message: "ID de curso inválido" });
    }

    try {
        const existingCurso = await prisma.curso.findUnique({
            where: { id: cursoId },
        });

        if (!existingCurso) {
            return res.status(404).json({ message: "Curso não encontrado" });
        }

        await prisma.curso.delete({
            where: { id: cursoId },
        });

        return res.status(200).json({ message: "Curso deletado com sucesso" });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao deletar Curso", error: error.message });
    }
};

// pegar todos os cursos que um profesor da aula
export const getCursosByProfessor = async (req: Request, res: Response) => {
    const { professorId } = req.params;

    if (!professorId || !validate(professorId)) {
        return res.status(400).json({ message: "ID de professor inválido" });
    }

    try {
        const professorTurmas = await prisma.professor_turma.findMany({
            where: { professor_id: professorId },
        });

        const cursos = professorTurmas.map(pt => pt.turma_id).filter((value, index, self) => self.indexOf(value) === index);
        const cursosDetalhados = await prisma.curso.findMany({
            where: { id: { in: cursos } },
        });

        return res.status(200).json(cursosDetalhados);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar cursos do professor", error: error.message });
    }
};
