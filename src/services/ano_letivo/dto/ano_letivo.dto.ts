import {z} from 'zod';
import { da } from 'zod/v4/locales';

export const CreateAnoLectivoDTO = z.object({
    nome: z.string().min(1, 'O campo "ano" é obrigatório'),
    data_de_inicio: z.date().min(new Date(), 'A data de início deve ser no futuro'),
    data_de_fim: z.date().min(new Date(), 'A data de fim deve ser no futuro'),
    escola_id: z.string().min(1, 'O campo "escola_id" é obrigatório'),
});

export const UpdateAnoLectivoDTO = z.object({
    nome: z.string().min(1, 'O campo "ano" é obrigatório').optional(),
    data_de_inicio: z.date().min(new Date(), 'A data de início deve ser no futuro').optional(),
    data_de_fim: z.date().min(new Date(), 'A data de fim deve ser no futuro').optional(),
    escola_id: z.string().min(1, 'O campo "escola_id" é obrigatório').optional(),
});

export type CreateAnoLectivoDTOType = z.infer<typeof CreateAnoLectivoDTO>;
export type UpdateAnoLectivoDTOType = z.infer<typeof UpdateAnoLectivoDTO>;

export const ResponseAnoLectivoDTO = z.object({
    id: z.string(),
    nome: z.string(),
    data_inicio: z.string(),
    data_fim: z.string(),
    escola_id: z.string(),
    data_criacao: z.string(),
    data_atualizacao: z.string()
});

export type ResponseAnoLectivoDTOType = z.infer<typeof ResponseAnoLectivoDTO>;