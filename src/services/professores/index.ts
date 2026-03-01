import { PrismaClient } from "@prisma/client";
import * as ProfessorDTO from "./dto/professor.dto";
import { hash_password } from "../../helper/encryption";
import { generateUsername } from "../../helper/username";
import { validate } from "uuid";
import { generateRandomPassword } from "../../helper/password_random";
import { sendEmail } from "../mail.service";
import { emailRandomPassTemplate } from "../../template/email_random_pass";

const prisma = new PrismaClient();

export const createProfessorService = async (
    data: ProfessorDTO.CreateProfessorDTO
): Promise<ProfessorDTO.ResponseProfessorDTO | ProfessorDTO.PropsResponseBad> => {

    const {
        nome_completo,
        bi,
        dt_nascimento,
        sexo,
        telefone,
        nacionalidade,
        morada,
        email,
        especialidade,
        categoria,
        habilitacoes,
        carga_horaria_sem,
        escola_id
    } = data;

    try {

        const existEscola = await prisma.escola.findFirst({
            where: { id: escola_id }
        });

        if (!existEscola) {
            return { status: 404, message: "Escola não encontrada" };
        }

        const randomPassword = generateRandomPassword(8);
        try {
            await sendEmail(
                email,
                `Bem-vindo à escola ${existEscola.nome}, Prof ${nome_completo}!`,
                emailRandomPassTemplate(email, randomPassword)
            )
        } catch (error) {
            return {
                status: 400,
                message: `Erro ao enviar email, verifique o email e tente novamente`
            };
        }
        const hashedPassword = await hash_password(randomPassword);

        const newPessoa = await prisma.pessoa.create({
            data: {
                nome_completo,
                bi,
                dt_nascimento: new Date(dt_nascimento),
                sexo,
                telefone,
                nacionalidade,
                morada,
                email
            }
        });

        const newUsuario = await prisma.usuario.create({
            data: {
                tipo_usuario: "PROFESSOR",
                pessoa_id: newPessoa.id,
                username: `${await generateUsername(nome_completo)}`,
                senha_hash: hashedPassword
            }
        });

        const newProfessor = await prisma.professor.create({
            data: {
                pessoa_id: newPessoa.id,
                especialidade,
                categoria,
                habilitacoes,
                carga_horaria_sem,
                escola_id
            }
        });

        const disciplinaProfessores = await prisma.disciplina_professor.findMany({
            where: { professor_id: newProfessor.id }
        });
        const disciplinas = await Promise.all(disciplinaProfessores.map(async (dp) => {
            const disciplina = await prisma.disciplina.findFirst({
                where: { id: dp.disciplina_id }
            });
            return {
                disciplina_id: dp.disciplina_id,
                professor_id: newProfessor.id,
                escola_id: existEscola.id,
                nome_disciplina: disciplina?.nome || "",
                data_criacao: new Date(dp.data_criacao),
                data_atualizacao: new Date(dp.data_atualizacao)
            };
        }));

        return {
            id: newProfessor.id,
            pessoa_id: newPessoa.id,
            nome_completo: newPessoa.nome_completo,
            bi: newPessoa.bi || "",
            dt_nascimento: newPessoa.dt_nascimento || undefined,
            sexo: newPessoa.sexo || undefined,
            telefone: newPessoa.telefone || "",
            nacionalidade: newPessoa.nacionalidade || "",
            morada: newPessoa.morada || "",
            email: newPessoa.email || "",
            especialidade: newProfessor.especialidade || "",
            categoria: newProfessor.categoria || "",
            habilitacoes: newProfessor.habilitacoes || "",
            carga_horaria_sem: newProfessor.carga_horaria_sem || undefined,
            escola_id: newProfessor.escola_id || undefined,
            data_criacao: newProfessor.data_criacao,
            username: newUsuario.username,
            tipo_usuario: "PROFESSOR",
            estado: newUsuario.estado,
            disciplinas: disciplinas
        };

    } catch (error: any) {
        return { status: 500, message: `Erro ao criar professor: ${error.message}` };
    }
};

