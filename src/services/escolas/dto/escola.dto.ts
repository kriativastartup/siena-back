import { z } from "zod";
import { natureza } from "@prisma/client";

export const CreateEscolaSchema = z.object({
    nome: z.string("O nome da escola é obrigatório").min(3, "O nome deve ter pelo menos 3 caracteres").max(100),
    natureza: z.enum(natureza, "A natureza da escola é obrigatória e deve ser um tipo válido"), // PUBLICA, PRIVADA, PUBLICA_PRIVADA
    codigo_mec: z.string("O código MEC é obrigatório").min(3, "O código MEC deve ter pelo menos 3 caracteres").max(20),
    nif: z.string("O NIF é obrigatório").min(9, "O NIF deve ter pelo menos 9 caracteres").max(20),
    localizacao: z.object({
        endereco: z.string("O endereço é obrigatório").min(5, "O endereço deve ter pelo menos 5 caracteres").max(200),
        cidade: z.string("A cidade é obrigatória").min(2, "A cidade deve ter pelo menos 2 caracteres").max(100).optional(),
        provincia: z.string("A província é obrigatória").min(2, "A província deve ter pelo menos 2 caracteres").max(100),
        pais: z.string("O país é obrigatório").min(2, "O país deve ter pelo menos 2 caracteres").max(100),
    }),
    contacto: z.object({
        telefone: z.string("O telefone é obrigatório").min(9, "O telefone deve ter pelo menos 9 caracteres").max(20),
        outro_telefone: z.string("O outro telefone é obrigatório").min(9, "O outro telefone deve ter pelo menos 9 caracteres").max(20).optional(),
        email: z.string("O email é obrigatório").email("Formato de email inválido"),
        outro_email: z.string("O outro email é obrigatório").email("Formato de email inválido").optional(),
    }),
    logo_url: z.string("A URL do logo é obrigatória").max(255).optional(),
});

export type CreateEscolaDTO = z.infer<typeof CreateEscolaSchema>;

export const ResponseEscolaSchema = z.object({
    id: z.string(),
    nome: z.string(),
    natureza: z.enum(natureza),
    codigo_mec: z.string(),
    nif: z.string(),
    localizacao: z.object({
        endereco: z.string(),
        cidade: z.string().optional(),
        provincia: z.string(),
        pais: z.string(),
    }),
    contacto: z.object({
        telefone: z.string(),
        outro_telefone: z.string().optional(),
        email: z.string(),
        outro_email: z.string().optional(),
    }),
    logo_url: z.string().optional(),
    data_criacao: z.date(),
    data_atualizacao: z.date(),
});

export type ResponseEscolaDTO = z.infer<typeof ResponseEscolaSchema>;