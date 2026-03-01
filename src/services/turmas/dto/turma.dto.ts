import {z} from "zod";
import { turno } from "@prisma/client";
import { validate } from "uuid";
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);



export const createTurmaSchema = z.object({
    nome: z.string().min(1, "O nome da turma é obrigatório"),
    escola_id: z.string().refine((value) => validate(value), "O ID da escola deve ser um UUID válido"),
    curso_id: z.string().refine((value) => validate(value), "O ID do curso deve ser um UUID válido"),
    ano_letivo: z.string(),
    horario_aula: z.unknown(),
    professor_id : z.string().refine((value) => validate(value), "O ID do professor deve ser um UUID válido").optional(),
    turno: z.enum(turno, "O turno deve ser MANHA, TARDE ou NOITE"),
    classe: z.number().int("A classe deve ser um número inteiro").positive("A classe deve ser um número positivo"),
    capacidade: z.number().int("A capacidade máxima deve ser um número inteiro").positive("A capacidade máxima deve ser um número positivo"),
});


export type CreateTurmaDTO = z.infer<typeof createTurmaSchema>;

export const updateTurmaSchema = z.object({
    nome: z.string().min(1, "O nome da turma é obrigatório").optional(),
    escola_id: z.string().refine((value) => validate(value), "O ID da escola deve ser um UUID válido").optional(),
    curso_id: z.string().refine((value) => validate(value), "O ID do curso deve ser um UUID válido").optional(),
    ano_letivo: z.string().optional(),
    horario_aula: z.unknown().optional(),
    professor_id : z.string().refine((value) => validate(value), "O ID do professor deve ser um UUID válido").optional(),
    ano_letivo_id : z.string().refine((value) => validate(value), "O ID do ano letivo deve ser um UUID válido").optional(),
    turno: z.enum(turno, "O turno deve ser MANHA, TARDE ou NOITE").optional(),
    classe: z.number().int("A classe deve ser um número inteiro").positive("A classe deve ser um número positivo").optional(),
    capacidade: z.number().int("A capacidade máxima deve ser um número inteiro").positive("A capacidade máxima deve ser um número positivo").optional(),
});

export type UpdateTurmaDTO = z.infer<typeof updateTurmaSchema>;

export const responseTurmaSchema = z.object({
    id: z.string().refine((value) => validate(value), "O ID da turma deve ser um UUID válido"),
    nome: z.string(),
    escola_id: z.string().refine((value) => validate(value), "O ID da escola deve ser um UUID válido"),
    curso_id: z.string().refine((value) => validate(value), "O ID do curso deve ser um UUID válido"),
    ano_letivo: z.string(),
    ano_letivo_id: z.string().refine((value) => validate(value), "O ID do ano letivo deve ser um UUID válido"),
    turno: z.enum(turno),
    horario_aula: z.unknown(),
    professor_id : z.string().refine((value) => validate(value), "O ID do professor deve ser um UUID válido").optional(),
    professor_nome : z.string().optional(),
    classe: z.number().int().positive(),
    capacidade: z.number().int().positive(),
    data_criacao: z.string(),
    data_atualizacao: z.string(),
});

export type ResponseTurmaDTO = z.infer<typeof responseTurmaSchema>;

export type PropsResponseBad = {
    status: number;
    message: string;
};