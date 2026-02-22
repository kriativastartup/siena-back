import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const generateRandomNumber = (length: number): string => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min + "";
}

const jaExisteUsername = async (username: string): Promise<boolean> => {
    const usuario = await prisma.usuario.findFirst({ where: { username } });
    return !!usuario;
}

export const generateUsername = async (nome_completo: string): Promise<string> => {
    if (!nome_completo || nome_completo.trim().length === 0) {
       return generateRandomNumber(8);
    }
   const firstName = nome_completo.split(" ")[0].toLowerCase();
   let lastName = nome_completo.split(" ").slice(-1)[0].toLowerCase();
    lastName = lastName ? lastName : generateRandomNumber(4);
   let username = `${firstName}${lastName}`;
   let suffix = 0;

   while (await jaExisteUsername(username)) {
       suffix++;
       username = `${firstName[0]}${lastName}${suffix ? suffix : ""}`;
   }
   return username;
}