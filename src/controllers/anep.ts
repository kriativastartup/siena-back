import dotenv from "dotenv";
import { PrismaClient } from "../generated/prisma/client";
import * as bcrypt from "bcrypt";
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
    const hashedPassword = await bcrypt.hash(ANEP_PASSWORD, 10);
    await prisma.usuario.create({
        data: {
            nome_completo: "ANEP",
            email: ANEP_USER,
            senha_hash: hashedPassword,
            tipo_usuario: "SUPER_ADMIN",
        },
    });

    console.log("ANEP user created successfully.");
}