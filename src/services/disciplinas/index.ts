import { PrismaClient } from "@prisma/client";
import * as dto from "./dto/disciplina.dto";

const prisma = new PrismaClient();

export const createDisciplina = async (data: dto.CriarDisciplinaDTO) => {
    const existingDisciplina = await prisma.disciplina.findFirst({
        where: {
            nome: {
                equals: data.nome,
                mode: "insensitive"
            },
            escola_id: data.escola_id,

        },
    });

    if (existingDisciplina) {
        return {
            message: "Já existe uma disciplina com esse nome para esta escola",
            status: 400
        } as dto.ResponseBad;
    }

    const disciplina = await prisma.disciplina.create({
        data: {
            nome: data.nome,
            carga_horaria_sem: data.carga_horaria_sem,
            escola_id: data.escola_id
        }
    });
    return disciplina;
};

export const getDisciplinaById = async (id: string) => {
    const disciplina = await prisma.disciplina.findUnique({
        where: { id }
    });
    return disciplina;
};

export const updateDisciplina = async (id: string, data: dto.AtualizarDisciplinaDTO) => {
    const existingDisciplina = await prisma.disciplina.findFirst({
        where: {
            nome: {
                equals: data.nome,
                mode: "insensitive"
            },
            escola_id: data.escola_id,
            NOT: { id }
        }
    });

    if (existingDisciplina) {
        return {
            message: "Já existe uma disciplina com esse nome para esta escola",
            status: 400
        } as dto.ResponseBad;
    }

    const disciplina = await prisma.disciplina.update({
        where: { id },
        data: {
            nome: data.nome,
            carga_horaria_sem: data.carga_horaria_sem,
            escola_id: data.escola_id
        }
    });
    return disciplina;
};

export const todasAsDisciplinasDeUmaEscola = async (escola_id: string) => {
    const disciplinas = await prisma.disciplina.findMany({
        where: { escola_id }
    });
    return disciplinas;
};