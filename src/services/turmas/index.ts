import { PrismaClient } from "@prisma/client";
import * as dto from "./dto/turma.dto";

const prisma = new PrismaClient();

export const createTurma = async (data: dto.CreateTurmaDTO) => {
    const existeEscola = await prisma.escola.findFirst({
        where: { id: data.escola_id }
    });

    if (!existeEscola) {
        return {
            status: 404,
            message: "Escola não encontrada",
        } as dto.PropsResponseBad;
    }

    const jaExisteEssaTurma = await prisma.turma.findFirst({
        where: {
            nome: data.nome,
            escola_id: data.escola_id,
            ano_letivo: data.ano_letivo,
            turno: data.turno,
            classe: data.classe
        },
    });

    if (jaExisteEssaTurma) {
        return {
            status: 400,
            message: "Já existe uma turma com essas características",
        } as dto.PropsResponseBad;
    }

    const existCurso = await prisma.curso.findFirst({
        where: { id: data.curso_id, escola_id: data.escola_id }
    });

    if (!existCurso) {
        return {
            status: 404,
            message: "Curso não encontrado para esta escola",
        } as dto.PropsResponseBad;
    }

    const existAnoLetivo = await prisma.ano_letivo.findFirst({
        where: { nome: data.ano_letivo, escola_id: data.escola_id }
    });

    if (!existAnoLetivo) {
        return {
            status: 404,
            message: "Ano letivo não encontrado para esta escola",
        } as dto.PropsResponseBad;
    }

    let profPessoa = null;

    if (data.professor_id) {
        const existProfessor = await prisma.professor.findFirst({
            where: { id: data.professor_id, escola_id: data.escola_id }
        });

        if (!existProfessor) {
            return {
                status: 404,
                message: "Professor não encontrado para esta escola",
            } as dto.PropsResponseBad;
        }

        profPessoa = await prisma.pessoa.findFirst({
            where: { id: existProfessor.pessoa_id }
        });

        if (!profPessoa) {
            return {
                status: 404,
                message: "Pessoa do professor não encontrada",
            } as dto.PropsResponseBad;
        }
    }


   const turma = await prisma.turma.create({
        data: {
            nome: data.nome,
            escola_id: data.escola_id,
            curso_id: data.curso_id,
            ano_letivo: data.ano_letivo,
            ano_letivo_id: existAnoLetivo.id,
            professor_id: data.professor_id,
            professor_nome: data.professor_id && profPessoa ? profPessoa.nome_completo : undefined,
            turno: data.turno,
            classe: data.classe,
            capacidade: data.capacidade,
            horario_aula: data.horario_aula ? JSON.stringify(data.horario_aula) : [],
        },
    });
    return turma;
};

export const getTurmaById = async (id: string) => {
    try {
    const turma = await prisma.turma.findFirst({
        where: { id },
    });

    return turma;
    } catch (error) {
        console.error("Erro ao buscar turma por ID:", error);
        return {
            status: 500,
            message: "Erro interno ao buscar turma por ID",
        } as dto.PropsResponseBad;
    }
};

export const getTurmas = async (escola_id : string,limit?: number, offset?: number, search?: string) => {
    const existeEscola = await prisma.escola.findFirst({
        where: { id: escola_id }
    });

    if (!existeEscola) {
        return {
            status: 404,
            message: "Escola não encontrada",
        } as dto.PropsResponseBad;
    }
    const turmas = await prisma.turma.findMany({
        take: limit,
        skip: offset,
        where: {
            escola_id: escola_id,
            nome: {
                contains: search,
                mode: "insensitive",
            },
        },
    });
    return turmas;
};

export const updateTurma = async (id: string, data: dto.UpdateTurmaDTO) => {
    try {

        const existTurma = await prisma.turma.findFirst({
            where: { id },
        });

        if (!existTurma) {
            return {
                status: 404,
                message: "Turma não encontrada",
            } as dto.PropsResponseBad;
        }

        const jaExisteEssaTurma = await prisma.turma.findFirst({
            where: {
                id: { not: id },
                nome: data.nome,
                escola_id: data.escola_id,
                ano_letivo: data.ano_letivo,
                turno: data.turno,
                classe: data.classe,
            },
        });
        if (jaExisteEssaTurma) {
            return {
                status: 400,
                message: "Já existe uma turma com essas características",
            } as dto.PropsResponseBad;
        }
        const turma = await prisma.turma.update({
        where: { id },
        data: {
            nome: data.nome || existTurma.nome,
            escola_id: data.escola_id || existTurma.escola_id,
            ano_letivo: data.ano_letivo || existTurma.ano_letivo,
            turno: data.turno || existTurma.turno,
            classe: data.classe || existTurma.classe,
            horario_aula: data.horario_aula ? JSON.stringify(data.horario_aula) : JSON.stringify(existTurma.horario_aula),
            capacidade: data.capacidade || existTurma.capacidade,
        },
        });

        return turma;
    } catch (error) {
        console.error("Erro ao atualizar turma:", error);
        return {
            status: 500,
            message: "Erro interno ao atualizar turma",
        } as dto.PropsResponseBad;
    }
};

export const deleteTurma = async (id: string) => {
    return {
        message: "Turma deletada com sucesso",
    }
}
