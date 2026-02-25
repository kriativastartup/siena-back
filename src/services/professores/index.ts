import { PrismaClient } from "@prisma/client";
import * as ProfessorDTO from "./dto/professor.dto";
import { hash_password } from "../../helper/encryption";
import { generateUsername } from "../../helper/username";
import { validate } from "uuid";
import { generateRandomPassword } from "../../helper/password_random";
import { sendEmail } from "../mail.service";
import { emailRandomPassTemplate } from "../../template/email_random_pass";

const prisma = new PrismaClient();

export const createProfessorService = async (
    data: ProfessorDTO.CreateProfessorDTO
): Promise<ProfessorDTO.ResponseProfessorDTO | ProfessorDTO.PropsResponseBad> => {

    const {
        nome_completo,
        bi,
        dt_nascimento,
        sexo,
        telefone,
        nacionalidade,
        morada,
        email,
        especialidade,
        categoria,
        habilitacoes,
        carga_horaria_sem,
        escola_id
    } = data;

    try {

        const existEscola = await prisma.escola.findFirst({
            where: { id: escola_id }
        });

        if (!existEscola) {
            return { status: 404, message: "Escola não encontrada" };
        }

        const randomPassword = generateRandomPassword(8);
        try {
            await sendEmail(
                email,
                `Bem-vindo à escola ${existEscola.nome}, Prof ${nome_completo}!`,
                emailRandomPassTemplate(email, randomPassword)
            )
        } catch (error) {
            return {
                status: 400,
                message: `Erro ao enviar email, verifique o email e tente novamente`
            };
        }
        const hashedPassword = await hash_password(randomPassword);

        const newPessoa = await prisma.pessoa.create({
            data: {
                nome_completo,
                bi,
                dt_nascimento: new Date(dt_nascimento),
                sexo,
                telefone,
                nacionalidade,
                morada,
                email
            }
        });

        const newUsuario = await prisma.usuario.create({
            data: {
                tipo_usuario: "PROFESSOR",
                pessoa_id: newPessoa.id,
                username: `${await generateUsername(nome_completo)}`,
                senha_hash: hashedPassword
            }
        });

        const newProfessor = await prisma.professor.create({
            data: {
                pessoa_id: newPessoa.id,
                especialidade,
                categoria,
                habilitacoes,
                carga_horaria_sem,
                escola_id
            }
        });

        return {
            id: newProfessor.id,
            pessoa_id: newPessoa.id,
            nome_completo: newPessoa.nome_completo,
            bi: newPessoa.bi || "",
            dt_nascimento: newPessoa.dt_nascimento || undefined,
            sexo: newPessoa.sexo || undefined,
            telefone: newPessoa.telefone || "",
            nacionalidade: newPessoa.nacionalidade || "",
            morada: newPessoa.morada || "",
            email: newPessoa.email || "",
            especialidade: newProfessor.especialidade || "",
            categoria: newProfessor.categoria || "",
            habilitacoes: newProfessor.habilitacoes || "",
            carga_horaria_sem: newProfessor.carga_horaria_sem || undefined,
            escola_id: newProfessor.escola_id || undefined,
            data_criacao: newProfessor.data_criacao,
            username: newUsuario.username,
            tipo_usuario: "PROFESSOR",
            estado: newUsuario.estado
        };

    } catch (error: any) {
        return { status: 500, message: `Erro ao criar professor: ${error.message}` };
    }
};

export const getAllProfessoresByEscolaService = async (
    escola_id: string,
    limit: number,
    offset: number,
    search?: string
): Promise<ProfessorDTO.ResponseProfessorDTO[] | ProfessorDTO.PropsResponseBad> => {
    if (!validate(escola_id)) {
        return { status: 400, message: "ID de escola inválido" };
    }

    try {
        const exiteEscola = await prisma.escola.findFirst({
            where: { id: escola_id }
        });

        if (!exiteEscola) {
            return { status: 404, message: "Escola não encontrada" };
        }

        const where: any = { escola_id };

        if (search) {
            where.nome_completo = { contains: search, mode: "insensitive" };
        }

        const professoresPessoa = await prisma.professor.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: { data_criacao: "desc" },
            include: {
                pessoa: true
            }
        });

        const professores = await Promise.all(professoresPessoa.map(async (professor) => {
            const user = await prisma.usuario.findFirst({
                where: { pessoa_id: professor.pessoa_id }
            });

            return {
                ...professor,
                usuario: user || undefined
            };
        }));

        return professores.map(professor => ({
            id: professor.id,
            pessoa_id: professor.pessoa_id,
            nome_completo: professor.pessoa.nome_completo || "",
            bi: professor.pessoa.bi || "",
            dt_nascimento: professor.pessoa.dt_nascimento || undefined,
            sexo: professor.pessoa.sexo || undefined,
            telefone: professor.pessoa.telefone || "",
            nacionalidade: professor.pessoa.nacionalidade || "",
            morada: professor.pessoa.morada || "",
            email: professor.pessoa.email || "",
            especialidade: professor.especialidade || "",
            categoria: professor.categoria || "",
            habilitacoes: professor.habilitacoes || "",
            carga_horaria_sem: professor.carga_horaria_sem || undefined,
            escola_id: professor.escola_id || undefined,
            data_criacao: professor.data_criacao,
            username: professor.usuario?.username || "",
            tipo_usuario: professor.usuario?.tipo_usuario || "",
            estado: professor.usuario?.estado || ""
        }));
    } catch (error: any) {
        return { status: 500, message: `Erro ao buscar professores: ${error.message}` };
    }
};

