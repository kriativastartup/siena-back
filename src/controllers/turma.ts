import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { validate } from "uuid";
import * as dto from "../services/turmas/dto/turma.dto";
import * as service from "../services/turmas/index";


const prisma = new PrismaClient();

export const getTurmas = async (req: Request, res: Response) => {
    try {
        const escolaId = req.params.escola_id as string;
        const limit = parseInt(req.query.limit as string) || 100;
        const page = parseInt(req.query.page as string) || 1;
        const offset = (page - 1) * limit;
        if (!escolaId || !validate(escolaId)) {
            return res.status(400).json({ message: "ID de escola inválido" });
        }

        const turmas = await service.getTurmas(escolaId, limit, offset);

        if ("status" in turmas && "message" in turmas) {
            return res.status(turmas.status).json({ message: turmas.message });
        }

        return res.status(200).json(turmas);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar turmas", error: error.message });
    }
}

export const createTurma = async (req: Request | any, res: Response) => {
    const { nome, escola_id, ano_letivo, turno, classe, capacidade, curso_id, ano_letivo_id } = req.body;
    const turmaData : dto.CreateTurmaDTO = {
       nome,
       escola_id,
       curso_id,
       ano_letivo,
       ano_letivo_id,
       turno,
       classe,
       capacidade
    };

    try {
        const turma = await service.createTurma(turmaData);
        if ("status" in turma && "message" in turma) {
            return res.status(turma.status).json({ message: turma.message });
        }
        return res.status(201).json(turma);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao criar turma", error: error.message });
    }
}

export const getTurmaById = async (req: Request | any, res: Response) => {
    const { turma_id } = req.params;

    if (!turma_id || !validate(turma_id)) {
        return res.status(400).json({ message: "ID de turma inválido" });
    }

    try {
        const turma = await service.getTurmaById(turma_id);

        if (!turma) {
            return res.status(404).json({ message: "Turma não encontrada" });
        }

        if ("status" in turma && "message" in turma) {
            return res.status(turma.status).json({ message: turma.message });
        }

        return res.status(200).json(turma);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar turma por ID", error: error.message });
    }
}

export const updateTurmaId = async (req: Request | any, res: Response) => {
    const { turma_id } = req.params;
    const { nome, escola_id, ano_letivo, turno, classe, capacidade, curso_id } = req.body;

    if (!turma_id || !validate(turma_id)) {
        return res.status(400).json({ message: "ID de turma inválido" });
    }

    const turmaData: dto.UpdateTurmaDTO = {
        nome,
        escola_id,
        curso_id,
        ano_letivo,
        turno,
        classe,
        capacidade
    };

    try {
        const turma = await service.updateTurma(turma_id, turmaData);

        if ("status" in turma && "message" in turma) {
            return res.status(turma.status).json({ message: turma.message });
        }

        return res.status(200).json(turma);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao atualizar turma", error: error.message });
    }

}

export const deleteTurma = async (req: Request | any, res: Response) => {
   return res.status(200).json({ message: "Funcionalidade de deletar turma ainda não implementada" });
}