export const getAllProfessoresByEscolaService = async (
    escola_id: string,
    limit: number,
    offset: number,
    search?: string
): Promise<ProfessorDTO.ResponseProfessorDTO[] | ProfessorDTO.PropsResponseBad> => {
    if (!validate(escola_id)) {
        return { status: 400, message: "ID de escola inválido" };
    }

    try {
        const exiteEscola = await prisma.escola.findFirst({
            where: { id: escola_id }
        });

        if (!exiteEscola) {
            return { status: 404, message: "Escola não encontrada" };
        }

        const where: any = { escola_id };

        if (search) {
            where.nome_completo = { contains: search, mode: "insensitive" };
        }

        const professoresPessoa = await prisma.professor.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: { data_criacao: "desc" },
            include: {
                pessoa: true
            }
        });

        const professores = await Promise.all(professoresPessoa.map(async (professor) => {
            const user = await prisma.usuario.findFirst({
                where: { pessoa_id: professor.pessoa_id }
            });

            return {
                ...professor,
                usuario: user || undefined
            };
        }));

        const dp = await prisma.disciplina_professor.findMany({
            where: {
                professor_id: {
                    in: professores.map(p => p.id)
                }
            }
        });

        async function isDisciplinaProfessor(prof_id: string) {
            const disciplinas = await Promise.all(dp.map(async (item) => {
                const disciplina = await prisma.disciplina.findFirst({
                    where: { id: item.disciplina_id }
                });
                const prof = await prisma.professor.findFirst({
                    where: { id: item.professor_id }
                });

                return {
                    disciplina_id: item.disciplina_id,
                    professor_id: item.professor_id,
                    escola_id: prof?.escola_id || "",
                    nome_disciplina: disciplina?.nome || "",
                    data_criacao: new Date(item.data_criacao),
                    data_atualizacao: new Date(item.data_atualizacao)
                };
            }));
            return disciplinas.filter(d => d.professor_id === prof_id);
        }

        const response = professores.map(async professor => ({
            id: professor.id,
            pessoa_id: professor.pessoa_id,
            nome_completo: professor.pessoa.nome_completo || "",
            bi: professor.pessoa.bi || "",
            dt_nascimento: professor.pessoa.dt_nascimento || undefined,
            sexo: professor.pessoa.sexo || undefined,
            telefone: professor.pessoa.telefone || "",
            nacionalidade: professor.pessoa.nacionalidade || "",
            morada: professor.pessoa.morada || "",
            email: professor.pessoa.email || "",
            especialidade: professor.especialidade || "",
            categoria: professor.categoria || "",
            habilitacoes: professor.habilitacoes || "",
            carga_horaria_sem: professor.carga_horaria_sem || undefined,
            escola_id: professor.escola_id || undefined,
            data_criacao: professor.data_criacao,
            username: professor.usuario?.username || "",
            tipo_usuario: professor.usuario?.tipo_usuario || "",
            estado: professor.usuario?.estado || "",
            disciplinas: await isDisciplinaProfessor(professor.id) // Você pode adicionar a lógica para buscar as disciplinas associadas a cada professor aqui, se necessário
        }));
        return Promise.all(response);
    } catch (error: any) {
        return { status: 500, message: `Erro ao buscar professores: ${error.message}` };
    }
};

export const getProfessorByIdService = async (
    professor_id: string
): Promise<ProfessorDTO.ResponseProfessorDTO | ProfessorDTO.PropsResponseBad> => {

    if (!validate(professor_id)) {
        return { status: 400, message: "ID inválido" };
    }

    try {
        const professor = await prisma.professor.findFirst({
            where: { id: professor_id }
        });

        if (!professor) {
            return { status: 404, message: "Professor não encontrado" };
        }

        const pessoa = await prisma.pessoa.findFirst({
            where: { id: professor.pessoa_id }
        });

        const user = await prisma.usuario.findFirst({
            where: { pessoa_id: professor.pessoa_id }
        });

        const disciplinaProfessores = await prisma.disciplina_professor.findMany({
            where: { professor_id }
        });

        const disciplinas = await Promise.all(disciplinaProfessores.map(async (dp) => {
            const disciplina = await prisma.disciplina.findFirst({
                where: { id: dp.disciplina_id }
            });
            return {
                disciplina_id: dp.disciplina_id,
                professor_id,
                escola_id: professor.escola_id || "",
                nome_disciplina: disciplina?.nome || "",
                data_criacao: new Date(dp.data_criacao),
                data_atualizacao: new Date(dp.data_atualizacao)
            };
        }));

        return {
            id: professor.id,
            pessoa_id: professor.pessoa_id,
            nome_completo: pessoa?.nome_completo || "",
            bi: pessoa?.bi || "",
            dt_nascimento: pessoa?.dt_nascimento || undefined,
            sexo: pessoa?.sexo || undefined,
            telefone: pessoa?.telefone || "",
            nacionalidade: pessoa?.nacionalidade || "",
            morada: pessoa?.morada || "",
            email: pessoa?.email || "",
            especialidade: professor.especialidade || "",
            categoria: professor.categoria || "",
            habilitacoes: professor.habilitacoes || "",
            carga_horaria_sem: professor.carga_horaria_sem || undefined,
            escola_id: professor.escola_id || undefined,
            data_criacao: professor.data_criacao,
            username: user?.username || "",
            tipo_usuario: user?.tipo_usuario || "",
            estado: user?.estado || "",
            disciplinas
        };

    } catch (error: any) {
        return { status: 500, message: `Erro ao buscar professor: ${error.message}` };
    }
};

