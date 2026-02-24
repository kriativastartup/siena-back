import { z } from "zod";
import { sexo_enum } from "@prisma/client";

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';


extendZodWithOpenApi(z);

export const CreateProfessorSchema = z.object({
    nome_completo: z.string("O nome completo é obrigatório")
        .min(3, "O nome deve ter pelo menos 3 caracteres")
        .max(100),

    bi: z.string("O BI é obrigatório")
        .min(9, "O BI deve ter pelo menos 9 caracteres")
        .max(20),

    dt_nascimento: z.string("A data de nascimento é obrigatória")
        .refine((date) => !isNaN(Date.parse(date)), "Data de nascimento inválida"),

    sexo: z.enum(sexo_enum, "O sexo é obrigatório e deve ser válido"),

    telefone: z.string()
        .min(9, "O telefone deve ter pelo menos 9 caracteres")
        .max(20)
        .optional(),

    nacionalidade: z.string()
        .min(2, "A nacionalidade deve ter pelo menos 2 caracteres")
        .max(50)
        .optional(),

    morada: z.string()
        .min(5, "A morada deve ter pelo menos 5 caracteres")
        .max(300)
        .optional(),

    email: z.string()
        .email("Formato de email inválido")
        .optional(),

    especialidade: z.string().max(100).optional(),
    categoria: z.string().max(100).optional(),
    habilitacoes: z.string().max(255).optional(),
    carga_horaria_sem: z.number().int().positive().optional(),

    senha_hash: z.string("A senha é obrigatória")
        .min(6, "A senha deve ter pelo menos 6 caracteres")
        .max(255),

    escola_id: z.string().optional()
});

export type CreateProfessorDTO = z.infer<typeof CreateProfessorSchema>;


export const UpdateProfessorSchema = z.object({
    nome_completo: z.string("O nome completo é obrigatório")
        .min(3, "O nome deve ter pelo menos 3 caracteres")
        .max(100)
        .optional(),

    bi: z.string("O BI é obrigatório")
        .min(9, "O BI deve ter pelo menos 9 caracteres")
        .max(20)
        .optional(),

    dt_nascimento: z.string("A data de nascimento é obrigatória")
        .refine((date) => !isNaN(Date.parse(date)), "Data de nascimento inválida")
        .optional(),

    sexo: z.enum(sexo_enum, "O sexo é obrigatório e deve ser válido").optional(),

    telefone: z.string()
        .min(9, "O telefone deve ter pelo menos 9 caracteres")
        .max(20)
        .optional(),

    nacionalidade: z.string()
        .min(2, "A nacionalidade deve ter pelo menos 2 caracteres")
        .max(50)
        .optional(),

    morada: z.string()
        .min(5, "A morada deve ter pelo menos 5 caracteres")
        .max(300)
        .optional(),

    email: z.string()
        .email("Formato de email inválido")
        .optional(),

    especialidade: z.string().max(100).optional(),
    categoria: z.string().max(100).optional(),
    habilitacoes: z.string().max(255).optional(),
    carga_horaria_sem: z.number().int().positive().optional(),

    senha_hash: z.string("A senha é obrigatória")
        .min(6, "A senha deve ter pelo menos 6 caracteres")
        .max(255)
        .optional(),

    escola_id: z.string().optional()
});

export type UpdateProfessorDTO = z.infer<typeof UpdateProfessorSchema>;

export const ResponseProfessorSchema = z.object({
    id: z.string(),
    pessoa_id: z.string(),

    nome_completo: z.string(),
    bi: z.string().optional(),
    dt_nascimento: z.date().optional(),
    sexo: z.enum(sexo_enum).optional(),

    telefone: z.string().optional(),
    nacionalidade: z.string().optional(),
    morada: z.string().optional(),
    email: z.string().optional(),

    especialidade: z.string().optional(),
    categoria: z.string().optional(),
    habilitacoes: z.string().optional(),
    carga_horaria_sem: z.number().optional(),

    escola_id: z.string().optional(),

    data_criacao: z.date(),

    username: z.string(),
    tipo_usuario: z.string(),
    estado: z.string()
});

export type ResponseProfessorDTO = z.infer<typeof ResponseProfessorSchema>;

export type PropsResponseBad = {
    status: number;
    message: string;
};
