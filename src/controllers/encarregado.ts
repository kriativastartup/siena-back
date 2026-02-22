import { Request, Response } from "express";
import { validate } from "uuid";
import * as EncarregadoDTO from "../services/encarregado/dto/encarregado.dto";
import * as services from "../services/encarregado";

export const createEncarregado = async (req: Request, res: Response) => {

    try {
        const createDTO: EncarregadoDTO.CreateEncarregadoDTO = req.body;

        const result = await services.createEncarregadoService(createDTO);

        if ("status" in result && "message" in result) {
            return res.status(result.status).json({ message: result.message });
        }

        return res.status(201).json(result);

    } catch (error: any) {
        return res.status(500).json({
            message: "Erro ao criar encarregado",
            error: error.message
        });
    }
};

export const getEncarregadoById = async (req: Request, res: Response) => {

    const { encarregado_id } = req.params;

    if (!encarregado_id || !validate(encarregado_id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    const result = await services.getEncarregadoByIdService(encarregado_id);

    if ("status" in result && "message" in result) {
        return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json(result);
};

export const getEncarregadoMe = async (req: Request | any, res: Response) => {

    const userId = req.userId;
    if (!userId || !validate(userId)) {
        return res.status(400).json({ message: "ID de usuário inválido" });
    }

    const result = await services.getEncarregadoByIdService(userId);

    if ("status" in result && "message" in result) {
        return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json(result);
};

export const updateEncarregado = async (req: Request, res: Response) => {

    const { encarregado_id } = req.params;

    if (!encarregado_id || !validate(encarregado_id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    const result = await services.updateEncarregadoService(
        encarregado_id,
        req.body
    );

    if ("status" in result && "message" in result) {
        return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json(result);
};
