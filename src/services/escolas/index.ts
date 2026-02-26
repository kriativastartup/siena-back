import * as dto from "./dto/escola.dto";
import { PrismaClient } from "@prisma/client";
import { PropsResponseBad } from "./types";

const prisma = new PrismaClient();

export const createEscolaService = async (data: dto.CreateEscolaDTO): Promise<dto.ResponseEscolaDTO | PropsResponseBad> => {
    const {
        nome,
        natureza,
        codigo_mec,
        nif,
        localizacao: { endereco, cidade, provincia, pais },
        contacto: { telefone, outro_telefone, email, outro_email },
        logo_url
    } = data;

    try {
        const existEscola = await prisma.escola.findFirst({
            where: {
                OR: [
                    { codigo_mec: codigo_mec },
                    { nif: nif }
                ]
            },
        });

        if (existEscola) {
            return {
                status: 400,
                message: "Escola com esse código MEC ou NIF já existe"
            } as PropsResponseBad;
        }

        const newEscola = await prisma.escola.create({
            data: {
                nome,
                natureza,
                codigo_mec,
                nif,
                localizacao: {
                    endereco,
                    cidade,
                    provincia,
                    pais,
                },
                contacto: {
                    telefone,
                    outro_telefone,
                    email,
                    outro_email,
                },
                logo_url,
            },
        });
        await prisma.infra_escola.create({
            data: {
                escola_id: newEscola.id,
                salas: 0,
                salas_improvisadas: 0,
                laboratorios: 0,
                bibliotecas: 0,
                quadras_esportivas: 0,
            },
        });
        return newEscola as dto.ResponseEscolaDTO;
    } catch (error) {
        console.error("Error creating escola:", error);
        return {
            status: 500,
            message: "An error occurred while creating escola."
        } as PropsResponseBad;
    }

}

export const getAllEscolasService = async (limit: number, page: number, search?: string) => {
    const skip = (page - 1) * limit;
    let whereClause = {};
    if (search) {
        whereClause = {
            nome: {
                contains: search,
                mode: "insensitive",
            },
        };
    }
    const escolas = await prisma.escola.findMany({
        where: whereClause,
        orderBy: { data_criacao: "desc" },
        skip,
        take: limit,
    });
    return (escolas) as dto.ResponseEscolaDTO[];
};

export const getEscolaByIdService = async (escola_id: string) => {
    const escola = await prisma.escola.findFirst({
        where: { id: escola_id },
    });
    if (!escola) {
        return {
            status: 404,
            message: "Escola não encontrada."
        } as PropsResponseBad;
    }
    return dto.ResponseEscolaSchema.parse(escola);
};

export const updateEscolaService = async (escola_id: string, data: Partial<dto.CreateEscolaDTO>) => {
    const escola = await prisma.escola.findFirst({
        where: { id: escola_id },
    });
    if (!escola) {
        return {
            status: 404,
            message: "Escola não encontrada."
        } as PropsResponseBad;
    }
    const updatedEscola = await prisma.escola.update({
        where: { id: escola_id },
        data: {
            nome: data.nome || escola.nome,
            natureza: data.natureza || escola.natureza,
            codigo_mec: data.codigo_mec || escola.codigo_mec,
            nif: data.nif || escola.nif,
            logo_url: data.logo_url || escola.logo_url,
            localizacao: data.localizacao ? data.localizacao : escola.localizacao || undefined,
            contacto: data.contacto ? data.contacto : escola.contacto || undefined,
        },
    });
    return dto.ResponseEscolaSchema.parse(updatedEscola);
};

export const deleteEscolaService = async (escola_id: string) => {
    const escola = await prisma.escola.findFirst({
        where: { id: escola_id },
    });
    if (!escola) {
        return {
            status: 404,
            message: "Escola não encontrada."
        } as PropsResponseBad;
    }
    await prisma.escola.delete({
        where: { id: escola_id },
    });
    return { message: "Escola deletada com sucesso." };
};

export const updateInfraEscolaService = async (escola_id: string, data: Partial<dto.CreateInfraEscolaDTO>) => {
    const infraEscola = await prisma.infra_escola.findFirst({
        where: { escola_id },
    });
    if (!infraEscola) {
        return {
            status: 404,
            message: "Infraestrutura da escola não encontrada."
        } as PropsResponseBad;
    }

    const findInfraEscola = await prisma.infra_escola.findFirst({
        where: { escola_id },
    });
    if (!findInfraEscola) {
        await prisma.infra_escola.create({
            data: {
                escola_id,
                salas: data.salas || 0,
                salas_improvisadas: data.salas_improvisadas || 0,
                estado_conservacao: data.estado_conservacao || undefined,
                laboratorios: data.laboratorios || 0,
                bibliotecas: data.bibliotecas || 0,
                quadras_esportivas: data.quadras_esportivas || 0,
                refeitorios: data.refeitorios || 0,
                auditorios: data.auditorios || 0,
            },
        });
        return await prisma.infra_escola.findFirst({
            where: { escola_id },
        });
    }
    const updatedInfraEscola = await prisma.infra_escola.update({
        where: { id: findInfraEscola.id },
        data: {
            salas: data.salas !== undefined ? data.salas : infraEscola.salas,
            salas_improvisadas: data.salas_improvisadas !== undefined ? data.salas_improvisadas : infraEscola.salas_improvisadas,
            estado_conservacao: data.estado_conservacao || infraEscola.estado_conservacao,
            laboratorios: data.laboratorios !== undefined ? data.laboratorios : infraEscola.laboratorios,
            bibliotecas: data.bibliotecas !== undefined ? data.bibliotecas : infraEscola.bibliotecas,
            quadras_esportivas: data.quadras_esportivas !== undefined ? data.quadras_esportivas : infraEscola.quadras_esportivas,
            refeitorios: data.refeitorios !== undefined ? data.refeitorios : infraEscola.refeitorios,
            auditorios: data.auditorios !== undefined ? data.auditorios : infraEscola.auditorios,
        },
    });
    return updatedInfraEscola;
};