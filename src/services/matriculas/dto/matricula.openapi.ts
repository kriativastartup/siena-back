import {registry} from "../../../openapi/registry";
import {z} from "zod";
import * as Schema from "./matricula.dto";

registry.register("Matricula", Schema.responseMatriculaSchema);

// Criar uma matrícula
registry.registerPath({
    method: "post",
    path: "/api/v1/registration/create",
    tags: ["Matricula"],

    request: {
        body: {
            content: {
                "application/json": {
                    schema: Schema.responseMatriculaSchema
                }
            }
        }
    },
    responses: {
        201: {
            description: "Matrícula criada com sucesso",
            content: {
                "application/json": {
                    schema: Schema.responseMatriculaSchema
                }
            }
        },
        400: {
            description: "Dados inválidos fornecidos",
        },
        500: {
            description: "Erro interno do servidor",
        }
    }
});

// Listar matrículas id
registry.registerPath({
    method: "get",
    path: "/api/v1/registration/each/{matricula_id}",
    tags: ["Matricula"],
    request: {
        params: z.object({
            matricula_id: z.string("O ID da matrícula é obrigatório").min(3, "O ID da matrícula deve ter pelo menos 3 caracteres").max(50)
        })
    },
    responses: {
        200: {
            description: "Matrículas listadas com sucesso",
            content: {
                "application/json": {
                    schema: z.array(Schema.responseMatriculaSchema)
                }
            }
        },
        400: {
            description: "ID do aluno ou ano letivo inválido",
        },
        500: {
            description: "Erro interno do servidor",
        }
    }
});

// Listar matrículas por escola
registry.registerPath({
    method: "get",
    path: "/api/v1/registration/all/{escola_id}/{ano_letivo}",
    tags: ["Matricula"],
    request: {
        params: z.object({
            escola_id: z.string("O ID da escola é obrigatório").min(3, "O ID da escola deve ter pelo menos 3 caracteres").max(50),
            ano_letivo: z.string("O ano letivo é obrigatório").min(4, "O ano letivo deve ter pelo menos 4 caracteres").max(9)
        })
    },
    responses: {
        200: {
            description: "Matrículas listadas com sucesso",
            content: {
                "application/json": {
                    schema: z.array(Schema.responseMatriculaSchema)
                }
            }
        },
        400: {
            description: "ID da escola ou ano letivo inválido",
        },
        500: {
            description: "Erro interno do servidor",
        }
    }
});
