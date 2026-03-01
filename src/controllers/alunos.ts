import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { validate } from "uuid";
import * as AlunoDTO from "../services/alunos/dto/alunos.dto";
import * as services from "../services/alunos";

const prisma = new PrismaClient();

export const createAluno = async (req: Request | any, res: Response) => {
    const { nome_completo, bi, dt_nascimento, sexo, telefone, nacionalidade, morada, email, n_processo, necessidades_especiais, foto, senha_hash, escola_id } = req.body;

    try {
        const createAlunoDTO: AlunoDTO.CreateAlunoDTO = {
            nome_completo,
            bi,
            dt_nascimento,
            sexo,
            telefone,
            nacionalidade,
            morada,
            email,
            n_processo,
            necessidades_especiais,
            foto,
            escola_id
        };

    

        const newAluno = await services.createAlunoService(createAlunoDTO);
        if ("status" in newAluno && "message" in newAluno && typeof newAluno.status === "number") {
            return res.status(newAluno.status as number).json({ message: newAluno.message });
        }
        return res.status(201).json(newAluno);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao criar aluno", error: error.message });
    }
};

export const getAlunosTurma = async (req: Request, res: Response) => {
    const { turma_id } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const offset =  (page - 1) * limit;
    const search = `${req.query.search || ""}`.trim();
    const alunos = await services.getAlunosTurmaService(turma_id, limit, offset, search);
    if ("status" in alunos && "message" in alunos && typeof alunos.status === "number") {
        return res.status(alunos.status).json({ message: alunos.message });
    }
    return res.status(200).json(alunos);
};

export const getAlunosEscola = async (req: Request, res: Response) => {
    const { escola_id } = req.params;
    const alunos = await services.getAlunosEscolaService(escola_id);
    if ("status" in alunos && "message" in alunos && typeof alunos.status === "number") {
        return res.status(alunos.status).json({ message: alunos.message });
    }
    return res.status(200).json(alunos);
};

export const getAlunoById = async (req: Request, res: Response) => {
    const { aluno_id } = req.params;

    if (!aluno_id || !validate(aluno_id)) {
        return res.status(400).json({ message: "ID de aluno inválido" });
    }

    const aluno = await services.getAlunoByIdService(aluno_id);
    if ("status" in aluno && "message" in aluno && typeof aluno.status === "number") {
        return res.status(aluno.status).json({ message: aluno.message });
    }
    return res.status(200).json(aluno);
}

export const getAlunoByMe = async (req: Request | any, res: Response) => {
    const userId = req.userId;

    if (!userId || !validate(userId)) {
        return res.status(400).json({ message: "ID de aluno inválido" });
    }

    const aluno = await services.getAlunoByIdService(userId);
    if ("status" in aluno && "message" in aluno && typeof aluno.status === "number") {
        return res.status(aluno.status).json({ message: aluno.message });
    }
    return res.status(200).json(aluno);
}

export const updateAluno = async (req: Request, res: Response) => {
    const { aluno_id } = req.params;
    const { nome_completo, bi, dt_nascimento, sexo, telefone, nacionalidade, morada, email, n_processo, necessidades_especiais, foto, status } = req.body;

    if (!aluno_id || !validate(aluno_id)) {
        return res.status(400).json({ message: "ID de aluno inválido" });
    }

    try {
        
        const existeAluno = await prisma.aluno.findFirst({ where: { id: aluno_id } });
        if (!existeAluno) {
            return res.status(404).json({ message: "Aluno não encontrado" });
        }

        const existePessoa = await prisma.pessoa.findFirst({ where: { id: existeAluno.pessoa_id } });
        if (!existePessoa) {
            return res.status(404).json({ message: "Pessoa associada ao aluno não encontrada" });
        }
        
        const updateAlunoDTO: AlunoDTO.UpdateAlunoDTO = {
            nome_completo : nome_completo || existePessoa.nome_completo,
            bi : bi || existePessoa.bi,
            dt_nascimento : dt_nascimento || existePessoa.dt_nascimento,
            sexo : sexo || existePessoa.sexo,
            telefone : telefone || existePessoa.telefone,
            nacionalidade : nacionalidade || existePessoa.nacionalidade,
            morada : morada || existePessoa.morada,
            email : email || existePessoa.email,
            n_processo : n_processo || existeAluno.n_processo,
            necessidades_especiais : necessidades_especiais || existeAluno.necessidades_especiais,
            foto : foto || existeAluno.foto,
            status : status || existeAluno.status
        };

        const updatedAluno = await services.updateAlunoService(aluno_id, updateAlunoDTO);
        if ("status" in updatedAluno && "message" in updatedAluno && typeof updatedAluno.status === "number") {
            return res.status(updatedAluno.status).json({ message: updatedAluno.message });
        }
        return res.status(200).json(updatedAluno);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao atualizar aluno", error: error.message });
    }
   
}

export const deleteAluno = async (req: Request, res: Response) => {
    return res.status(200).json({ message: "Funcionalidade de exclusão de aluno ainda não implementada" });
};
