import {PrismaClient, tipo_usuario_enum} from "@prisma/client";
import * as dto from "./dto/funcionario";
import { hash_password } from "../../helper/encryption";
import { generateUsername } from "../../helper/username";
import { validate } from "uuid";

const prisma = new PrismaClient();

export const createFuncionarioService = async (data: dto.CreateFuncionarioDTO) : Promise<dto.ResponseFuncionarioDTO | dto.PropsResponseBad> => {
    const {
        nome_completo,
        bi,
        dt_nascimento,
        sexo,
        telefone,
        nacionalidade,
        morada,
        email,
        cargo,
        departamento,
        tipo_usuario,
        senha_hash,
        escola_id
    } = data;
    
    try {
        const hashedPassword = await hash_password(senha_hash); 
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
                tipo_usuario,
                pessoa_id: newPessoa.id,
                username: await generateUsername(nome_completo),
                senha_hash: hashedPassword
            }
        });
        
        const newFuncionario = await prisma.funcionario.create({
            data: {
                pessoa_id: newPessoa.id,
                cargo,
                departamento,
                escola_id
            }
        });
        
        return {
            id: newFuncionario.id,
            pessoa_id: newPessoa.id,
            nome_completo: newPessoa.nome_completo,
            bi: newPessoa.bi || "",
            dt_nascimento: newPessoa.dt_nascimento || undefined,
            sexo: newPessoa.sexo || "M",
            telefone: newPessoa.telefone || "",
            nacionalidade: newPessoa.nacionalidade || "",
            morada: newPessoa.morada || "",
            email: newPessoa.email || "",
            cargo: newFuncionario.cargo || "",
            departamento: newFuncionario.departamento || "",
            tipo_usuario: newUsuario?.tipo_usuario || "",
            escola_id: newFuncionario.escola_id || "",
            data_criacao: newFuncionario.data_criacao,
            data_atualizacao: newFuncionario.data_atualizacao,
            username: newUsuario.username ,
            estado: "ATIVO",
        };
    } catch (error) {
        console.error("Erro ao criar funcionário:", error);
        return {
            status: 500,
            message: "Erro ao criar funcionário"
        };
    }
};

export const pegarFuncionariosDeUmaEscola = async (escola_id: string) => {
    try {
        const funcionarios = await prisma.funcionario.findMany({
            where: { escola_id },
            include: {
                pessoa: true,
            }
        });

        const response = await Promise.all(funcionarios.map(async (funcionario) => {
            const usuario = await prisma.usuario.findFirst({
                where: { pessoa_id: funcionario.pessoa_id }
            });

            return {
                id: funcionario.id,
                pessoa_id: funcionario.pessoa_id,
                nome_completo: funcionario.pessoa.nome_completo,
                bi: funcionario.pessoa.bi || "",
                dt_nascimento: funcionario.pessoa.dt_nascimento || "",
                sexo: funcionario.pessoa.sexo || "",
                telefone: funcionario.pessoa.telefone || "",
                nacionalidade: funcionario.pessoa.nacionalidade || "",
                morada: funcionario.pessoa.morada || "",
                email: funcionario.pessoa.email || "",
                cargo: funcionario.cargo || "",
                departamento: funcionario.departamento || "",
                tipo_usuario: usuario?.tipo_usuario || "",
                escola_id: funcionario.escola_id || "",
                data_criacao: funcionario.data_criacao,
                data_atualizacao: funcionario.data_atualizacao,
                username: usuario?.username || "",
                estado: usuario?.estado || "INATIVO"
            };
        }));
        return response;
    } catch (error) {
        console.error("Erro ao pegar funcionários:", error);
        return {
            status: 500,
            message: "Erro ao pegar funcionários"
        };
    }
};

