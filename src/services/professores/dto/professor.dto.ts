import { z } from "zod";
import { sexo_enum, tipo_avaliacao_enum } from "@prisma/client";

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

    especialidade: z.string().max(100).optional(),
    categoria: z.string().max(100).optional(),
    habilitacoes: z.string().max(255).optional(),
    carga_horaria_sem: z.number().int().positive().optional(),

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



export type PropsResponseBad = {
    status: number;
    message: string;
};


export const CreateDisciplinaProfessorSchema = z.object({
    disciplina_id: z.string("O ID da disciplina é obrigatório").min(3, "O ID da disciplina deve ter pelo menos 3 caracteres").max(50),
    professor_id: z.string("O ID do professor é obrigatório").min(3, "O ID do professor deve ter pelo menos 3 caracteres").max(50),
    escola_id: z.string("O ID da escola é obrigatório").min(3, "O ID da escola deve ter pelo menos 3 caracteres").max(50)
});

export type CreateDisciplinaProfessorDTO = z.infer<typeof CreateDisciplinaProfessorSchema>;

export const ResponseDisciplinaProfessorSchema = z.object({
    nome_disciplina: z.string(),
    disciplina_id: z.string(),
    professor_id: z.string(),
    escola_id: z.string(),
    data_criacao: z.date(),
    data_atualizacao: z.date()
}).optional();

export type ResponseDisciplinaProfessorDTO = z.infer<typeof ResponseDisciplinaProfessorSchema>;

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
    estado: z.string(),
    disciplinas: ResponseDisciplinaProfessorSchema.array()
});

export type ResponseProfessorDTO = z.infer<typeof ResponseProfessorSchema>;

export const createAvaluationSchema = z.object({
    turma_id: z.string("O ID da turma é obrigatório").min(3, "O ID da turma deve ter pelo menos 3 caracteres").max(50),
    trimestre: z.enum(["1", "2", "3"], "O trimestre é obrigatório e deve ser 1, 2 ou 3"),
    disciplina_id: z.string("O ID da disciplina é obrigatório").min(3, "O ID da disciplina deve ter pelo menos 3 caracteres").max(50),
    escola_id: z.string("O ID da escola é obrigatório").min(3, "O ID da escola deve ter pelo menos 3 caracteres").max(50),
    avaliacao: z.number().int().min(1).max(5, "A avaliação deve ser um número inteiro entre 1 e 5"),
    tipo_avaliacao: z.enum(tipo_avaliacao_enum, "O tipo de avaliação é obrigatório e deve ser um valor válido"),
    data_avaliacao : z.string("A data da avaliação é obrigatória").refine((date) => !isNaN(Date.parse(date)), "Data da avaliação inválida"),
    descricao: z.string().optional()
});

export type CreateAvaluationDTO = z.infer<typeof createAvaluationSchema>;

export const ResponseAvaluationSchema = z.object({
    id: z.string(),
    turma_id: z.string(),
    trimestre: z.enum(["1", "2", "3"]),
    disciplina_id: z.string(),
    data_avaliacao: z.date(),
    avaliacao: z.number().int().min(1).max(5),
    tipo_avaliacao: z.enum(tipo_avaliacao_enum),
    data_criacao: z.date(),
    data_atualizacao: z.date()
});

export type ResponseAvaluationDTO = z.infer<typeof ResponseAvaluationSchema>;

export const UpdateAvaluationSchema = z.object({
    turma_id: z.string("O ID da turma é obrigatório").min(3, "O ID da turma deve ter pelo menos 3 caracteres").max(50).optional(),
    trimestre: z.enum(["1", "2", "3"], "O trimestre é obrigatório e deve ser 1, 2 ou 3").optional(),
    disciplina_id: z.string("O ID da disciplina é obrigatório").min(3, "O ID da disciplina deve ter pelo menos 3 caracteres").max(50).optional(),
    escola_id: z.string("O ID da escola é obrigatório").min(3, "O ID da escola deve ter pelo menos 3 caracteres").max(50).optional(),
    avaliacao: z.number().int().min(1).max(5, "A avaliação deve ser um número inteiro entre 1 e 5").optional(),
    tipo_avaliacao: z.enum(tipo_avaliacao_enum, "O tipo de avaliação é obrigatório e deve ser um valor válido").optional(),
    data_avaliacao : z.string("A data da avaliação é obrigatória").refine((date) => !isNaN(Date.parse(date)), "Data da avaliação inválida").optional(),
    descricao: z.string().optional()
});

export type UpdateAvaluationDTO = z.infer<typeof UpdateAvaluationSchema>;

export const createNotaSchema = z.object({
    aluno_id: z.string("O ID do aluno é obrigatório").min(3, "O ID do aluno deve ter pelo menos 3 caracteres").max(50),
    avaliacao_id: z.string("O ID da avaliação é obrigatório").min(3, "O ID da avaliação deve ter pelo menos 3 caracteres").max(50),
    nota_obtida: z.number().int().min(0).max(20, "A nota deve ser um número inteiro entre 0 e 20"),
    disciplina_id: z.string("O ID da disciplina é obrigatório").min(3, "O ID da disciplina deve ter pelo menos 3 caracteres").max(50),
    escola_id: z.string("O ID da escola é obrigatório").min(3, "O ID da escola deve ter pelo menos 3 caracteres").max(50)
});

export type CreateNotaDTO = z.infer<typeof createNotaSchema>;

export const ResponseNotaSchema = z.object({
    id: z.string(),
    aluno_id: z.string(),
    avaliacao_id: z.string(),
    nota_obtida: z.number().int().min(0).max(20),
    disciplina_id: z.string(),
    escola_id: z.string(),
    data_criacao: z.date(),
    data_atualizacao: z.date()
});

export type ResponseNotaDTO = z.infer<typeof ResponseNotaSchema>;

export const UpdateNotaSchema = z.object({
    aluno_id: z.string("O ID do aluno é obrigatório").min(3, "O ID do aluno deve ter pelo menos 3 caracteres").max(50).optional(),
    avaliacao_id: z.string("O ID da avaliação é obrigatório").min(3, "O ID da avaliação deve ter pelo menos 3 caracteres").max(50).optional(),
    nota_obtida: z.number().int().min(0).max(20, "A nota deve ser um número inteiro entre 0 e 20").optional(),
    disciplina_id: z.string("O ID da disciplina é obrigatório").min(3, "O ID da disciplina deve ter pelo menos 3 caracteres").max(50).optional(),
    escola_id: z.string("O ID da escola é obrigatório").min(3, "O ID da escola deve ter pelo menos 3 caracteres").max(50).optional()
});

export type UpdateNotaDTO = z.infer<typeof UpdateNotaSchema>;