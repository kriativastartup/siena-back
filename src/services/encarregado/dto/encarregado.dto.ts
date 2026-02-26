import { z } from "zod";
import { sexo_enum } from "@prisma/client";

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CreateEncarregadoSchema = z.object({
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
        .max(20),

    nacionalidade: z.string()
        .min(2, "A nacionalidade deve ter pelo menos 2 caracteres")
        .max(50)
        .optional(),

    morada: z.string()
        .min(5, "A morada deve ter pelo menos 5 caracteres")
        .max(300)
        .optional(),

    email: z.string()
        .email("Formato de email inválido"),

    profissao: z.string().max(100).optional(),
    escolaridade: z.string().max(100).optional(),
});

export type CreateEncarregadoDTO = z.infer<typeof CreateEncarregadoSchema>;

export const ResponseEncarregadoSchema = z.object({
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

    profissao: z.string().optional(),
    escolaridade: z.string().optional(),

    data_criacao: z.date(),
    data_atualizacao: z.date(),

    username: z.string(),
    tipo_usuario: z.string(),
    estado: z.string()
});

export type ResponseEncarregadoDTO = z.infer<typeof ResponseEncarregadoSchema>;

export type PropsResponseBad = {
    status: number;
    message: string;
};
