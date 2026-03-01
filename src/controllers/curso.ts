import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { validate } from "uuid";
import * as dto from "../services/cursos/dto/curso.dto";
import * as service from "../services/cursos";
import { checkSchoolPermission } from "../services/permission/permission_school"; 

const prisma = new PrismaClient();

export const getCursoById = async (req: Request, res: Response) => {
   const { curso_id } = req.params;
   
   if (!curso_id || !validate(curso_id)) {
       return res.status(400).json({ message: "ID de curso inválido" });
   }

    try {
        const curso = await service.getCursoById(curso_id);

        if (!curso) {
            return res.status(404).json({ message: "Curso não encontrado" });
        }

        if (curso && "status" in curso && "message" in curso && typeof curso.status === "number") {
            return res.status(curso.status).json({ message: curso.message });
        }

        return res.status(200).json(curso);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar curso", error: error.message });
    }
};


export const createCurso = async (req: Request, res: Response) => {
  const { nome, descricao, abreviacao, escola_id } = req.body;

  try {
      const createCursoDTO: dto.CreateCursoDTO = { nome, descricao, abreviacao, escola_id };
      const curso = await service.createCurso(createCursoDTO);

      if (curso && "status" in curso && "message" in curso && typeof curso.status === "number") {
          return res.status(curso.status).json({ message: curso.message });
      }

      return res.status(201).json(curso);
  } catch (error: any) {
      return res.status(500).json({ message: "Erro ao criar curso", error: error.message });
  }
};


export const getCursosByEscola = async (req: Request | any, res: Response) => {
    const { escola_id } = req.params;
    const userId = req.userId ;
    const { limit = 10, page = 1, search } = req.query;

    if (!escola_id || !validate(escola_id)) {
        return res.status(400).json({ message: "ID de escola inválido" });
    }

    const hasPermission = checkSchoolPermission(req.userId, escola_id);

    if (!hasPermission) {
        return res.status(403).json({ message: "Você não tem permissão para acessar esta escola" });
    }

    try {
        const cursos = await service.getAllCursos(escola_id, Number(limit), Number(page), String(search));

        if (cursos && "status" in cursos && "message" in cursos && typeof cursos.status === "number") {
            return res.status(cursos.status).json({ message: cursos.message });
        }

        return res.status(200).json(cursos);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar cursos", error: error.message });
    }
};

export const updateCurso = async (req: Request, res: Response) => {
    const { curso_id } = req.params;
    const { nome, descricao, abreviacao } = req.body;

    if (!curso_id || !validate(curso_id)) {
        return res.status(400).json({ message: "ID de curso inválido" });
    }

    try {
        const updateCursoDTO: dto.UpdateCursoDTO = { nome, descricao, abreviacao };
        const updatedCurso = await service.updateCurso(curso_id, updateCursoDTO);

        if (updatedCurso && "status" in updatedCurso && "message" in updatedCurso && typeof updatedCurso.status === "number") {
            return res.status(updatedCurso.status).json({ message: updatedCurso.message });
        }

        return res.status(200).json(updatedCurso);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao atualizar curso", error: error.message });
    }
};

export const deleteCurso = async (req: Request, res: Response) => {
   return res.status(400).json({ message: "Exclusão de curso não permitida. Cursos associados a turmas não podem ser excluídos." });
};
