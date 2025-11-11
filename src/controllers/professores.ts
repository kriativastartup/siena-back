import e, { Request, Response } from "express";
import { PrismaClient, tipo_avaliacao_enum } from "../generated/prisma/client";
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
        await prisma.professor_turma.deleteMany({
            where: { professor_id: professorId },
        });

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

export const InserirProfessorNaTurma = async (req: Request, res: Response) => {
    const { professorId, turmaId, disciplinaId } = req.body;

    if (!validate(professorId) || !validate(turmaId) || !validate(disciplinaId)) {
        return res.status(400).json({ message: "ID de professor, turma ou disciplina inválido" });
    }

    try {
        const existProfessorTurmaDisciplina = await prisma.professor_turma.findFirst({
            where: {
                professor_id: professorId,
                turma_id: turmaId,
                disciplina_id: disciplinaId
            }
        });
        if (existProfessorTurmaDisciplina) {
            return res.status(400).json({ message: "Esse professor já está atribuído a essa turma e disciplina" });
        }

        const professorTurma = await prisma.professor_turma.create({
            data: {
                professor_id: professorId,
                turma_id: turmaId,
                disciplina_id: disciplinaId
            }
        });

        return res.status(201).json(professorTurma);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao inserir professor na turma", error: error.message });
    }
};

export const RemoverProfessorDaTurma = async (req: Request, res: Response) => {
    const { professorTurmaId } = req.params;

    if (!validate(professorTurmaId)) {
        return res.status(400).json({ message: "ID de professor_turma inválido" });
    }

    try {
        await prisma.professor_turma.delete({
            where: { id: professorTurmaId },
        });

        return res.status(200).json({ message: "Professor removido da turma com sucesso" });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao remover professor da turma", error: error.message });
    }
};


// Criar uma avaliação para a turma
export const createAvaliacao = async (req: Request, res: Response) => {
    const { turma_id, disciplina_id, tipo_avaliacao, trimestre, descricao, data_avaliacao } = req.body;

    if (!validate(turma_id) || !validate(disciplina_id) || !trimestre || !data_avaliacao) {
        return res.status(400).json({ message: "Dados inválidos para criar avaliação" });
    }

    const tipoAvaliacao = tipo_avaliacao as tipo_avaliacao_enum;
    if (!Object.values(tipo_avaliacao_enum).includes(tipoAvaliacao)) {
        return res.status(400).json({ message: "Tipo de avaliação inválido" });
    }

    try {
        const avaliacao = await prisma.avaliacao.create({
            data: {
                turma_id,
                disciplina_id,
                trimestre,
                tipo_avaliacao: tipoAvaliacao,
                descricao,
                data_avaliacao: new Date(data_avaliacao)
            }
        });

        return res.status(201).json(avaliacao);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao criar avaliação", error: error.message });
    }
}

export const atribuirNota = async (req: Request, res: Response) => {
    const { avaliacao_id, disciplina_id, aluno_id, nota_obtida } = req.body;

    if (!validate(avaliacao_id) || !validate(disciplina_id) || !validate(aluno_id) || nota_obtida === undefined) {
        return res.status(400).json({ message: "Dados inválidos para atribuir nota" });
    }

    if (isNaN(parseFloat(nota_obtida))) {
        return res.status(400).json({ message: "Nota obtida inválida, coloque um número" });
    }

    try {
        const nota = await prisma.nota.create({
            data: {
                avaliacao_id,
                disciplina_id,
                aluno_id,
                nota_obtida: parseFloat(nota_obtida)
            }
        });

        return res.status(201).json(nota);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao atribuir nota", error: error.message });
    }
}

export const editNota = async (req: Request, res: Response) => {
    const { notaId } = req.params;
    const { nota_obtida } = req.body;

    if (!validate(notaId) || nota_obtida === undefined) {
        return res.status(400).json({ message: "Dados inválidos para editar nota" });
    }

    if (isNaN(parseFloat(nota_obtida))) {
        return res.status(400).json({ message: "Nota obtida inválida, coloque um número" });
    }

    try {
        const updatedNota = await prisma.nota.update({
            where: { id: notaId },
            data: {
                nota_obtida: parseFloat(nota_obtida),
                data_update: new Date()
            }
        });

        return res.status(200).json(updatedNota);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao editar nota", error: error.message });
    }
}

export const deleteNota = async (req: Request, res: Response) => {
    const { notaId } = req.params;

    if (!validate(notaId)) {
        return res.status(400).json({ message: "ID de nota inválido" });
    }

    try {
        await prisma.nota.delete({
            where: { id: notaId },
        });

        return res.status(200).json({ message: "Nota deletada com sucesso" });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao deletar nota", error: error.message });
    }
}

export const PegarNotaDeUmaAvaliacao = async (req: Request, res: Response) => {
    const { avaliacaoId } = req.params;

    if (!validate(avaliacaoId)) {
        return res.status(400).json({ message: "ID de avaliação inválido" });
    }

    try {
        const notas = await prisma.nota.findMany({
            where: { avaliacao_id: avaliacaoId },
        });

        const notasComDetalhes = await Promise.all(notas.map(async (nota) => {
            const aluno = await prisma.aluno.findUnique({
                where: { id: nota.aluno_id }
            });
            return {
                ...nota,
                aluno_nome: aluno?.usuario_id ? (await prisma.usuario.findUnique({ where: { id: aluno.usuario_id } }))?.nome_completo : null
            };
        }));

        return res.status(200).json(notasComDetalhes);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao pegar notas da avaliação", error: error.message });
    }
}

export const pegarTodasAvaliacoesDaTurma = async (req: Request, res: Response) => {
    const { turmaId } = req.params;

    if (!validate(turmaId)) {
        return res.status(400).json({ message: "ID de turma inválido" });
    }

    try {
        const avaliacoes = await prisma.avaliacao.findMany({
            where: { turma_id: turmaId },
        });

        return res.status(200).json(avaliacoes);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao pegar avaliações da turma", error: error.message });
    }
}