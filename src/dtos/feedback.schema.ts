import { z } from "zod";

export const CreateFeedbackSchema = z.object({
    name: z.string("O seu nome é obrigatório").min(3, "O nome deve ter pelo menos 3 caracteres").max(100),
    email: z.string("O seu email é obrigatório").email("Formato de email inválido"),
    assunto: z.string("O seu assunto é obrigatório").min(2, "O assunto deve ter pelo menos 2 caracteres").max(100),
    mensagem: z.string("A sua mensagem é obrigatória").min(2, "A mensagem deve ter pelo menos 2 caracteres").max(1000),
    tipo: z.enum(["SOLICITACAO", "SUGESTAO", "RECLAMACAO", "ELOGIO", "OUTRO"], "O tipo de feedback é obrigatório e deve ser um tipo válido"),
});

export type CreateFeedbackDTO = z.infer<typeof CreateFeedbackSchema>;

export const ResponseFeedbackSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    assunto: z.string(),
    mensagem: z.string(),
    tipo: z.enum(["SOLICITACAO", "SUGESTAO", "RECLAMACAO", "ELOGIO", "OUTRO"]),
    estado: z.enum(["PENDENTE", "EM_ANALISE", "RESOLVIDO", "REJEITADO", "GUARDADO"]),
    data_criacao: z.date(),
    data_atualizacao: z.date(),
});

export type ResponseFeedbackDTO = z.infer<typeof ResponseFeedbackSchema>;