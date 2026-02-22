import * as services from "../services/funcionarios";
import * as dto from "../services/funcionarios/dto/funcionario";
import { validate } from "uuid";
import { Request, Response } from "express";
import { ResponseFuncionarioDTO } from "../services/funcionarios/dto/funcionario";


export const createFuncionario = async (req: Request, res: Response) => {

    try {
        const createDTO: dto.CreateFuncionarioDTO = req.body;

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

export const getFuncionariosByEscola = async (req: Request, res: Response) => {

    const { escola_id } = req.params;

    if (!escola_id || !validate(escola_id)) {
        return res.status(400).json({ message: "ID de escola inválido" });
    }

    const result = await services.pegarFuncionariosDeUmaEscola(escola_id);

    if ("status" in result && "message" in result) {
        return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json(result);
};

export const updateFuncionario = async (req: Request, res: Response) => {

    const { funcionario_id } = req.params;

    if (!funcionario_id || !validate(funcionario_id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    const result = await services.updateFuncionarioService(
        funcionario_id,
        req.body
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

        const funcionarios  = await services.pegarFuncionariosDeUmaEscola(escola_id);

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
