import {z} from 'zod';
import {validate} from 'uuid';


export const createCursoSchema = z.object({
    nome: z.string().min(1, "O nome do curso é obrigatório"),
    descricao: z.string().optional(),
    abreviacao: z.string().optional(),
    escola_id: z.string().refine((id) => validate(id), "ID de escola inválido"),
});

export type CreateCursoDTO = z.infer<typeof createCursoSchema>;

export const updateCursoSchema = z.object({
    nome: z.string().min(1, "O nome do curso é obrigatório").optional(),
    descricao: z.string().optional(),
    abreviacao: z.string().optional(),
    escola_id: z.string().refine((id) => validate(id), "ID de escola inválido").optional(),
});

export type UpdateCursoDTO = z.infer<typeof updateCursoSchema>;

export const responseCursoSchema = z.object({
    id: z.string(),
    nome: z.string(),
    descricao: z.string().nullable(),
    abreviacao: z.string().nullable(),
    escola_id: z.string(),
    data_criacao: z.date(),
    data_atualizacao: z.date(),
});

export type ResponseCursoDTO = z.infer<typeof responseCursoSchema>;

export type PropsResponseBad = {
    status: number;
    message: string;
};