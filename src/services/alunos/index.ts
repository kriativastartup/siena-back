
import { generateRandomNumber } from "../../helper/random"
import { hash_password } from "../../helper/encryption";
import { PrismaClient, sexo_enum, status_aluno } from "@prisma/client";
import * as AlunoDTO from "./dto/alunos.dto";
import { validate } from "uuid";
import { generateUsername } from "../../helper/username";
import { sendEmail } from "../mail.service";
import { emailRandomPassTemplate } from "../../template/email_random_pass";

const prisma = new PrismaClient();

export const createAlunoService = async (data: AlunoDTO.CreateAlunoDTO) => {
    const {
        nome_completo,
        bi,
        dt_nascimento,
        sexo,
        telefone,
        nacionalidade,
        morada,
        email,
        escola_id,
        n_processo, necessidades_especiais: { descricao, tipo } = { descricao: "", tipo: "" }
        , foto } = data;
    try {
        const generateSenha = await hash_password(generateRandomNumber(8).toString());
        try {
            await sendEmail(
                email,
                "Bem-vindo ao Sistema de Gestão Escolar",
                emailRandomPassTemplate(email, generateSenha)
            );
        } catch (emailError: any) {
            return { status: 500, message: `Erro ao enviar email: ${emailError.message}` };
        }
        const hashedPassword = await hash_password(generateSenha);

        const newPessoa = await prisma.pessoa.create({
            data: {
                nome_completo,
                email,
                bi,
                dt_nascimento: new Date(dt_nascimento),
                sexo,
                telefone,
                nacionalidade,
                morada
            },
        });

        const newUsuario = await prisma.usuario.create({
            data: {
                tipo_usuario: "ALUNO",
                pessoa_id: newPessoa.id,
                username: `aluno${generateRandomNumber(4)}`,
                senha_hash: hashedPassword
            },
        });
        const newAluno = await prisma.aluno.create({
            data: {
                pessoa_id: newPessoa.id,
                escola_id,
                n_processo,
                necessidades_especiais: descricao && tipo ? {
                    create: {
                        descricao,
                        tipo
                    }
                } : undefined,
                foto,
            },
        });
        return {
            id: newAluno.id,
            pessoa_id: newAluno.pessoa_id,
            nome_completo: newPessoa.nome_completo,
            bi: newPessoa.bi,
            dt_nascimento: newPessoa.dt_nascimento,
            sexo: newPessoa.sexo,
            escola_id: newAluno.escola_id,
            telefone: newPessoa.telefone,
            nacionalidade: newPessoa.nacionalidade,
            morada: newPessoa.morada,
            email: newPessoa.email,
            n_processo: newAluno.n_processo,
            necessidades_especiais: descricao && tipo ? { descricao, tipo } : undefined,
            foto: newAluno.foto,
            status: newAluno.status,
            data_criacao: newAluno.data_criacao,
            data_atualizacao: newAluno.data_atualizacao,
            username: generateUsername(nome_completo),
            tipo_usuario: "ALUNO",
            estado: newUsuario.estado
        };
    } catch (error: any) {
        return { status: 500, message: `Erro ao criar aluno: ${error.message}` };
    }

};

export const getAlunosTurmaService = async (turma_id: string, limit?: number, offset?: number, search?: string): Promise<AlunoDTO.ResponseAlunoDTO[] | AlunoDTO.PropsResponseBad> => {
    try {
        const existTurma = await prisma.turma.findFirst({
            where: { id: turma_id },
        });

        if (!existTurma) {
            return { status: 404, message: "Turma não encontrada" };
        }
        const alunos = await prisma.aluno.findMany({
            where: {
                aluno_turma: {
                    some: {
                        turma_id
                    }
                }
            },
        });

        const alunosWithUserData = await Promise.all(alunos.map(async (aluno: any) => {
            const user = await prisma.usuario.findFirst({
                where: { pessoa_id: aluno.pessoa_id },
            });
            const pessoa = await prisma.pessoa.findFirst({
                where: { id: aluno.pessoa_id },
            });
            return {
                id: aluno.id,
                pessoa_id: aluno.pessoa_id,
                nome_completo: pessoa?.nome_completo || "",
                bi: pessoa?.bi || "",
                dt_nascimento: pessoa?.dt_nascimento || new Date(),
                sexo: pessoa?.sexo || "",
                escola_id: aluno.escola_id,
                telefone: pessoa?.telefone || "",
                nacionalidade: pessoa?.nacionalidade || "",
                morada: pessoa?.morada || "",
                email: pessoa?.email || "",
                n_processo: aluno.n_processo,
                necessidades_especiais: aluno.necessidades_especiais ? aluno.necessidades_especiais : undefined,
                foto: aluno.foto,
                status: aluno.status,
                data_criacao: aluno.data_criacao,
                data_atualizacao: aluno.data_atualizacao,
                username: user?.username || "",
                tipo_usuario: user?.tipo_usuario || "",
                estado: user?.estado || ""
            };
        }));

        return alunosWithUserData as AlunoDTO.ResponseAlunoDTO[];
    } catch (error: any) {
        return { status: 500, message: `Erro ao buscar alunos da turma: ${error.message}` };
    }
};