export const getProfessorByIdService = async (
    professor_id: string
): Promise<ProfessorDTO.ResponseProfessorDTO | ProfessorDTO.PropsResponseBad> => {

    if (!validate(professor_id)) {
        return { status: 400, message: "ID inválido" };
    }

    try {
        const professor = await prisma.professor.findFirst({
            where: { id: professor_id }
        });

        if (!professor) {
            return { status: 404, message: "Professor não encontrado" };
        }

        const pessoa = await prisma.pessoa.findFirst({
            where: { id: professor.pessoa_id }
        });

        const user = await prisma.usuario.findFirst({
            where: { pessoa_id: professor.pessoa_id }
        });

        return {
            id: professor.id,
            pessoa_id: professor.pessoa_id,
            nome_completo: pessoa?.nome_completo || "",
            bi: pessoa?.bi || "",
            dt_nascimento: pessoa?.dt_nascimento || undefined,
            sexo: pessoa?.sexo || undefined,
            telefone: pessoa?.telefone || "",
            nacionalidade: pessoa?.nacionalidade || "",
            morada: pessoa?.morada || "",
            email: pessoa?.email || "",
            especialidade: professor.especialidade || "",
            categoria: professor.categoria || "",
            habilitacoes: professor.habilitacoes || "",
            carga_horaria_sem: professor.carga_horaria_sem || undefined,
            escola_id: professor.escola_id || undefined,
            data_criacao: professor.data_criacao,
            username: user?.username || "",
            tipo_usuario: user?.tipo_usuario || "",
            estado: user?.estado || ""
        };

    } catch (error: any) {
        return { status: 500, message: `Erro ao buscar professor: ${error.message}` };
    }
};

export const updateProfessorService = async (
    professor_id: string,
    data: Partial<ProfessorDTO.CreateProfessorDTO>
): Promise<ProfessorDTO.ResponseProfessorDTO | ProfessorDTO.PropsResponseBad> => {

    if (!validate(professor_id)) {
        return { status: 400, message: "ID inválido" };
    }

    try {
        const professor = await prisma.professor.findFirst({
            where: { id: professor_id }
        });

        if (!professor) {
            return { status: 404, message: "Professor não encontrado" };
        }

        const pessoa = await prisma.pessoa.findFirst({
            where: { id: professor.pessoa_id }
        });

        const updatedPessoa = await prisma.pessoa.update({
            where: { id: professor.pessoa_id },
            data: {
                nome_completo: data.nome_completo || pessoa?.nome_completo,
                bi: data.bi || pessoa?.bi,
                dt_nascimento: data.dt_nascimento
                    ? new Date(data.dt_nascimento)
                    : pessoa?.dt_nascimento,
                sexo: data.sexo || pessoa?.sexo,
                telefone: data.telefone || pessoa?.telefone,
                nacionalidade: data.nacionalidade || pessoa?.nacionalidade,
                morada: data.morada || pessoa?.morada,
                email: data.email || pessoa?.email
            }
        });

        const updatedProfessor = await prisma.professor.update({
            where: { id: professor_id },
            data: {
                especialidade: data.especialidade || professor.especialidade,
                categoria: data.categoria || professor.categoria,
                habilitacoes: data.habilitacoes || professor.habilitacoes,
                carga_horaria_sem: data.carga_horaria_sem || professor.carga_horaria_sem,
                escola_id: data.escola_id || professor.escola_id
            }
        });

        const user = await prisma.usuario.findFirst({
            where: { pessoa_id: professor.pessoa_id }
        });

        return {
            ...updatedProfessor,
            ...updatedPessoa,
            username: user?.username || "",
            tipo_usuario: user?.tipo_usuario || "",
            estado: user?.estado || ""
        } as ProfessorDTO.ResponseProfessorDTO;

    } catch (error: any) {
        return { status: 500, message: `Erro ao atualizar professor: ${error.message}` };
    }
};
