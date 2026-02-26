import * as services from "../services/funcionarios";
import * as dto from "../services/funcionarios/dto/funcionario";
import { PrismaClient } from "@prisma/client";
import { validate } from "uuid";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const createFuncionario = async (req: Request, res: Response) => {
    try {
        const createDTO: dto.CreateFuncionarioDTO = req.body;

        const existEscola = await prisma.escola.findFirst({
            where: { id: createDTO.escola_id }
        });

        if (!existEscola) {
            return res.status(404).json({ message: "Escola não encontrada" });
        }

        const result = await services.createFuncionarioService(createDTO);
        if ("status" in result && "message" in result) {
            return res.status(result.status).json({ message: result.message });
        }

        return res.status(201).json(result);
    } catch (error: any) {
        return res.status(500).json({
            message: "Erro ao criar funcionário",
            error: error.message
        });
    }
};

export const getFuncionarioById = async (req: Request, res: Response) => {

    const { funcionario_id } = req.params;

    if (!funcionario_id || !validate(funcionario_id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    const result = await services.getFuncionarioByIdService(funcionario_id);

    if ("status" in result && typeof result.status === "number" && "message" in result) {
        return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json(result);
};

export const getMeFuncionario = async (req: Request | any, res: Response) => {

    const userId = req.userId;

    if (!userId || !validate(userId)) {
        return res.status(400).json({ message: "ID de usuário inválido, faça login" });
    }

    const result = await services.getMeFuncionarioService(userId);

    if ("status" in result && typeof result.status === "number" && "message" in result) {
        return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json(result);
};

export const getFuncionariosByEscola = async (req: Request | any, res: Response) => {

    const escola_id = req.params.escola_id;
    const user_id = req.userId;

    if (!escola_id || !validate(escola_id)) {
        return res.status(400).json({ message: "ID de escola inválido" });
    }

    const existUsuario = await prisma.usuario.findFirst({
        where: { id: user_id },
    });

    if (!existUsuario) {
        return { status: 404, message: "Usuário não encontrado" };
    }

    const exitFuncionario = await prisma.funcionario.findFirst({
        where: { pessoa_id: existUsuario.pessoa_id },
    });

    if (!exitFuncionario) {
        return { status: 404, message: "Funcionário não encontrado" };
    }

    const existProfessor = await prisma.professor.findFirst({
        where: { pessoa_id: existUsuario.pessoa_id },
    });

    if (exitFuncionario.escola_id !== escola_id 
        && existUsuario.tipo_usuario !== "SUPER_ADMIN"
        && existProfessor?.escola_id !== escola_id
    ) {
        return { status: 403, message: "Você não tem permissão para acessar os funcionários desta escola" };
    }

    const result = await services.pegarFuncionariosDeUmaEscola(escola_id);

    if ("status" in result && "message" in result) {
        return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json(result);
};

export const updateFuncionario = async (req: Request | any, res: Response) => {
    const userId = req.userId;

    if (!userId || !validate(userId)) {
        return res.status(400).json({ message: "ID de usuário inválido, faça login" });
    }

    const existUsuario = await prisma.usuario.findFirst({
        where: { id: userId }
    });

    if (!existUsuario) {
        return res.status(404).json({ message: "Usuário não encontrado, faça login novamente" });
    }

    const findFuncionario = await prisma.funcionario.findFirst({
        where: { pessoa_id: existUsuario.pessoa_id }
    });

    const funcionario_id = findFuncionario?.id;


    if (!funcionario_id || !validate(funcionario_id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    const updateDTO: dto.UpdateFuncionarioDTO = req.body;

    const result = await services.updateFuncionarioService(
        funcionario_id,
        updateDTO
    );

    if ("status" in result && "message" in result) {
        return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json(result);
};

export const pegarFuncionariosDeUmaEscola = async (req: Request, res: Response) => {
    try {
        const { escola_id } = req.params;

        if (!escola_id || !validate(escola_id)) {
            return res.status(400).json({ message: "ID de escola inválido" });
        }

        const funcionarios = await services.pegarFuncionariosDeUmaEscola(escola_id);

        if ("status" in funcionarios && "message" in funcionarios && typeof funcionarios.status === "number") {
            return res.status(funcionarios.status).json({ message: funcionarios.message });
        }
        return res.status(200).json(funcionarios);
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao pegar funcionários",
            error: error instanceof Error ? error.message : "Erro desconhecido"
        });
    }
};
