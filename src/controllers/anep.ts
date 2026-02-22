import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
dotenv.config();

const prisma = new PrismaClient();

const SUPER_USER = process.env.USER_EMAIL;
const SUPER_PASSWORD = process.env.USER_PASSWORD;

export const create_super_user = async () => {
    if (!SUPER_USER || !SUPER_PASSWORD) {
        return;
    }
    const existingAnepPessoa = await prisma.pessoa.findFirst({
        where: { email: SUPER_USER },
    });

    if (existingAnepPessoa) {
        return;
    }
    const hashedPassword = await bcrypt.hash(SUPER_PASSWORD, 10);

    const createdPessoa = await prisma.pessoa.create({
        data: {
            nome_completo: process.env.SUPER_FULL_NAME || "Admin Principal",
            email: SUPER_USER,
        },
    });

    await prisma.usuario.create({
        data: {
            pessoa_id: createdPessoa.id,
            username: "admin",
            senha_hash: hashedPassword,
            tipo_usuario: "SUPER_ADMIN",
        },
    });
    console.log("Super user created successfully.");
}