export const getFuncionarioByIdService = async (funcionario_id: string) => {
    try {
        const funcionario = await prisma.funcionario.findUnique({
            where: { id: funcionario_id },
            include: {
                pessoa: true,
            }
        });

        if (!funcionario) {
            return { status: 404, message: "Funcionário não encontrado" };
        }

        const usuario = await prisma.usuario.findFirst({
            where: { pessoa_id: funcionario.pessoa_id }
        });

        return {
            id: funcionario.id,
            pessoa_id: funcionario.pessoa_id,
            nome_completo: funcionario.pessoa.nome_completo,
            bi: funcionario.pessoa.bi || "",
            dt_nascimento: funcionario.pessoa.dt_nascimento || "",
            sexo: funcionario.pessoa.sexo || "",
            telefone: funcionario.pessoa.telefone || "",
            nacionalidade: funcionario.pessoa.nacionalidade || "",
            morada: funcionario.pessoa.morada || "",
            email: funcionario.pessoa.email || "",
            cargo: funcionario.cargo || "",
            departamento: funcionario.departamento || "",
            tipo_usuario: usuario?.tipo_usuario || "",
            escola_id: funcionario.escola_id || "",
            data_criacao: funcionario.data_criacao,
            data_atualizacao: funcionario.data_atualizacao,
            username: usuario?.username || "",
            estado: usuario?.estado || "INATIVO"
        };
    } catch (error) {
        console.error("Erro ao pegar funcionário por ID:", error);
        return { status: 500, message: "Erro ao pegar funcionário por ID" };
    }
};

export const updateFuncionarioService = async (
    funcionario_id: string,
    data: Partial<dto.CreateFuncionarioDTO>
): Promise<dto.ResponseFuncionarioDTO | dto.PropsResponseBad> => {

    if (!validate(funcionario_id)) {
        return { status: 400, message: "ID inválido" };
    }

    try {
        const funcionario = await prisma.funcionario.findFirst({
            where: { id: funcionario_id }
        });

        if (!funcionario) {
            return { status: 404, message: "Funcionário não encontrado" };
        }

        const userAssossiated = await prisma.usuario.findFirst({
            where: { pessoa_id: funcionario.pessoa_id }
        });

        const updatedFuncionario = await prisma.funcionario.update({
            where: { id: funcionario_id },
            data: {
                cargo: data.cargo || funcionario.cargo,
                departamento: data.departamento || funcionario.departamento,
                escola_id: data.escola_id || funcionario.escola_id
            }
        });

        const pessoa = await prisma.pessoa.findFirst({
            where: { id: funcionario.pessoa_id }
        });

        const updatedPessoa = await prisma.pessoa.update({
            where: { id: funcionario.pessoa_id },
            data: {
                nome_completo: data.nome_completo || pessoa?.nome_completo,
                bi: data.bi || pessoa?.bi,
                dt_nascimento: data.dt_nascimento ? new Date(data.dt_nascimento) : pessoa?.dt_nascimento,
                sexo: data.sexo || pessoa?.sexo,
                telefone: data.telefone || pessoa?.telefone,
                nacionalidade: data.nacionalidade || pessoa?.nacionalidade,
                morada: data.morada || pessoa?.morada,
                email: data.email || pessoa?.email
            }
        });

        const user = await prisma.usuario.findFirst({
            where: { pessoa_id: funcionario.pessoa_id }
        });

        return {
            id: updatedFuncionario.id,
            pessoa_id: updatedFuncionario.pessoa_id,
            nome_completo: updatedPessoa.nome_completo,
            bi: updatedPessoa.bi || "",
            dt_nascimento: updatedPessoa.dt_nascimento || undefined,
            sexo: updatedPessoa.sexo || undefined,
            telefone: updatedPessoa.telefone || undefined,
            nacionalidade: updatedPessoa.nacionalidade || undefined,
            morada: updatedPessoa.morada || undefined,
            email: updatedPessoa.email || undefined,
            cargo: updatedFuncionario.cargo || "",
            departamento: updatedFuncionario.departamento || "",
            tipo_usuario: user?.tipo_usuario || "",
            escola_id: updatedFuncionario.escola_id || "",
            data_criacao: updatedFuncionario.data_criacao,
            data_atualizacao: updatedFuncionario.data_atualizacao,
            username: user?.username || "",
            estado: user?.estado || ""
        } as dto.ResponseFuncionarioDTO;

    } catch (error: any) {
        console.error("Erro ao atualizar funcionário:", error);
        return { status: 500, message: `Erro ao atualizar funcionário: ${error.message}` };
    }
};