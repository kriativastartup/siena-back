import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hash_password } from "../helper/encryption";
import { validate } from "uuid";

import * as dto  from "../services/escolas/dto/escola.dto";
import * as services from "../services/escolas";

const prisma = new PrismaClient();

export type PropsResponseBad = {
    status: number;
    message: string;
};

// ESCOLAS
export const getEscolas = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const search = req.query.search as string || undefined;

    const result = await services.getAllEscolasService(limit, page, search);
    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Erro ao buscar escolas", error: error.message });
  }
};

export const createEscola = async (req: Request | any, res: Response) => {
  const {
    nome,
    natureza,
    codigo_mec,
    nif,
    localizacao: { endereco, cidade, provincia, pais },
    contacto: { telefone, outro_telefone, email, outro_email },
    logo_url,
  }: dto.CreateEscolaDTO = req.body;

   try {
    const result = await services.createEscolaService({
        nome,
        natureza,
        codigo_mec,
        nif,
        localizacao: { endereco, cidade, provincia, pais },
        contacto: { telefone, outro_telefone, email, outro_email },
        logo_url,
    });
    if (result && (typeof result === "object" && (result as PropsResponseBad).status)) {
      return res.status((result as PropsResponseBad).status).json({ message: (result as PropsResponseBad).message });
    }
    return res.status(201).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Erro ao criar escola", error: error.message });
  }
};

export const getEscolaById = async (req: Request, res: Response) => {
  const { escola_id } = req.params;
  try {
    const result = await services.getEscolaByIdService(escola_id);
    if (result && (typeof result === "object" && (result as PropsResponseBad).status)) {
      return res.status((result as PropsResponseBad).status).json({ message: (result as PropsResponseBad).message });
    }
    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Erro ao buscar escola", error: error.message });
  }
};

export const updateEscola = async (req: Request, res: Response) => {
  const { escola_id } = req.params;
  if (!validate(escola_id)) {
    return res.status(400).json({ message: "ID da escola inválido" });
  }
  const {
    nome,
    natureza,
    codigo_mec,
    nif,
    localizacao: { endereco, cidade, provincia, pais },
    contacto: { telefone, outro_telefone, email, outro_email },
    logo_url,
  }: dto.CreateEscolaDTO = req.body;

  try {
    const result = await services.updateEscolaService(escola_id, {
        nome,
        natureza,
        codigo_mec,
        nif,
        localizacao: { endereco, cidade, provincia, pais },
        contacto: { telefone, outro_telefone, email, outro_email },
        logo_url,
    });
    if (result && (typeof result === "object" && (result as PropsResponseBad).status)) {
      return res.status((result as PropsResponseBad).status).json({ message: (result as PropsResponseBad).message });
    }
    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Erro ao atualizar escola", error: error.message });
  }
};

export const deleteEscola = async (req: Request, res: Response) => {
  const { escola_id } = req.params;
  try {
    const result = await services.deleteEscolaService(escola_id);
    if (result && (typeof result === "object" && (result as PropsResponseBad).status)) {
      return res.status((result as PropsResponseBad).status).json({ message: (result as PropsResponseBad).message });
    }
    return res.status(200).json({ message: "Escola deletada com sucesso" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Erro ao deletar escola", error: error.message });
  }
};

