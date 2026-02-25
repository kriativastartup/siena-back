import { Request, Response } from "express";
import { validate } from "uuid";
import * as ProfessorDTO from "../services/professores/dto/professor.dto";
import * as services from "../services/professores";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProfessor = async (req: Request, res: Response) => {

    try {
        const createDTO: ProfessorDTO.CreateProfessorDTO = req.body;

        const result = await services.createProfessorService(createDTO);

        if ("status" in result && "message" in result) {
            return res.status(result.status).json({ message: result.message });
        }

        return res.status(201).json(result);

    } catch (error: any) {
        return res.status(500).json({
            message: "Erro ao criar professor",
            error: error.message
        });
    }
};

export const getProfessorById = async (req: Request, res: Response) => {

    const { professor_id } = req.params;

    if (!professor_id || !validate(professor_id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    const result = await services.getProfessorByIdService(professor_id);

    if ("status" in result && "message" in result) {
        return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json(result);
};

export const getMeProfessor = async (req: Request | any, res: Response) => {

    const userId = req.userId;

    if (!userId || !validate(userId)) {
        return res.status(400).json({ message: "ID de usuário inválido, faça login" });
    }

    const existUser = await prisma.usuario.findFirst({
        where: {
            id: userId,
        }
    });

    if (!existUser) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const existProfessor = await prisma.professor.findFirst({
        where: {
            pessoa_id: existUser.pessoa_id,
        }
    });

    if (!existProfessor) {
        return res.status(403).json({ message: "Você não é um professor, verifique as suas permissões." });
    }

    const result = await services.getProfessorByIdService(existProfessor.id);

    if ("status" in result && "message" in result) {
        return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json(result);
};

export const updateProfessor = async (req: Request | any, res: Response) => {
    const userId = req.userId;
    if (!userId || !validate(userId)) {
        return res.status(400).json({ message: "ID de usuário inválido, faça login" });
    }
    const existUser = await prisma.usuario.findFirst({
        where: {
            id: userId,
        }
    });

    if (!existUser) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

   const existProfessor = await prisma.professor.findFirst({
        where: {
            pessoa_id: existUser.pessoa_id,
        }
    });

    if (!existProfessor) {
        return res.status(403).json({ message: "Você não é um professor, verifique as suas permissões." });
    }

    const professor_id = existProfessor.id;
    if (!professor_id || !validate(professor_id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    const result = await services.updateProfessorService(
        professor_id,
        req.body
    );

    if ("status" in result && "message" in result) {
        return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json(result);
};

export const getProfessoresByEscola = async (req: Request | any, res: Response) => {

    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const offset = (page - 1) * limit;
    const search = `${req.query.search || ""}`.trim();
    const userId = req.userId;
    const escola_id = req.params.escola_id;

    const existUser = await prisma.usuario.findFirst({
        where: {
            id: userId,
        }
    });

    if (!existUser) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }
    
    const existProfessor = await prisma.professor.findFirst({
        where: {
            pessoa_id: existUser.pessoa_id,
        }
    });

    const exitFuncionario = await prisma.funcionario.findFirst({
        where: {
            pessoa_id: existUser.pessoa_id,
        }
    });

    if (existProfessor?.escola_id !== escola_id && exitFuncionario?.escola_id == escola_id
        && existUser.tipo_usuario !== "ADMIN_ESCOLA"
    ) {
        return res.status(403).json({ message: "Você não pode acessar esse recurso, verifique suas permissões." });
    }


    if (!escola_id || !validate(escola_id)) {
        return res.status(400).json({ message: "ID de escola inválido" });
    }

    try {
        const professores = await services.getAllProfessoresByEscolaService(escola_id, limit, offset, search);

        if ("status" in professores && "message" in professores && typeof professores.status === "number") {
            return res.status(professores.status).json({ message: professores.message });
        }

        return res.status(200).json(professores);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar professores", error: error.message });
    }
};
