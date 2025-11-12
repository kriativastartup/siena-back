import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { hash_password } from "../helper/encryption";
import { validate } from "uuid";

const prisma = new PrismaClient();

export const getEncarregados = async (req: Request, res: Response) => {
    try {
        const escola_id = req.params.escola_id as string;
        if (!escola_id || !validate(escola_id)) {
            return res.status(400).json({
                message: "O ID da escola é inválido"
            });
        }

        const existEscola = await prisma.escola.findFirst({
            where: {
                id: escola_id
            }
        });

        if (!existEscola) {
            return res.status(404).json({
                message: "Escola não encontrada"
            });
        }

        const encarregados = await prisma.encarregado.findMany({
            where: {
                escola_id: escola_id
            }
        });
        return res.status(200).json(encarregados);
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar encarregados", error: error.message });
    }
}

export const createEncarregado = async (req: Request | any, res: Response) => {
    const { nome_completo, email, senha, telefone, profissao, escola_id } = req.body;
    try {
        if (!nome_completo || !email || !senha) {
            return res.status(400).json({ message: "Nome completo, email e senha são obrigatórios" });
        }

        if (!escola_id || !validate(escola_id)) {
            return res.status(400).json({
                message: "O ID da escola é inválido"
            });
        }

        const usuarioExistente = await prisma.usuario.findFirst({
            where: { email }
        });

        if (usuarioExistente) {
            return res.status(409).json({ message: "Usuário com este email já existe" });
        }

        const escolaExistente = await prisma.escola.findUnique({
            where: { id: escola_id }
        });

        if (!escolaExistente) {
            return res.status(404).json({ message: "Escola não encontrada" });
        }

        const hashedPassword = await hash_password(senha);

        const newUsuario = await prisma.usuario.create({
            data: {
                nome_completo,
                email,
                senha_hash: hashedPassword,
                tipo_usuario: "ENCARREGADO",
            },
        });

        const newEncarregado = await prisma.encarregado.create({
            data: {
                usuario_id: newUsuario.id,
                telefone,
                profissao,
                escola_id
            },
        });
        
        return res.status(201).json({
            ...newEncarregado,
            nome_completo: newUsuario.nome_completo,
            email: newUsuario.email,
            tipo_usuario: newUsuario.tipo_usuario
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao criar encarregado", error: error.message });
    }
};

export const getEncarregadoById = async (req : Request | any, res : Response) => {
    const encarregado_id = req.params.encarregadoId as string;
    try {
        if (!encarregado_id || validate(encarregado_id)) {
            return res.status(400).json({
                message: "O ID do encarregado é inválido"
            });
        }

        const encarregado = await prisma.encarregado.findUnique({
            where: {
                id: encarregado_id
            }
        });

        if (!encarregado) {
            return res.status(404).json({
                message: "Encarregado não encontrado"
            });
        }
        const MeusAluno = await prisma.aluno_encarregado.findMany({
            where: {
                encarregado_id: encarregado.id
            }
        });

        const alunos = await Promise.all(MeusAluno.map(async (aluno_encarregado) => {
            const aluno = await prisma.aluno.findUnique({
                where: {
                    id: aluno_encarregado.aluno_id
                }
            });
            return aluno;
        }));

        return res.status(200).json({
            ...encarregado,
            alunos
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao buscar encarregado", error: error.message });
    }
}

export const updateEncarregadoById = async (req : Request | any, res : Response) => {
    const encarregado_id = req.params.encarregadoId as string;
    const { nome_completo, email, telefone, grau_parentesco, profissao } = req.body;
    try {
        if (!encarregado_id || validate(encarregado_id)) {
            return res.status(400).json({
                message: "O ID do encarregado é inválido"
            });
        }

        const encarregado = await prisma.encarregado.findUnique({
            where: {
                id: encarregado_id
            }
        });

        if (!encarregado) {
            return res.status(404).json({
                message: "Encarregado não encontrado"
            });
        }

        const usuario = await prisma.usuario.update({
            where: {
                id: encarregado.usuario_id
            },
            data: {
                nome_completo: nome_completo || undefined,
                email: email || undefined
            }
        });

        const updatedEncarregado = await prisma.encarregado.update({
            where: {
                id: encarregado_id
            },
            data: {
                telefone: telefone || encarregado.telefone || undefined,
                profissao: profissao || encarregado.profissao || undefined
            }
        });

        return res.status(200).json({
            ...updatedEncarregado,
            nome_completo: usuario.nome_completo,
            email: usuario.email
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao atualizar encarregado", error: error.message });
    }

}

export const deleteEncarregadoById = async (req : Request | any, res : Response) => {
    const encarregado_id = req.params.encarregadoId as string;
    try {
        if (!encarregado_id || validate(encarregado_id)) {
            return res.status(400).json({
                message: "O ID do encarregado é inválido"
            });
        }

        const encarregado = await prisma.encarregado.findUnique({
            where: {
                id: encarregado_id
            }
        });

        if (!encarregado) {
            return res.status(404).json({
                message: "Encarregado não encontrado"
            });
        }

        const encarregadoAlunos = await prisma.aluno_encarregado.findMany({
            where: {
                encarregado_id: encarregado.id
            }
        });

        await Promise.all(encarregadoAlunos.map(async (aluno_encarregado) => {
            await prisma.aluno_encarregado.delete({
                where: {
                    id: aluno_encarregado.id
                }
            });
        }));

        await prisma.usuario.delete({
            where: {
                id: encarregado.usuario_id
            }
        });

        return res.status(200).json({ message: "Encarregado deletado com sucesso" });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao deletar encarregado", error: error.message });
    }
}

export const addAlunoToEncarregado = async (req : Request | any, res : Response) => {
    const encarregado_id = req.body.encarregadoId as string;
    const aluno_id = req.body.alunoId as string;
    try {
        if (!encarregado_id || validate(encarregado_id)) {
            return res.status(400).json({
                message: "O ID do encarregado é inválido"
            });
        }
        if (!aluno_id || validate(aluno_id)) {
            return res.status(400).json({
                message: "O ID do aluno é inválido"
            });
        }
        const relacionamentoExistente = await prisma.aluno_encarregado.findFirst({
            where: {
                encarregado_id: encarregado_id,
                aluno_id: aluno_id
            }
        });
        if (relacionamentoExistente) {
            return res.status(409).json({
                message: "O aluno já está associado a este encarregado"
            });
        }
        await prisma.aluno_encarregado.create({
            data: {
                encarregado_id: encarregado_id,
                aluno_id: aluno_id
            }
        });
        return res.status(201).json({ message: "Aluno adicionado ao encarregado com sucesso" });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao adicionar aluno ao encarregado", error: error.message });
    }
}

export const deleteOneAlunoFromEncarregado = async (req : Request | any, res : Response) => {
    const encarregado_id = req.body.encarregadoId as string;
    const aluno_id = req.body.alunoId as string;
    try {
        if (!encarregado_id || validate(encarregado_id)) {
            return res.status(400).json({
                message: "O ID do encarregado é inválido"
            });
        }

        if (!aluno_id || validate(aluno_id)) {
            return res.status(400).json({
                message: "O ID do aluno é inválido"
            });
        }

        const relacionamento = await prisma.aluno_encarregado.findFirst({
            where: {
                encarregado_id: encarregado_id,
                aluno_id: aluno_id
            }
        });

        if (!relacionamento) {
            return res.status(404).json({
                message: "Relacionamento entre aluno e encarregado não encontrado"
            });
        }

        await prisma.aluno_encarregado.delete({
            where: {
                id: relacionamento.id
            }
        });

        return res.status(200).json({ message: "Aluno removido do encarregado com sucesso" });
    } catch (error: any) {
        return res.status(500).json({ message: "Erro ao remover aluno do encarregado", error: error.message });
    }
}
