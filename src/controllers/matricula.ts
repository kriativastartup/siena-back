import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { validate } from "uuid";
import * as dto from "../services/matriculas/dto/matricula.dto";
import * as matriculaService from "../services/matriculas/index";
const prisma = new PrismaClient();

export const MatricularALuno = async (req: Request, res: Response) => {
    const { aluno_id, turma_id, escola_id, ano_letivo, classe, turno, status } = req.body;

    const createMatriculaData: dto.CreateMatriculaDTO = {
        aluno_id,
        turma_id,
        escola_id,
        ano_letivo,
        classe,
        turno,
        status
    };

    try {
        const matricula = await matriculaService.createMatricula(createMatriculaData);

        if ("status" in matricula && typeof matricula.status === "number") {
            return res.status(matricula.status).json({ message: matricula.message });
        }

        return res.status(201).json(matricula);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao matricular aluno", error: error.message });
    }

}

export const getMatriculaById = async (req: Request, res: Response) => {
    const { matricula_id } = req.params;

    if (!matricula_id || !validate(matricula_id)) {
        return res.status(400).json({ message: "ID de matrícula inválido" });
    }

    try {
        const matricula = await matriculaService.getMatriculaById(matricula_id);

        if ("status" in matricula && typeof matricula.status === "number") {
            return res.status(matricula.status).json({ message: matricula.message });
        }

        return res.status(200).json(matricula);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar matrícula", error: error.message });
    }
}

export const getAllMatriculas = async (req: Request, res: Response) => {
  const { escola_id } = req.params;
  const limit = parseInt(req.query.limit as string) || 10;
  const page = parseInt(req.query.page as string) || 1;
  const offset = (page - 1) * limit;
  const search = (req.query.search as string) || "";

  if (!validate(escola_id)) {
    return res.status(400).json({ message: "ID de escola inválido" });
  }

  try {
    const matriculas = await matriculaService.getAlunosMatriculados(escola_id, limit, offset, search);

    if ("status" in matriculas) {
      return res.status(matriculas.status).json({ message: matriculas.message });
    }

    return res.status(200).json(matriculas);
  } catch (error: any) {
    return res.status(500).json({ message: "Erro ao buscar matrículas", error: error.message });
  }
};

export const updateMatricula = async (req: Request, res: Response) => {
    const { matricula_id } = req.params;

    if (!matricula_id || !validate(matricula_id)) {
        return res.status(400).json({ message: "ID de matrícula inválido" });
    }

    const { turma_id, ano_letivo, classe, turno, status } = req.body;

    const updateMatriculaData: dto.UpdateMatriculaDTO = {
        turma_id,
        ano_letivo,
        classe,
        turno,
        status
    };

    try {
        const updatedMatricula = await matriculaService.updateMatricula(matricula_id, updateMatriculaData);

        if ("status" in updatedMatricula && typeof updatedMatricula.status === "number") {
            return res.status(updatedMatricula.status).json({ message: updatedMatricula.message });
        }

        return res.status(200).json(updatedMatricula);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao atualizar matrícula", error: error.message });
    }
};

export const deleteMatricula = async (req: Request, res: Response) => {
   return res.status(501).json({ message: "Funcionalidade de exclusão de matrícula ainda não implementada" });
}