export const updateProfessorService = async (
    professor_id: string,
    data: Partial<ProfessorDTO.CreateProfessorDTO>
): Promise<ProfessorDTO.ResponseProfessorDTO | ProfessorDTO.PropsResponseBad> => {

    if (!validate(professor_id)) {
        return { status: 400, message: "ID inválido" };
    }

    try {
        const professor = await prisma.professor.findFirst({
            where: { id: professor_id }
        });

        if (!professor) {
            return { status: 404, message: "Professor não encontrado" };
        }

        const pessoa = await prisma.pessoa.findFirst({
            where: { id: professor.pessoa_id }
        });

        const updatedPessoa = await prisma.pessoa.update({
            where: { id: professor.pessoa_id },
            data: {
                nome_completo: data.nome_completo || pessoa?.nome_completo,
                bi: data.bi || pessoa?.bi,
                dt_nascimento: data.dt_nascimento
                    ? new Date(data.dt_nascimento)
                    : pessoa?.dt_nascimento,
                sexo: data.sexo || pessoa?.sexo,
                telefone: data.telefone || pessoa?.telefone,
                nacionalidade: data.nacionalidade || pessoa?.nacionalidade,
                morada: data.morada || pessoa?.morada,
                email: data.email || pessoa?.email
            }
        });

        const updatedProfessor = await prisma.professor.update({
            where: { id: professor_id },
            data: {
                especialidade: data.especialidade || professor.especialidade,
                categoria: data.categoria || professor.categoria,
                habilitacoes: data.habilitacoes || professor.habilitacoes,
                carga_horaria_sem: data.carga_horaria_sem || professor.carga_horaria_sem,
                escola_id: data.escola_id || professor.escola_id
            }
        });

        const user = await prisma.usuario.findFirst({
            where: { pessoa_id: professor.pessoa_id }
        });
        const disciplina_professor = await prisma.disciplina_professor.findMany({
            where: { professor_id }
        });

        const disciplinas = await Promise.all(disciplina_professor.map(async (dp) => {
            const disciplina = await prisma.disciplina.findFirst({
                where: { id: dp.disciplina_id }
            });
            return {
                disciplina_id: dp.disciplina_id,
                professor_id,
                escola_id: updatedProfessor.escola_id || "",
                nome_disciplina: disciplina?.nome || "",
                data_criacao: new Date(dp.data_criacao),
                data_atualizacao: new Date(dp.data_atualizacao)
            };
        }));

        return {
            ...updatedProfessor,
            ...updatedPessoa,
            username: user?.username || "",
            tipo_usuario: user?.tipo_usuario || "",
            estado: user?.estado || "",
            disciplinas
        } as ProfessorDTO.ResponseProfessorDTO;

    } catch (error: any) {
        return { status: 500, message: `Erro ao atualizar professor: ${error.message}` };
    }
};

export const addDisciplinaToProfessorService = async (
    data: ProfessorDTO.CreateDisciplinaProfessorDTO
) => {
    const { disciplina_id, professor_id, escola_id } = data;

    const existProfessor = await prisma.professor.findFirst({
        where: { id: professor_id }
    });

    if (!existProfessor) {
        return { status: 404, message: "Professor não encontrado" };
    }

    const existDisciplina = await prisma.disciplina.findFirst({
        where: { id: disciplina_id }
    });

    if (!existDisciplina) {
        return { status: 404, message: "Disciplina não encontrada" };
    }

    const existEscola = await prisma.escola.findFirst({
        where: { id: escola_id }
    });

    if (!existEscola) {
        return { status: 404, message: "Escola não encontrada" };
    }

    if (existDisciplina.escola_id !== existProfessor.escola_id || existDisciplina.escola_id !== escola_id || existProfessor.escola_id !== escola_id) {
        return { status: 400, message: "Professor, disciplina e escola devem estar associados à mesma escola" };
    }

    const existingRelation = await prisma.disciplina_professor.findFirst({
        where: {
            disciplina_id,
            professor_id,
            escola_id
        }
    });

    if (existingRelation) {
        return { status: 400, message: "Este Professor já está associado a esta disciplina e escola" };
    }

    const add = await prisma.disciplina_professor.create({
        data: {
            disciplina_id,
            professor_id,
            escola_id
        }
    });
    return {
        status: 200,
        message: "Disciplina associada ao professor com sucesso",
    };
}

