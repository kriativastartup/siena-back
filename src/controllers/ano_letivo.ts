import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hash_password } from "../helper/encryption";
import { validate } from "uuid";
import * as AnoLetivoService from "../services/ano_letivo";
import * as AnoLetivoDTO from "../services/ano_letivo/dto/ano_letivo.dto";

const prisma = new PrismaClient();

export const getAnoLetivoById = async (req: Request, res: Response) => {
    const { ano_id } = req.params;

    const anoLetivo = await AnoLetivoService.getAnoLetivoById(ano_id);
    if (anoLetivo.status && (anoLetivo.status === 400 || anoLetivo.status === 404)) {
        return res.status(anoLetivo.status).json({ message: anoLetivo.message });
    }
    return res.status(200).json(anoLetivo);
};

export const createAnoLetivo = async (req: Request, res: Response) => {
    const { data_de_inicio, data_de_fim, escola_id } = req.body;

    try {
        const newAnoLetivo = await AnoLetivoService.createAnoLetivo({
            data_de_inicio,
            data_de_fim,
            escola_id
        });
        if ("status" in newAnoLetivo && newAnoLetivo.status === 400) {
            return res.status(400).json({
                message: newAnoLetivo.message
            });
        }
        if ("nome" in newAnoLetivo) {
            const existAnoLetivo = await prisma.ano_letivo.findFirst({
                where: {
                    escola_id,
                    nome: newAnoLetivo.nome
                }
            });
            if (existAnoLetivo) {
                return res.status(400).json({ message: "Já existe um ano letivo com o mesmo nome para esta escola" });
            }
        }
        return res.status(201).json(newAnoLetivo);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao criar Ano Letivo", error: error.message });
    }
};

export const getAnosLetivos = async (req: Request, res: Response) => {
    const escola_id = req.params.escola_id as string;
    try {
        const anosLetivos = await AnoLetivoService.getAnosLetivos(escola_id, 10, 1, '');
        return res.status(200).json(anosLetivos);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar Anos Letivos", error: error.message });
    }
};

export const updateAnoLetivo = async (req: Request, res: Response) => {
    const { ano_id } = req.params;
    const { data_de_inicio, data_de_fim } = req.body;

    if (!validate(ano_id)) {
        return res.status(400).json({ message: "ID do ano letivo inválido" });
    }

    try {
        const existAnoLetivo = await prisma.ano_letivo.findUnique({
            where: { id: ano_id },
        });

        if (!existAnoLetivo) {
            return res.status(404).json({ message: "Ano Letivo não encontrado" });
        }

        const updatedAnoLetivo = await prisma.ano_letivo.update({
            where: { id: ano_id },
            data: {
                data_de_inicio: new Date(data_de_inicio),
                data_de_fim: new Date(data_de_fim),
            },
        });

        return res.status(200).json(updatedAnoLetivo);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao atualizar Ano Letivo", error: error.message });
    }
};

