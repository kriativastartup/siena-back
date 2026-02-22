import { PropsResponseBad } from "../escolas/types";
import * as dto from "./dto/matricula.dto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createMatricula = async (data: dto.CreateMatriculaDTO): Promise<dto.ResponseMatriculaDTO | PropsResponseBad> => {
    try {
        const matricula = await prisma.matricula.create({
            data: {
                aluno_id: data.aluno_id,
                turma_id: data.turma_id,
                escola_id: data.escola_id,
                ano_letivo: data.ano_letivo,
                classe: data.classe,
                turno: data.turno,
                status: data.status
            }
        });

        const aluno = await prisma.aluno.findFirst({
            where: { id: data.aluno_id },
            include: {
                pessoa: true
            }
        });

        return {
            id: matricula.id,
            aluno_id: matricula.aluno_id,
            turma_id: matricula.turma_id,
            escola_id: matricula.escola_id,
            ano_letivo: matricula.ano_letivo,
            classe: matricula.classe,
            turno: matricula.turno,
            status: matricula.status,

            pessoa_id: aluno?.pessoa_id || "",
            nome_completo: aluno?.pessoa.nome_completo || "",
            bi: aluno?.pessoa.bi || "",
            dt_nascimento: aluno?.pessoa.dt_nascimento || new Date(),
            sexo: aluno?.pessoa.sexo || "",
            telefone: aluno?.pessoa.telefone || "",
            nacionalidade: aluno?.pessoa.nacionalidade || "",
            morada: aluno?.pessoa.morada || "",
            email: aluno?.pessoa.email || "",
            data_criacao: matricula.data_criacao,
            data_atualizacao: matricula.data_atualizacao
        };
    } catch (error) {
        console.error("Erro ao criar matrícula:", error);
        return {
            status: 500,
            message: "Ocorreu um erro ao criar a matrícula. Por favor, tente novamente mais tarde."
        };
    }
};

export const getMatriculaById = async (id: string): Promise<dto.ResponseMatriculaDTO | PropsResponseBad> => {
    try {
        const matricula = await prisma.matricula.findUnique({
            where: { id },
            include: {
                aluno: {
                    include: {
                        pessoa: true
                    }
                }
            }
        });

        if (!matricula) {
            return {
                status: 404,
                message: "Matrícula não encontrada"
            };
        }

        return {
            id: matricula.id,
            aluno_id: matricula.aluno_id,
            turma_id: matricula.turma_id,
            escola_id: matricula.escola_id,
            ano_letivo: matricula.ano_letivo,
            classe: matricula.classe,
            turno: matricula.turno,
            status: matricula.status,

            pessoa_id: matricula.aluno.pessoa_id || "",
            nome_completo: matricula.aluno.pessoa.nome_completo || "",
            bi: matricula.aluno.pessoa.bi || "",
            dt_nascimento: matricula.aluno.pessoa.dt_nascimento || new Date(),
            sexo: matricula.aluno.pessoa.sexo || "",
            telefone: matricula.aluno.pessoa.telefone || "",
            nacionalidade: matricula.aluno.pessoa.nacionalidade || "",
            morada: matricula.aluno.pessoa.morada || "",
            email: matricula.aluno.pessoa.email || "",
            data_criacao: matricula.data_criacao,
            data_atualizacao: matricula.data_atualizacao
        };
    } catch (error) {
        console.error("Erro ao buscar matrícula:", error);
        return {
            status: 500,
            message: "Ocorreu um erro ao buscar a matrícula. Por favor, tente novamente mais tarde."
        };
    }
};

export const getAlunosMatriculados = async (escola_id: string, limit?: number, offset?: number, search?: string): Promise<dto.ResponseMatriculaDTO[] | PropsResponseBad> => {
    try {
        const matriculas = await prisma.matricula.findMany({
            where: { 
                escola_id,
                aluno: {
                    pessoa: {
                        nome_completo: search ? { contains: search, mode: 'insensitive' } : undefined
                    }
                }
            },
            include: {
                aluno: {
                    include: {
                        pessoa: true
                    }
                }
            },
             take: limit,
            skip: offset,
        });

        return matriculas.map((matricula : any) => ({
            id: matricula.id,
            aluno_id: matricula.aluno_id,
            turma_id: matricula.turma_id,
            escola_id: matricula.escola_id,
            ano_letivo: matricula.ano_letivo,
            classe: matricula.classe,
            turno: matricula.turno,
            status: matricula.status,

            pessoa_id: matricula.aluno.pessoa_id || "",
            nome_completo: matricula.aluno.pessoa.nome_completo,
            bi: matricula.aluno.pessoa.bi || "",
            dt_nascimento: matricula.aluno.pessoa.dt_nascimento || new Date(),
            sexo: matricula.aluno.pessoa.sexo || "",
            telefone: matricula.aluno.pessoa.telefone || "",
            nacionalidade: matricula.aluno.pessoa.nacionalidade || "",
            morada: matricula.aluno.pessoa.morada || "",
            email: matricula.aluno.pessoa.email || "",
            data_criacao: matricula.data_criacao,
            data_atualizacao: matricula.data_atualizacao
        }));
    } catch (error) {
        console.error("Erro ao buscar alunos matriculados:", error);
        return {
            status: 500,
            message: "Ocorreu um erro ao buscar os alunos matriculados. Por favor, tente novamente mais tarde."
        };
    }
};

export const updateMatricula = async (id: string, data: dto.UpdateMatriculaDTO): Promise<dto.ResponseMatriculaDTO | PropsResponseBad> => {
    try {
        const matricula = await prisma.matricula.update({
            where: { id },
            data: {
                turma_id: data.turma_id,
                ano_letivo: data.ano_letivo,
                classe: data.classe,
                turno: data.turno,
                status: data.status
            },
            include: {
                aluno: {
                    include: {
                        pessoa: true
                    }
                }
            }
        });

        return {
            id: matricula.id,
            aluno_id: matricula.aluno_id,
            turma_id: matricula.turma_id,
            escola_id: matricula.escola_id,
            ano_letivo: matricula.ano_letivo,
            classe: matricula.classe,
            turno: matricula.turno,
            status: matricula.status,

            pessoa_id: matricula.aluno.pessoa_id || "",
            nome_completo: matricula.aluno.pessoa.nome_completo,
            bi: matricula.aluno.pessoa.bi || "",
            dt_nascimento: matricula.aluno.pessoa.dt_nascimento || new Date(),
            sexo: matricula.aluno.pessoa.sexo || "",
            telefone: matricula.aluno.pessoa.telefone || "",
            nacionalidade: matricula.aluno.pessoa.nacionalidade || "",
            morada: matricula.aluno.pessoa.morada || "",
            email: matricula.aluno.pessoa.email || "",
            data_criacao: matricula.data_criacao,
            data_atualizacao: matricula.data_atualizacao
        };
    } catch (error) {
        console.error("Erro ao atualizar matrícula:", error);
        return {
            status: 500,
            message: "Ocorreu um erro ao atualizar a matrícula. Por favor, tente novamente mais tarde."
        };
    }
};

export const deleteMatricula = async (id: string): Promise<{ message: string } | PropsResponseBad> => {
    // Implementação futura para deletar uma matrícula
    return { status: 400, message: "Funcionalidade de deletar matrícula ainda não implementada" };
};