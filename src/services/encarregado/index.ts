import { PrismaClient } from "@prisma/client";
import * as EncarregadoDTO from "../encarregado/dto/encarregado.dto";
import { hash_password } from "../../helper/encryption";
import { generateRandomNumber, generateUsername } from "../../helper/username";
import { validate } from "uuid";
import { sendEmail } from "../mail.service";
import { emailRandomPassTemplate } from "../../template/email_random_pass";

const prisma = new PrismaClient();

export const createEncarregadoService = async (
    data: EncarregadoDTO.CreateEncarregadoDTO
): Promise<EncarregadoDTO.ResponseEncarregadoDTO | EncarregadoDTO.PropsResponseBad> => {

    const {
        nome_completo,
        bi,
        dt_nascimento,
        sexo,
        telefone,
        nacionalidade,
        morada,
        email,
        profissao,
        escolaridade
    } = data;

    try {
        const generatePassword = generateRandomNumber(8).toString();
        const hashedPassword = await hash_password(generatePassword);
        try {
            await sendEmail(
                email,
                "Bem-vindo ao Sistema de Gestão Escolar",
                emailRandomPassTemplate(email, generatePassword)
            );
        } catch (error: any) {
            return { status: 500, message: `Erro ao enviar email: ${error.message}` };
        }

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
                tipo_usuario: "ENCARREGADO",
                pessoa_id: newPessoa.id,
                username: `enc${generateRandomNumber(4)}`,
                senha_hash: hashedPassword
            }
        });

        const newEncarregado = await prisma.encarregado.create({
            data: {
                pessoa_id: newPessoa.id,
                profissao,
                escolaridade
            }
        });

        return {
            id: newEncarregado.id,
            pessoa_id: newPessoa.id,
            nome_completo: newPessoa.nome_completo || "",
            bi: newPessoa.bi || "",
            dt_nascimento: newPessoa.dt_nascimento || undefined,
            sexo: newPessoa.sexo || undefined,
            telefone: newPessoa.telefone || "",
            nacionalidade: newPessoa.nacionalidade || "",
            morada: newPessoa.morada || "",
            email: newPessoa.email || "",
            profissao: newEncarregado.profissao || "",
            escolaridade: newEncarregado.escolaridade || "",
            data_criacao: newEncarregado.data_criacao,
            data_atualizacao: newEncarregado.data_atualizacao,
            username: newUsuario.username || "",
            tipo_usuario: "ENCARREGADO",
            estado: newUsuario.estado
        };

    } catch (error: any) {
        return { status: 500, message: `Erro ao criar encarregado: ${error.message}` };
    }
};

export const getEncarregadoByIdService = async (
    encarregado_id: string
): Promise<EncarregadoDTO.ResponseEncarregadoDTO | EncarregadoDTO.PropsResponseBad> => {

    if (!validate(encarregado_id)) {
        return { status: 400, message: "ID inválido" };
    }

    try {
        const encarregado = await prisma.encarregado.findFirst({
            where: { id: encarregado_id }
        });

        if (!encarregado) {
            return { status: 404, message: "Encarregado não encontrado" };
        }

        const pessoa = await prisma.pessoa.findFirst({
            where: { id: encarregado.pessoa_id }
        });

        const user = await prisma.usuario.findFirst({
            where: { pessoa_id: encarregado.pessoa_id }
        });

        return {
            id: encarregado.id,
            pessoa_id: encarregado.pessoa_id,
            nome_completo: pessoa?.nome_completo || "",
            bi: pessoa?.bi || "",
            dt_nascimento: pessoa?.dt_nascimento || undefined,
            sexo: pessoa?.sexo || undefined,
            telefone: pessoa?.telefone || "",
            nacionalidade: pessoa?.nacionalidade || "",
            morada: pessoa?.morada || "",
            email: pessoa?.email || "",
            profissao: encarregado.profissao || "",
            escolaridade: encarregado.escolaridade || "",
            data_criacao: encarregado.data_criacao,
            data_atualizacao: encarregado.data_atualizacao,
            username: user?.username || "",
            tipo_usuario: user?.tipo_usuario || "",
            estado: user?.estado || ""
        };

    } catch (error: any) {
        return { status: 500, message: `Erro ao buscar encarregado: ${error.message}` };
    }
};
      
export const updateEncarregadoService = async (
    encarregado_id: string,
    data: Partial<EncarregadoDTO.CreateEncarregadoDTO>
): Promise<EncarregadoDTO.ResponseEncarregadoDTO | EncarregadoDTO.PropsResponseBad> => {

    if (!validate(encarregado_id)) {
        return { status: 400, message: "ID inválido" };
    }

    try {
        const encarregado = await prisma.encarregado.findFirst({
            where: { id: encarregado_id }
        });

        if (!encarregado) {
            return { status: 404, message: "Encarregado não encontrado" };
        }

        const pessoa = await prisma.pessoa.findFirst({
            where: { id: encarregado.pessoa_id }
        });

        const updatedPessoa = await prisma.pessoa.update({
            where: { id: encarregado.pessoa_id },
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

        const updatedEncarregado = await prisma.encarregado.update({
            where: { id: encarregado_id },
            data: {
                profissao: data.profissao || encarregado.profissao,
                escolaridade: data.escolaridade || encarregado.escolaridade,
            }
        });

        const user = await prisma.usuario.findFirst({
            where: { pessoa_id: encarregado.pessoa_id }
        });

        return {
            ...updatedEncarregado,
            ...updatedPessoa,
            username: user?.username || "",
            tipo_usuario: user?.tipo_usuario || "",
            estado: user?.estado || ""
        } as EncarregadoDTO.ResponseEncarregadoDTO;

    } catch (error: any) {
        return { status: 500, message: `Erro ao atualizar encarregado: ${error.message}` };
    }
};
