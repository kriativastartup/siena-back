import * as dto from "./dto/escola.dto";
import { PrismaClient } from "@prisma/client";
import { PropsResponseBad } from "./types";

const prisma = new PrismaClient();

export const createEscolaService = async (data: dto.CreateEscolaDTO) : Promise<dto.ResponseEscolaDTO | PropsResponseBad> => {
    const { 
        nome, 
        natureza,
        codigo_mec, 
        nif, 
        localizacao : { endereco, cidade, provincia, pais },
        contacto : { telefone, outro_telefone, email, outro_email },
        logo_url 
    } = data;

    try {
    const existEscola = await prisma.escola.findFirst({
      where: {
        OR:[
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