import {z} from "zod";
import {cargo_funcionario_enum, sexo_enum, tipo_usuario_enum} from "@prisma/client";
import { validate } from "uuid";

export const CreateFuncionarioSchema = z.object({
    nome_completo: z.string("O nome completo é obrigatório")
        .min(3, "O nome deve ter pelo menos 3 caracteres")
        .max(100),

    bi: z.string("O BI é obrigatório")
        .min(9, "O BI deve ter pelo menos 9 caracteres")
        .max(20),

    dt_nascimento: z.string("A data de nascimento é obrigatória")
        .refine((date) => {
            const parsedDate = Date.parse(date);
            if(isNaN(parsedDate)){
                return false;
            }
            // verificar se é menor de idade mínima (18 anos)
            const today = new Date();
            const birthDate = new Date(parsedDate);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age >= 18;
        }, "Data de nascimento inválida ou funcionário menor de idade"),

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
        .email("Formato de email inválido"),

    cargo: z.enum(cargo_funcionario_enum, "O cargo é obrigatório e deve ser válido"),
    departamento: z.string().max(100).optional(),
    escola_id : z.string().refine((id => validate(id)), "ID de escola inválido")
});

export type CreateFuncionarioDTO = z.infer<typeof CreateFuncionarioSchema>;

export const UpdateFuncionarioSchema = z.object({
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

    cargo: z.enum(cargo_funcionario_enum, "O cargo é obrigatório e deve ser válido").optional(),
    departamento: z.string().max(100).optional(),
    tipo_usuario: z.enum(tipo_usuario_enum, "O tipo de usuário é obrigatório e deve ser válido").optional(),

    senha_hash: z.string("A senha é obrigatória")
        .min(6, "A senha deve ter pelo menos 6 caracteres")
        .max(255)
        .optional(),
});

export type UpdateFuncionarioDTO = z.infer<typeof UpdateFuncionarioSchema>;


export const ResponseFuncionarioSchema = z.object({
    id: z.string(),
    pessoa_id: z.string(),

    nome_completo: z.string(),
    bi: z.string().optional(),
    dt_nascimento: z.date().optional(),
    sexo: z.enum(sexo_enum).optional(),

    telefone: z.string().optional(),
    nacionalidade: z.string().optional(),
    morada: z.string().optional(),
    email: z.string(),

    cargo: z.string().optional(),
    departamento: z.string().optional(),
    tipo_usuario: z.enum(tipo_usuario_enum).optional(),
    escola_id : z.string(),
    username : z.string(),
    estado : z.string(),

    data_criacao: z.date(),
    data_atualizacao: z.date()
});

export type ResponseFuncionarioDTO = z.infer<typeof ResponseFuncionarioSchema>;


export type PropsResponseBad = {
    status: number;
    message: string;
};