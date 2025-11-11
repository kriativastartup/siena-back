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
    const { nome_completo, senha } = req.body;
    try {

        const existUsuario = await prisma.usuario.findFirst({
            where: {
                email: email
            },
        });
        if (existUsuario) {
            return res.status(400).json({ message: "Usuário com esse email já existe" });
        }

        const existEscola = await prisma.escola.findFirst({
            where: {
                codigo_mec: codigo_mec
            },
        });

        if (existEscola) {
            return res.status(400).json({ message: "Escola com esse código MEC já existe" });
        }

        const UserAdmin = await prisma.usuario.create({
            data: {
                nome_completo: "ADMIN",
                email,
                senha_hash: await hash_password(senha),
                tipo_usuario: "ADMIN"
            },
        });
        if (!nome || !endereco || !telefone || !email || !natureza || !codigo_mec) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        if (natureza !== "publica" && natureza !== "privada" && natureza !== "hibrida") {
            return res.status(400).json({ error: "Natureza inválida" });
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
                nif: nif || existSchool.nif || "",
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
        const existSchool = await prisma.escola.findFirst({
            where: { id: schoolId },
        });

        if (!existSchool) {
            return res.status(404).json({ message: "Escola não encontrada" });
        }

        const existTurmas = await prisma.turma.findMany({
            where: { escola_id: schoolId },
        });
        if (existTurmas && existTurmas.length > 0) {
            await prisma.turma_disciplina.deleteMany({
                where: { turma_id: { in: existTurmas.map(t => t.id) } },
            });
            await prisma.professor_turma.deleteMany({
                where: { turma_id: { in: existTurmas.map(t => t.id) } },
            });
            await prisma.aluno_turma.deleteMany({
                where: { turma_id: { in: existTurmas.map(t => t.id) } },
            });

            await prisma.turma.deleteMany({
                where: { escola_id: schoolId },
            });
        }

        const existProfessores = await prisma.professor.findMany({
            where: { escola_id: schoolId },
        });
        if (existProfessores && existProfessores.length > 0) {

            await prisma.professor_turma.deleteMany({
                where: { professor_id: { in: existProfessores.map(p => p.id) } },
            });
            await prisma.turma.deleteMany({
                where: { escola_id: schoolId },
            });

            await prisma.professor.deleteMany({
                where: { escola_id: schoolId },
            });
        }

        const existMatriculas = await prisma.matricula.findMany({
            where: { escola_id: schoolId },
        });
        if (existMatriculas && existMatriculas.length > 0) {
            await prisma.matricula.deleteMany({
                where: { escola_id: schoolId },
            });
        }

        const existAlunos = await prisma.aluno.findMany({
            where: { escola_id: schoolId },
        });
        if (existAlunos && existAlunos.length > 0) {
            await prisma.aluno_turma.deleteMany({
                where: { aluno_id: { in: existAlunos.map(a => a.id) } },
            });
            await prisma.matricula.deleteMany({
                where: { escola_id: schoolId },
            });
            await prisma.nota.deleteMany({
                where: { aluno_id: { in: existAlunos.map(a => a.id) } },
            });
            await prisma.aluno_encarregado.deleteMany({
                where: { aluno_id: { in: existAlunos.map(a => a.id) } },
            });
            await prisma.aluno.deleteMany({
                where: { escola_id: schoolId },
            });
        }

        const existDisciplina = await prisma.disciplina.findMany({
            where: { escola_id: schoolId },
        });

        if (existDisciplina && existDisciplina.length > 0) {
            await prisma.nota.deleteMany({
                where: { disciplina_id: { in: existDisciplina.map(d => d.id) } },
            });

            await prisma.turma_disciplina.deleteMany({
                where: { disciplina_id: { in: existDisciplina.map(d => d.id) } },
            });

            await prisma.professor_turma.deleteMany({
                where: { turma_id: { in: existTurmas.map(t => t.id) } },
            });

            await prisma.disciplina.deleteMany({
                where: { escola_id: schoolId },
            });
        }

        const existAnosAcademicos = await prisma.academic_year.findMany({
            where: { escola_id: schoolId },
        });
        if (existAnosAcademicos && existAnosAcademicos.length > 0) {
            await prisma.academic_year.deleteMany({
                where: { escola_id: schoolId },
            });
        }

        const existUsuarios = await prisma.usuario.findMany({
            where: { id: existSchool.usuario_id },
        });
        if (existUsuarios && existUsuarios.length > 0) {
            await prisma.usuario.deleteMany({
                where: { id: existSchool.usuario_id },
            });
        }

        const existSchoolOld = await prisma.escola.findFirst({
            where: { id: schoolId },
        });

        if (existSchoolOld) {
            await prisma.escola.delete({
                where: { id: schoolId },
            });
        }

        return res.status(200).json({ message: "Escola deletada com sucesso" });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao deletar escola", error: error.message });
    }
}