export const removeDisciplinaFromProfessorService = async (
    data: ProfessorDTO.CreateDisciplinaProfessorDTO
) => {
    const { disciplina_id, professor_id, escola_id } = data;

    const existRelation = await prisma.disciplina_professor.findFirst({
        where: {
            disciplina_id,
            professor_id,
            escola_id
        }
    });

    if (!existRelation) {
        return { status: 404, message: "Associação entre professor, disciplina e escola não encontrada" };
    }

    await prisma.disciplina_professor.delete({
        where: { id: existRelation.id }
    });

    return {
        status: 200,
        message: "Disciplina desassociada do professor com sucesso",
    };
}

//{{PADDING}}

export const createAvaluation = async (data: ProfessorDTO.CreateAvaluationDTO) => {
    const { disciplina_id, turma_id,  tipo_avaliacao, trimestre, descricao} = data;

    const existTurma = await prisma.turma.findFirst({
        where: { id: turma_id }
    });

    if (!existTurma) {
        return { status: 404, message: "Turma não encontrada" };
    }

    const existDisciplina = await prisma.disciplina.findFirst({
        where: { id: disciplina_id }
    });

    if (!existDisciplina) {
        return { status: 404, message: "Disciplina não encontrada" };
    }

    const create = await prisma.avaliacao.create({
        data: {
            disciplina_id,
            turma_id,
            tipo_avaliacao,
            trimestre: Number(trimestre),
            data_avaliacao: new Date(data.data_avaliacao),
            descricao
        }
    });
    return create;
}

export const getAvaliacoes = async (disciplina_id?: string, professor_id?: string, estado?: string) => {
    const where: any = {};

    if (disciplina_id) {
        where.disciplina_id = disciplina_id;
    }

    if (professor_id) {
        const dp = await prisma.disciplina_professor.findMany({
            where: { professor_id }
        });
        const disciplinaIds = dp.map(d => d.disciplina_id);
        where.disciplina_id = { in: disciplinaIds };
    }

    if (estado) {
        where.estado = estado;
    }

    const avaliacoes = await prisma.avaliacao.findMany({
        where,
        orderBy: { data_avaliacao: "desc" }
    });

    return avaliacoes;
};

export const getAvaliacaoById = async (avaliacao_id: string) => {
    const avaliacao = await prisma.avaliacao.findFirst({
        where: { id: avaliacao_id }
    });

    if (!avaliacao) {
        return { status: 404, message: "Avaliação não encontrada" };
    }

    return avaliacao;
};


export const setNotaAvaluation = async (data: ProfessorDTO.CreateNotaDTO) => {
    const { aluno_id, avaliacao_id, nota_obtida, disciplina_id } = data;

    const existAluno = await prisma.aluno.findFirst({
        where: { id: aluno_id }
    });

    if (!existAluno) {
        return { status: 404, message: "Aluno não encontrado" };
    }

    const existAvaliacao = await prisma.avaliacao.findFirst({
        where: { id: avaliacao_id }
    });

    if (!existAvaliacao) {
        return { status: 404, message: "Avaliação não encontrada" };
    }

    const existDisciplina = await prisma.disciplina.findFirst({
        where: { id: disciplina_id }
    });

    if (!existDisciplina) {
        return { status: 404, message: "Disciplina não encontrada" };
    }


    if (existAvaliacao.disciplina_id !== disciplina_id) {
        return { status: 400, message: "Aluno, avaliação e disciplina devem estar associados à mesma escola" };
    }

    const existingNota = await prisma.nota.findFirst({
        where: {
            aluno_id,
            avaliacao_id
        }
    });

    if (existingNota) {
        return { status: 400, message: "Este aluno já tem uma nota para esta avaliação" };
    }

    const create = await prisma.nota.create({
        data: {
            aluno_id,
            avaliacao_id,
            nota_obtida,
            disciplina_id
        }
    });
    
    return create;
}