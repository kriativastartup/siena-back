import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { hash_password } from "../helper/encryption";
import { validate } from "uuid";


const prisma = new PrismaClient();

export const getProfessores = async (req: Request, res: Response) => {
    try {
        const professores = await prisma.professor.findMany();
        return res.status(200).json(professores);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar professores", error: error.message });
    }
};

export const createProfessor = async (req: Request | any, res: Response) => {
    const { nome_completo, email, senha_hash, especialidade, telefone, escola_id } = req.body;
    try {
        const existUsuario = await prisma.usuario.findFirst({
            where: {
                email: email,
            },
        });

        if (existUsuario) {
            return res.status(400).json({ message: "Usuário com esse email já existe" });
        }

        if (!nome_completo || !email || !senha_hash || !especialidade) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        const newUsuario = await prisma.usuario.create({
            data: {
                nome_completo,
                email,
                senha_hash: await hash_password(senha_hash),
                tipo_usuario: "PROFESSOR"
            },
        });

        const newProfessor = await prisma.professor.create({
            data: {
                especialidade,
                usuario_id: newUsuario.id,
                escola_id: escola_id,
                data_contratacao: new Date(),
                numero_professor: telefone
            },
        });
        return res.status(201).json(newProfessor);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao criar professor", error: error.message });
    }
};


export const getProfessorById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!validate(id)) {
        return res.status(400).json({ message: "ID de professor inválido" });
    }

    try {
        const professor = await prisma.professor.findUnique({
            where: { id },
        });

        const user = await prisma.usuario.findUnique({
            where: { id: professor?.usuario_id },
        });

        if (!professor) {
            return res.status(404).json({ message: "Professor não encontrado" });
        }

        return res.status(200).json({
            ...professor,
            nome_completo: user?.nome_completo,
            email: user?.email,
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar professor", error: error.message });
    }
};

export const updateProfessor = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { especialidade, telefone } = req.body;

    if (!validate(id)) {
        return res.status(400).json({ message: "ID de professor inválido" });
    }

    try {
        const updatedProfessor = await prisma.professor.update({
            where: { id },
            data: {
                especialidade,
                numero_professor: telefone
            },
        });

        return res.status(200).json(updatedProfessor);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao atualizar professor", error: error.message });
    }
};

export const deleteProfessor = async (req: Request, res: Response) => {
    const { professorId } = req.params;

    if (!validate(professorId)) {
        return res.status(400).json({ message: "ID de professor inválido" });
    }

    try {
        const professor = await prisma.professor.findUnique({
            where: { id: professorId },
        });

        if (!professor) {
            return res.status(404).json({ message: "Professor não encontrado" });
        }
        await prisma.usuario.delete({
            where: { id: professor.usuario_id },
        });

        await prisma.professor.delete({
            where: { id: professorId }
        });

        return res.status(200).json({ message: "Professor deletado com sucesso" });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao deletar professor", error: error.message });
    }
}