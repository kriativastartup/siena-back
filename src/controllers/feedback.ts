import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import * as dto from "../dtos/feedback.schema";
const prisma = new PrismaClient();
import { validate } from "uuid";

type FeedbackType = "SOLICITACAO" | "SUGESTAO" | "RECLAMACAO" | "ELOGIO" | "OUTRO";
type FeedbackState = "PENDENTE" | "EM_ANALISE" | "RESOLVIDO" | "REJEITADO" | "GUARDADO";

export const createFeedback = async (req: Request, res: Response) => {
    try {
        // tipo - SOLICITACAO| SUGESTAO | RECLAMACAO | ELOGIO | OUTRO
        const { name, email, assunto, mensagem, tipo }: dto.CreateFeedbackDTO = req.body;

        const feedback = await prisma.feedback.create({
            data: {
                name,
                email,
                assunto,
                mensagem,
                tipo: tipo.toUpperCase() as FeedbackType, // Convertendo para maiúsculas para garantir a correspondência com o enum
            },
        });
        res.status(201).json(dto.ResponseFeedbackSchema.parse(feedback));
    } catch (error) {
        console.error("Error creating feedback:", error);
        res.status(500).json({ message: "An error occurred while creating feedback." });
    }
};

export const getAllFeedbacks = async (req: Request, res: Response) => {
    try {
        
        const filterTipo: FeedbackType | undefined = req.query.tipo as FeedbackType | undefined;
        const filterEstado: FeedbackState | undefined = req.query.estado as FeedbackState | undefined;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        let whereClause = {};
        if (filterTipo) {
            whereClause = {
                ...whereClause,
                tipo: filterTipo.toUpperCase() as FeedbackType, // Convertendo para maiúsculas para garantir a correspondência com o enum
            };
        }
        if (filterEstado) {
            whereClause = {
                ...whereClause,
                estado: filterEstado.toUpperCase() as FeedbackState, // Convertendo para maiúsculas para garantir a correspondência com o enum
            };
        }
        const feedbacks = await prisma.feedback.findMany({
            where: whereClause,
            orderBy: { data_criacao: "desc" },
            skip,
            take: limit,
        });

        const ResponseFeedbacks = feedbacks.map(feedback => dto.ResponseFeedbackSchema.parse(feedback));
        res.status(200).json(ResponseFeedbacks);
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(400).json({ message: "Um erro ocorreu ao buscar os feedbacks, verifique os filtros." });
    }
};

export const getFeedbackById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const feedback = await prisma.feedback.findUnique({
            where: { id },
        });

        if (!feedback) {
            return res.status(404).json({ message: "Feedback não encontrado." });
        }

        res.status(200).json(dto.ResponseFeedbackSchema.parse(feedback));
    } catch (error) {
        console.error("Error fetching feedback by ID:", error);
        res.status(500).json({ message: "Um erro ocorreu ao buscar o feedback." });
    }
};

export const updateFeedbackState = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // estado - PENDENTE | EM_ANALISE | RESOLVIDO | REJEITADO | GUARDADO
        const { estado }: { estado: FeedbackState } = req.body;

        if (!validate(id)) {
            return res.status(400).json({ message: "ID de feedback inválido." });
        }

        const feedback = await prisma.feedback.update({
            where: { id },
            data: { estado: estado.toUpperCase() as FeedbackState }, // Convertendo para maiúsculas para garantir a correspondência com o enum
        });

        res.status(200).json(dto.ResponseFeedbackSchema.parse(feedback));
    } catch (error) {
        console.error("Error updating feedback state:", error);
        res.status(500).json({ message: "Um erro ocorreu ao atualizar o estado do feedback." });
    }
}