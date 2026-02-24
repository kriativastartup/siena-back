import {z} from 'zod';
import { status_matricula_enum, turno, modalidade_matricula_enum } from '@prisma/client';
import {validate} from "uuid";

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';


extendZodWithOpenApi(z);


export const createMatriculaDTO = z.object({
    aluno_id: z.string().refine((val) => validate(val), {
     message: "aluno_id deve ser um UUID válido",
    }),
    turma_id: z.string().refine((val) => validate(val), {
        message: "turma_id deve ser um UUID válido",
    }),
    escola_id : z.string().refine((val) => validate(val), {
        message: "escola_id deve ser um UUID válido",
    }),
    modalidade : z.enum(modalidade_matricula_enum, "modalidade deve ser de uma modalidade válida"),
    ano_letivo : z.string(),
    classe: z.number(),
    turno: z.enum(turno, "turno deve ser de um turno válido"),
    status: z.enum(status_matricula_enum, "status deve ser um status válido")
});

export type CreateMatriculaDTO = z.infer<typeof createMatriculaDTO>;

export const updateMatriculaDTO = z.object({
    turma_id: z.string().optional(),
    ano_letivo : z.string().optional(),
    classe: z.number().optional(),
    turno: z.enum(turno, "turno deve ser de um turno válido").optional(),
    status: z.enum(status_matricula_enum, "status deve ser um status válido").optional()
});

export type UpdateMatriculaDTO = z.infer<typeof updateMatriculaDTO>;

export const responseMatriculaSchema = z.object({
    id: z.string(),
    aluno_id: z.string(),
    turma_id: z.string(),
    escola_id : z.string(),
    ano_letivo : z.string(),
    classe: z.number(),
    turno: z.enum(turno),
    status: z.enum(status_matricula_enum),


    pessoa_id: z.string(),
    nome_completo: z.string(),
    bi: z.string(),
    dt_nascimento: z.date(),
    sexo: z.string(),
    telefone: z.string(),
    nacionalidade: z.string(),
    morada: z.string(),
    email: z.string(),
    data_criacao: z.date(),
    data_atualizacao: z.date(),
});

export type ResponseMatriculaDTO = z.infer<typeof responseMatriculaSchema>;

