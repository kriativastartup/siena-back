import { z } from "zod";
import { sexo_enum, status_aluno } from "@prisma/client";
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';


extendZodWithOpenApi(z);

export const CreateAlunoSchema = z.object({
    nome_completo: z.string("O nome completo do aluno é obrigatório").min(3, "O nome deve ter pelo menos 3 caracteres").max(100),
    bi : z.string("O BI do aluno é obrigatório").min(9, "O BI deve ter pelo menos 9 caracteres").max(20),
    dt_nascimento: z.string("A data de nascimento é obrigatória").refine((date) => {
        return !isNaN(Date.parse(date));
    }, "Data de nascimento inválida"),
    sexo: z.enum(sexo_enum, "O sexo é obrigatório e deve ser um tipo válido"),
    telefone: z.string("O telefone é obrigatório").min(9, "O telefone deve ter pelo menos 9 caracteres").max(20),
    nacionalidade: z.string("A nacionalidade é obrigatória").min(2, "A nacionalidade deve ter pelo menos 2 caracteres").max(50).optional(),
    morada: z.string("A morada é obrigatória").min(5, "A morada deve ter pelo menos 5 caracteres").max(300).optional(),
    email: z.string("O email é obrigatório").email("Formato de email inválido"),
    n_processo: z.string("O número de processo é obrigatório").min(3, "O número de processo deve ter pelo menos 3 caracteres").max(20),
    necessidades_especiais: z.object({
        descricao: z.string("A descrição das necessidades especiais é obrigatória").min(5, "A descrição deve ter pelo menos 5 caracteres").max(300).optional(),
        tipo: z.string("O tipo de necessidade especial é obrigatório").min(3, "O tipo deve ter pelo menos 3 caracteres").max(50).optional(),
    }).optional(),
    foto : z.string("A URL da foto é obrigatória").min(5, "A URL da foto deve ter pelo menos 5 caracteres").max(255).optional(),
    escola_id : z.string("O ID da escola é obrigatório").min(3, "O ID da escola deve ter pelo menos 3 caracteres").max(50)
});

export type CreateAlunoDTO = z.infer<typeof CreateAlunoSchema>;

export const UpdateAlunoSchema = z.object({
    nome_completo: z.string("O nome completo do aluno é obrigatório").min(3, "O nome deve ter pelo menos 3 caracteres").max(100).optional(),
    bi : z.string("O BI do aluno é obrigatório").min(9, "O BI deve ter pelo menos 9 caracteres").max(20).optional(),
    dt_nascimento: z.string("A data de nascimento é obrigatória").refine((date) => {
        return !isNaN(Date.parse(date));
    }, "Data de nascimento inválida").optional(),
    sexo: z.enum(sexo_enum, "O sexo é obrigatório e deve ser um tipo válido").optional(),
    telefone: z.string("O telefone é obrigatório").min(9, "O telefone deve ter pelo menos 9 caracteres").max(20).optional(),
    nacionalidade: z.string("A nacionalidade é obrigatória").min(2, "A nacionalidade deve ter pelo menos 2 caracteres").max(50).optional(),
    morada: z.string("A morada é obrigatória").min(5, "A morada deve ter pelo menos 5 caracteres").max(300).optional(),
    email: z.string("O email é obrigatório").email("Formato de email inválido").optional(),
    n_processo: z.string("O número de processo é obrigatório").min(3, "O número de processo deve ter pelo menos 3 caracteres").max(20).optional(),
    necessidades_especiais: z.object({
        descricao: z.string("A descrição das necessidades especiais é obrigatória").min(5, "A descrição deve ter pelo menos 5 caracteres").max(300).optional(),
        tipo: z.string("O tipo de necessidade especial é obrigatório").min(3, "O tipo deve ter pelo menos 3 caracteres").max(50).optional(),
    }).optional(),
    status: z.enum(status_aluno, "O status do aluno é obrigatório e deve ser um tipo válido").optional(),
    foto : z.string("A URL da foto é obrigatória").min(5, "A URL da foto deve ter pelo menos 5 caracteres").max(255).optional(),
    senha_hash: z.string("A senha é obrigatória").min(6, "A senha deve ter pelo menos 6 caracteres").max(255).optional(),
    escola_id : z.string("O ID da escola é obrigatório").min(3, "O ID da escola deve ter pelo menos 3 caracteres").max(50).optional()
});

export type UpdateAlunoDTO = z.infer<typeof UpdateAlunoSchema>;

export const ResponseAlunoSchema = z.object({
    id: z.string(),
    pessoa_id : z.string(),
    nome_completo: z.string(),
    bi : z.string(),
    dt_nascimento: z.date(),
    sexo: z.enum(sexo_enum),
    escola_id: z.string(),
    telefone: z.string(),
    nacionalidade: z.string().optional(),
    morada: z.string().optional(),
    email: z.string(),
    n_processo: z.string(),
    necessidades_especiais: z.object({
        descricao: z.string(),
        tipo: z.string(),
    }).optional(),
    foto : z.string().optional(),
    status: z.string(),
    data_criacao: z.date(),
    data_atualizacao: z.date(),
    username: z.string(),
    tipo_usuario: z.string(),
    estado : z.string()
});

export type ResponseAlunoDTO = z.infer<typeof ResponseAlunoSchema>;

export type PropsResponseBad = {
    status: number;
    message: string;
};
