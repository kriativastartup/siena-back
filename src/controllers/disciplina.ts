import * as services from '../services/disciplinas/index';
import * as dto from '../services/disciplinas/dto/disciplina.dto';
import * as permissionService from '../services/permission/permission_school';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const criarDisciplina = async (req: Request, res: Response) => {
    try {
        const data : dto.CriarDisciplinaDTO = req.body;
        const result = await services.createDisciplina(data);
        if ('status' in result && result.status !== 201) {
            return res.status(result.status).json({ message: result.message });
        }
        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do servidor", error: error instanceof Error ? error.message : "Erro desconhecido" });
    }
};

export const getDisciplinaById = async (req: Request, res: Response) => {
    try {
        const { disciplina_id } = req.params;
        const result = await services.getDisciplinaById(disciplina_id);
        if (!result) {
            return res.status(404).json({ message: "Disciplina não encontrada" });
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
};

export const updateDisciplina = async (req: Request, res: Response) => {
    try {
        const { disciplina_id } = req.params;
        const data = req.body as dto.AtualizarDisciplinaDTO;
        const result = await services.updateDisciplina(disciplina_id, data);
        if ('status' in result && result.status !== 200) {
            return res.status(result.status).json({ message: result.message });
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do servidor", error: error instanceof Error ? error.message : "Erro desconhecido" });
    }
};

export const getAllDisciplinasDeUmaEscola = async (req: Request | any, res: Response) => {
    try {
        const escola_id = req.params.escola_id;
        const userId = req.userId; // ID do usuário autenticado

        const existEscola = await prisma.escola.findFirst({
            where: { id: escola_id }
        });

        if (!existEscola) {
            return res.status(404).json({ message: "Escola não encontrada" });
        }

        // Verificar se o usuário tem permissão para acessar as disciplinas da escola
        const hasPermission = await permissionService.checkSchoolPermission(userId, escola_id);
        if (!hasPermission) {
            return res.status(403).json({ message: "Acesso negado: você não tem permissão para acessar as disciplinas desta escola" });
        }
        const disciplinas = await services.todasAsDisciplinasDeUmaEscola(escola_id);
        return res.status(200).json(disciplinas);
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do servidor", error: error instanceof Error ? error.message : "Erro desconhecido" });
    }
};

