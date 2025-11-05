import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { hash_password } from "../helper/encryption";
import { validate } from "uuid";
import { generateRandomNumber } from "../helper/random";

const prisma = new PrismaClient();

export const createAluno = async (req: Request | any, res: Response) => {
    const { nome_completo, email, senha_hash, data_nascimento, genero, telefone, endereco, foto } = req.body;
    try {
        const existUsuario = await prisma.usuario.findFirst({
            where: {
                email: email,
            },
        });

        if (existUsuario) {
            return res.status(400).json({ message: "Usuário com esse email já existe" });
        }

        if (!nome_completo || !email || !senha_hash || !data_nascimento) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        const newUsuario = await prisma.usuario.create({
            data: {
                nome_completo,
                email,
                senha_hash: await hash_password(senha_hash),
                tipo_usuario: "ALUNO"
            },
        });

        const newAluno = await prisma.aluno.create({
            data: {
                data_nascimento: new Date(data_nascimento),
                usuario_id: newUsuario.id,
                numero_aluno: generateRandomNumber(6),
                genero,
                telefone,
                endereco,
                foto
            },
        });
        return res.status(201).json({
            ...newAluno,
            nome_completo: newUsuario.nome_completo,
            email: newUsuario.email,
            tipo_usuario: newUsuario.tipo_usuario
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao criar aluno", error: error.message });
    }
};

export const getAlunos = async (req: Request, res: Response) => {
    try {
        const alunos = await prisma.aluno.findMany();

        const alunosWithUserData = await Promise.all(alunos.map(async (aluno) => {
            const user = await prisma.usuario.findUnique({
                where: { id: aluno.usuario_id },
            });
            return {
                ...aluno,
                nome_completo: user?.nome_completo,
                email: user?.email,
            };
        }));

        return res.status(200).json(alunosWithUserData);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar alunos", error: error.message });
    }
};

export const getAlunoById = async (req: Request, res: Response) => {
    const { alunoId } = req.params;

    if (!alunoId || !validate(alunoId)) {
        return res.status(400).json({ message: "ID de aluno inválido" });
    }

    try {
        const aluno = await prisma.aluno.findUnique({
            where: { id: alunoId },
        });

        const user = await prisma.usuario.findUnique({
            where: { id: aluno?.usuario_id },
        });

        if (!aluno) {
            return res.status(404).json({ message: "Aluno não encontrado" });
        }

        return res.status(200).json({
            ...aluno,
            nome_completo: user?.nome_completo,
            email: user?.email,
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar aluno", error: error.message });
    }
}

export const updateAluno = async (req: Request, res: Response) => {
    const { alunoId } = req.params;
    const { nome_completo, email, data_nascimento, genero, telefone, endereco, foto } = req.body;

    if (!alunoId || !validate(alunoId)) {
        return res.status(400).json({ message: "ID de aluno inválido" });
    }
    const exitAluno = await prisma.aluno.findUnique({
        where: { id: alunoId },
    });

    if (!exitAluno) {
        return res.status(404).json({ message: "Aluno não encontrado" });
    }

    try {

        const existUsuario = await prisma.usuario.findUnique({
            where: { id: exitAluno.usuario_id },
        });

        if (!existUsuario) {
            return res.status(404).json({ message: "Usuário do aluno não encontrado" });
        }

        if (nome_completo || email) {
            await prisma.usuario.update({
                where: { id: existUsuario.id },
                data: {
                    nome_completo: nome_completo ? nome_completo : existUsuario.nome_completo,
                    email: email ? email : existUsuario.email
                },
            });
        }

        const updatedAluno = await prisma.aluno.update({
            where: { id: alunoId },
            data: {
                data_nascimento: data_nascimento ? new Date(data_nascimento) : exitAluno.data_nascimento || undefined,
                genero: genero ? genero : exitAluno.genero,
                telefone: telefone ? telefone : exitAluno.telefone,
                endereco: endereco ? endereco : exitAluno.endereco,
                foto: foto ? foto : exitAluno.foto
            },
        });

        return res.status(200).json(updatedAluno);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao atualizar aluno", error: error.message });
    }
}

export const deleteAluno = async (req: Request, res: Response) => {
    const { alunoId } = req.params;

    if (!alunoId || !validate(alunoId)) {
        return res.status(400).json({ message: "ID de aluno inválido" });
    }

    try {
        const aluno = await prisma.aluno.findUnique({
            where: { id: alunoId },
        });

        if (!aluno) {
            return res.status(404).json({ message: "Aluno não encontrado" });
        }

        const existUsuario = await prisma.usuario.findUnique({
            where: { id: aluno.usuario_id },
        });

        await prisma.aluno.delete({
            where: { id: alunoId },
        });

        if (existUsuario) {
            await prisma.usuario.delete({
                where: { id: existUsuario.id },
            });
        }

        return res.status(200).json({ message: "Aluno deletado com sucesso" });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao deletar aluno", error: error.message });
    }
};