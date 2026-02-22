import * as dto from "./dto/curso.dto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCurso = async (data: dto.CreateCursoDTO) : Promise<dto.ResponseCursoDTO | dto.PropsResponseBad> => {
    const existEscola = await prisma.escola.findFirst({
        where: { id: data.escola_id },
    });

    if (!existEscola) {
        return { status: 404, message: "Escola não encontrada" };
    }

    const existCurso = await prisma.curso.findFirst({
        where: { nome: data.nome, escola_id: data.escola_id },
    });

    if (existCurso) {
        throw new Error("Curso já existe para esta escola");
    }

    const curso = await prisma.curso.create({
        data: {
            nome: data.nome,
            descricao: data.descricao,
            abreviacao: data.abreviacao,
            escola_id: data.escola_id
        }
    });

    return curso as dto.ResponseCursoDTO;
};

export const getCursoById = async (id: string) => {
    const curso = await prisma.curso.findFirst({
        where: { id },
    });

    return curso;
}

export const getAllCursos = async (escola_id: string, limit: number, offset: number, search?: string) : Promise<dto.ResponseCursoDTO[] | dto.PropsResponseBad> => {
    const where: any = { escola_id };

    if (search) {
        where.nome = { contains: search, mode: "insensitive" };
    }

    const cursos = await prisma.curso.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { data_criacao: "desc" },
    });

    return cursos as dto.ResponseCursoDTO[];
}

export const updateCurso = async (id: string, data: dto.UpdateCursoDTO) : Promise<dto.ResponseCursoDTO | dto.PropsResponseBad> => {
    const existCurso = await prisma.curso.findFirst({
        where: { id },
    });

    if (!existCurso) {
        return { status: 404, message: "Curso não encontrado" };
    }

    if (data.nome) {
        const existCursoWithName = await prisma.curso.findFirst({
            where: { nome: data.nome, escola_id: existCurso.escola_id, NOT: { id } },
        });

        if (existCursoWithName) {
            throw new Error("Já existe outro curso com este nome para esta escola");
        }
    }

    const updatedCurso = await prisma.curso.update({
        where: { id },
        data: {
            nome: data.nome,
            descricao: data.descricao,
            abreviacao: data.abreviacao,
            escola_id: data.escola_id
        }
    });

    return updatedCurso as dto.ResponseCursoDTO;
};

export const deleteCurso = async (id: string) => {
    return {
        status: 400,
        message: "Exclusão de curso não permitida. Cursos associados a turmas não podem ser excluídos."
    }
};