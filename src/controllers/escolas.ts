import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { hash_password } from "../helper/encryption";
import { validate } from "uuid";

const prisma = new PrismaClient();

export const getEscolas = async (req: Request, res: Response) => {
    try {
        const escolas = await prisma.escola.findMany();
        return res.status(200).json(escolas);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar escolas", error: error.message });
    }
};

export const createEscola = async (req: Request | any, res: Response) => {

    const { nome, endereco, telefone, email, logo_url, natureza, nif, codigo_mec } = req.body;
    const { nome_completo, senha_hash } = req.body;
    try {

        const existUsuario = await prisma.usuario.findFirst({
            where: {
                email: email,
            },
        });

        if (existUsuario) {
            return res.status(400).json({ message: "Usuário com esse email já existe" });
        }


        const UserAdmin = await prisma.usuario.create({
            data: {
                nome_completo: "ADMIN",
                email,
                senha_hash: await hash_password(senha_hash),
                tipo_usuario: "ADMIN"
            },
        });
        if (!nome || !endereco || !telefone || !email || !natureza || !codigo_mec) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        const newEscola = await prisma.escola.create({
            data: {
                nome,
                endereco,
                telefone,
                email,
                logo_url,
                natureza,
                nif,
                codigo_mec,
                usuario_id: UserAdmin.id,
            },
        });
        return res.status(201).json(newEscola);

    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao criar escola", error: error.message });
    }
};

export const getEscolaById = async (req: Request, res: Response) => {
    const { schoolId } = req.params;
    if (!schoolId || validate(schoolId) === false) {
        return res.status(400).json({ message: "ID de escola inválido" });
    }
    try {
        const escola = await prisma.escola.findUnique({
            where: { id: schoolId },
        });
        if (!escola) {
            return res.status(404).json({ message: "Escola não encontrada" });
        }
        return res.status(200).json(escola);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar escola", error: error.message });
    }
};

export const updateEscola = async (req: Request, res: Response) => {
    const { schoolId } = req.params;
    const { nome, endereco, telefone, email, logo_url, natureza, nif, codigo_mec } = req.body;
    const { nome_completo } = req.body;

    if (!schoolId || validate(schoolId) === false) {
        return res.status(400).json({ message: "ID de escola inválido" });
    }
    try {
        const existSchool = await prisma.escola.findUnique({
            where: { id: schoolId },
        });

        if (!existSchool) {
            return res.status(404).json({ message: "Escola não encontrada" });
        }

        const user = await prisma.usuario.findUnique({
            where: { id: existSchool?.usuario_id },
        });
        if (user && nome_completo) {
            await prisma.usuario.update({
                where: { id: user.id },
                data: {
                    nome_completo: nome_completo || user.nome_completo,
                },
            });
        }
        const updatedEscola = await prisma.escola.update({
            where: { id: schoolId },
            data: {
                nome: nome || existSchool.nome,
                endereco: endereco || existSchool.endereco,
                telefone: telefone || existSchool.telefone,
                email: email || existSchool.email,
                logo_url: logo_url || existSchool.logo_url,
                natureza: natureza || existSchool.natureza,
                nif: nif || existSchool.nif || "N/A",
                codigo_mec: codigo_mec || existSchool.codigo_mec
            },
        });


        return res.status(200).json(updatedEscola);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao atualizar escola", error: error.message });
    }
};

export const deleteEscola = async (req: Request, res: Response) => {
    const { schoolId } = req.params;

    if (!schoolId || validate(schoolId) === false) {
        return res.status(400).json({ message: "ID de escola inválido" });
    }
    try {
        const existSchool = await prisma.escola.findUnique({
            where: { id: schoolId },
        });
        if (!existSchool) {
            return res.status(404).json({ message: "Escola não encontrada" });
        }
        const existeUsuario = await prisma.usuario.findUnique({
            where: { id: existSchool.usuario_id },
        });
        if (existeUsuario) {
            await prisma.usuario.delete({
                where: { id: existeUsuario?.id },
            });
        }
        await prisma.escola.delete({
            where: { id: schoolId },
        });
        return res.status(200).json({ message: "Escola deletada com sucesso" });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao deletar escola", error: error.message });
    }
}