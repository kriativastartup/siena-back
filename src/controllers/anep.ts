import dotenv from "dotenv";
import { PrismaClient } from "../generated/prisma/client";
dotenv.config();

const prisma = new PrismaClient();

const ANEP_USER = process.env.ANEP_USER;
const ANEP_PASSWORD = process.env.ANEP_PASSWORD;


export const create_anep_user = async () => {
    if (!ANEP_USER || !ANEP_PASSWORD) {
        return;
    }
    const existingAnepUser = await prisma.usuario.findFirst({
        where: { email: ANEP_USER },
    });

    if (existingAnepUser) {
        return;
    }

    await prisma.usuario.create({
        data: {
            nome_completo: "ANEP",
            email: ANEP_USER,
            senha_hash: ANEP_PASSWORD,
            tipo_usuario: "SUPER_ADMIN",
        },
    });

    console.log("ANEP user created successfully.");
}