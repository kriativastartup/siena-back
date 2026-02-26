import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkSchoolPermission = async (userId: string, escola_id: string) => {
    const usuario = await prisma.usuario.findFirst({
        where: {
            id: userId,
        }
    });

    if (!usuario) {
        return false; // Usuário não encontrado, sem permissão
    }

    const funcionario = await prisma.funcionario.findFirst({
        where: {
            pessoa_id: usuario.pessoa_id,
            escola_id: escola_id
        }
    });
    const aluno = await prisma.aluno.findFirst({
        where: {
            pessoa_id: usuario.pessoa_id,
            escola_id: escola_id
        }
    });

    const professor = await prisma.professor.findFirst({
        where: {
            pessoa_id: usuario.pessoa_id,
            escola_id: escola_id
        }
    });

    const encarregado = await prisma.encarregado.findFirst({
        where: {
            pessoa_id: usuario.pessoa_id,
            escola_id: escola_id
        }
    });

    if (!funcionario && !aluno && !professor && !encarregado && usuario.tipo_usuario !== "SUPER_ADMIN") {
        return false; // O usuário não tem nenhum papel na escola, sem permissão
    }
    return true; // O usuário tem permissão para acessar a escola
}