export const getAlunosEscolaService = async (escola_id: string, limit?: number, offset?: number, search?: string): Promise<AlunoDTO.ResponseAlunoDTO[] | AlunoDTO.PropsResponseBad> => {
    try {
        const existEscola = await prisma.escola.findFirst({
            where: { id: escola_id },
        });

        if (!existEscola) {
            return { status: 404, message: "Escola não encontrada" };
        }
        const alunos = await prisma.aluno.findMany({
            where: {
                escola_id
            },
        });

        const alunosWithUserData = await Promise.all(alunos.map(async (aluno) => {
            const user = await prisma.usuario.findFirst({
                where: { pessoa_id: aluno.pessoa_id },
            });
            const pessoa = await prisma.pessoa.findFirst({
                where: { id: aluno.pessoa_id },
            });
            return {
                id: aluno.id,
                pessoa_id: aluno.pessoa_id,
                nome_completo: pessoa?.nome_completo || "",
                bi: pessoa?.bi || "",
                dt_nascimento: pessoa?.dt_nascimento || new Date(),
                sexo: pessoa?.sexo || "",
                escola_id: aluno.escola_id,
                telefone: pessoa?.telefone || "",
                nacionalidade: pessoa?.nacionalidade || "",
                morada: pessoa?.morada || "",
                email: pessoa?.email || "",
                n_processo: aluno.n_processo,
                necessidades_especiais: aluno.necessidades_especiais ? aluno.necessidades_especiais : undefined,
                foto: aluno.foto,
                status: aluno.status,
                data_criacao: aluno.data_criacao,
                data_atualizacao: aluno.data_atualizacao,
                username: user?.username || "",
                tipo_usuario: user?.tipo_usuario || "",
                estado: user?.estado || ""
            };
        }));

        return alunosWithUserData as AlunoDTO.ResponseAlunoDTO[];

    } catch (error: any) {
        return { status: 500, message: `Erro ao buscar alunos da escola: ${error.message}` };
    }
};

export const getAlunoByIdService = async (aluno_id: string): Promise<AlunoDTO.ResponseAlunoDTO | AlunoDTO.PropsResponseBad> => {
    if (!validate(aluno_id)) {
        return { status: 400, message: "ID de aluno inválido" };
    }

    try {
        const aluno = await prisma.aluno.findFirst({
            where: { id: aluno_id },
        });

        if (!aluno) {
            return { status: 404, message: "Aluno não encontrado" };
        }

        const user = await prisma.usuario.findFirst({
            where: { pessoa_id: aluno.pessoa_id },
        });
        const pessoa = await prisma.pessoa.findFirst({
            where: { id: aluno.pessoa_id },
        });

        return {
            id: aluno.id,
            pessoa_id: aluno.pessoa_id,
            nome_completo: pessoa?.nome_completo || "",
            bi: pessoa?.bi || "",
            dt_nascimento: pessoa?.dt_nascimento || new Date(),
            sexo: pessoa?.sexo as sexo_enum || "",
            escola_id: aluno.escola_id,
            telefone: pessoa?.telefone || "",
            nacionalidade: pessoa?.nacionalidade || "",
            morada: pessoa?.morada || "",
            email: pessoa?.email || "",
            n_processo: aluno.n_processo,
            foto: aluno.foto || "",
            status: aluno.status as status_aluno || "",
            data_criacao: aluno.data_criacao,
            data_atualizacao: aluno.data_atualizacao,
            username: user?.username || "",
            tipo_usuario: user?.tipo_usuario || "",
            estado: user?.estado || ""
        };


    } catch (error: any) {
        return { status: 500, message: `Erro ao buscar aluno: ${error.message}` };
    }
};

export const updateAlunoService = async (aluno_id: string, data: Partial<AlunoDTO.CreateAlunoDTO>): Promise<AlunoDTO.ResponseAlunoDTO | AlunoDTO.PropsResponseBad> => {
    if (!validate(aluno_id)) {
        return { status: 400, message: "ID de aluno inválido" };
    }

    try {
        const aluno = await prisma.aluno.findFirst({
            where: { id: aluno_id },
        });

        if (!aluno) {
            return { status: 404, message: "Aluno não encontrado" };
        }

        const pessoa = await prisma.pessoa.findFirst({
            where: { id: aluno.pessoa_id },
        });

        const updatedPessoa = await prisma.pessoa.update({
            where: { id: aluno.pessoa_id },
            data: {
                nome_completo: data.nome_completo || pessoa?.nome_completo,
                email: data.email || pessoa?.email,
                bi: data.bi || pessoa?.bi,
                dt_nascimento: data.dt_nascimento ? new Date(data.dt_nascimento) : pessoa?.dt_nascimento,
                sexo: data.sexo || pessoa?.sexo,
                telefone: data.telefone || pessoa?.telefone,
                nacionalidade: data.nacionalidade || pessoa?.nacionalidade,
                morada: data.morada || pessoa?.morada
            },
        });

        const updatedAluno = await prisma.aluno.update({
            where: { id: aluno_id },
            data: {
                escola_id: data.escola_id || aluno.escola_id,
                n_processo: data.n_processo || aluno.n_processo,
                necessidades_especiais: data.necessidades_especiais,
                foto: data.foto || aluno.foto,
                status: data.status as status_aluno || aluno.status
            },
        });

        return {
            ...updatedAluno,
            ...updatedPessoa
        } as AlunoDTO.ResponseAlunoDTO;

    } catch (error: any) {
        return { status: 500, message: `Erro ao atualizar aluno: ${error.message}` };
    }
};