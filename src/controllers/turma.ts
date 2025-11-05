import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { hash_password } from "../helper/encryption";
import { validate } from "uuid";


const prisma = new PrismaClient();

export const getTurmas = async (req: Request, res: Response) => {
    try {
        const escolaId = req.query.escolaId as string;
        const turmas = await prisma.turma.findMany({
            where: { escola_id: escolaId },
        });
        return res.status(200).json(turmas);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar turmas", error: error.message });
    }
}

export const createTurma = async (req: Request | any, res: Response) => {
    const { nome, ano_escolaridade, escola_id, ano_letivo_id } = req.body;
    try {
        if (!nome || !ano_escolaridade) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios" });
        }

        if (!escola_id || validate(escola_id)) {
            return res.status(400).json({
                message: "O ID da escola é inválido"
            });
        }

        if (!ano_letivo_id || validate(ano_letivo_id)) {
            return res.status(400).json({
                message: "O ID da ano letivo é inválido"
            });
        }

        const exitAnoLetivo = await prisma.academic_year.findFirst({
            where: {
                id: ano_letivo_id
            }
        });

        if (!exitAnoLetivo || !exitAnoLetivo.nome) {
            return res.status(400).json({
                message: "Ano letivo não encontrado ou o seu nome não especificado"
            });
        }

        const newTurma = await prisma.turma.create({
            data: {
                nome,
                ano_letivo: exitAnoLetivo.nome,
                ano_escolaridade,
                escola_id,
                academic_year_id : ano_letivo_id
            },
        });
        return res.status(201).json(newTurma);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao criar turma", error: error.message });
    }
}

export const getTurmaById = async (req : Request | any, res : Response) => {

}

export const updateTurmaId = async (req : Request | any, res : Response) => {

}

export const deleteTurmaId = async (req : Request | any, res : Response) => {

}
