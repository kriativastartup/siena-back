
import { generateRandomNumber } from "../../helper/random"
import { hash_password } from "../../helper/encryption";
import { PrismaClient, sexo_enum, status_aluno } from "@prisma/client";
import * as AnoLetivoDTO from "./dto/ano_letivo.dto";
import { validate } from "uuid";
import { gerarAnoLetivo } from "../../helper/gerar_ano_letivo";

const prisma = new PrismaClient();

export const createAnoLetivo = async (data: AnoLetivoDTO.CreateAnoLectivoDTOType) => {
    const {  escola_id, data_de_inicio, data_de_fim } = data;
    const generateName =  gerarAnoLetivo(data_de_inicio, data_de_fim);
    if (!generateName.valido) {
        return {
            status: 400,
            message: generateName.erro
        }
    }
    const newAnoLetivo = await prisma.ano_letivo.create({
        data: {
            nome : generateName.nome,
            escola_id,
            data_de_inicio: new Date(data_de_inicio),
            data_de_fim: new Date(data_de_fim)
        }
    });
    return newAnoLetivo;
}

export const getAnosLetivos = async (escola_id: string, limit: number, page: number, search: string) => {
    const skip = (page - 1) * limit;
    const where = search ? {
        escola_id,
        nome: {
            contains: search,
            mode: 'insensitive'
        }
    } : { escola_id };

    const anosLetivos = await prisma.ano_letivo.findMany({
        
        skip,
            take: limit,
            orderBy: {
            data_criacao: 'desc'
        }
    });
    return anosLetivos;
}

export const getAnoLetivoById = async (ano_id: string) => {
    if (!validate(ano_id)) {
        return {
            status: 400,
            message: 'ID do ano letivo inválido'
        }
    }

    const anoLetivo = await prisma.ano_letivo.findUnique({
        where: {
            id: ano_id
        }
    });

    if (!anoLetivo) {
        return {
            status: 404,
            message: 'Ano letivo não encontrado'
        }
    }

    return anoLetivo;
}

export const updateAnoLetivo = async (ano_id: string, data: AnoLetivoDTO.UpdateAnoLectivoDTOType) => {
    if (!validate(ano_id)) {
        return {
            status: 400,
            message: 'ID do ano letivo inválido'
        }
    }

    const updatedAnoLetivo = await prisma.ano_letivo.update({
        where: {
            id: ano_id
        },
        data: {
            data_de_inicio: data.data_de_inicio ? new Date(data.data_de_inicio) : undefined,
            data_de_fim: data.data_de_fim ? new Date(data.data_de_fim) : undefined
        }
    });
    return updatedAnoLetivo;
}
    
