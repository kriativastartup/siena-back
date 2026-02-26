import { z } from "zod";
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const criarDisciplinaSchema = z.object({
    nome: z.string("O nome da disciplina é obrigatório").min(3, "O nome deve ter pelo menos 3 caracteres").max(100),
    carga_horaria_sem: z.number("A carga horária semanal é obrigatória").min(1, "A carga horária semanal deve ser pelo menos 1").max(40),
    escola_id: z.string("O ID da escola é obrigatório").min(3, "O ID da escola deve ter pelo menos 3 caracteres").max(50)
});

export type CriarDisciplinaDTO = z.infer<typeof criarDisciplinaSchema>;

export const atualizarDisciplinaSchema = z.object({
    nome: z.string("O nome da disciplina é obrigatório").min(3, "O nome deve ter pelo menos 3 caracteres").max(100).optional(),
    carga_horaria_sem: z.number("A carga horária semanal é obrigatória").min(1, "A carga horária semanal deve ser pelo menos 1").max(40).optional(),
    escola_id: z.string("O ID da escola é obrigatório").min(3, "O ID da escola deve ter pelo menos 3 caracteres").max(50).optional()
});

export type AtualizarDisciplinaDTO = z.infer<typeof atualizarDisciplinaSchema>;

export const ResponseDisciplinaSchema = z.object({
    id: z.string(),
    nome: z.string(),
    carga_horaria_sem: z.number(),
    escola_id: z.string(),
    data_criacao: z.string(),
    data_atualizacao: z.string()
});

export type ResponseDisciplinaDTO = z.infer<typeof ResponseDisciplinaSchema>;

export type ResponseBad = {
    message: string;
    status: number;
}