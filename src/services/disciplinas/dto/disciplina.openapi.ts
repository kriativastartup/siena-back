import {registry} from "../../../openapi/registry";
import { z } from "zod";
import * as Schema from "./disciplina.dto";

registry.register("Disciplina", Schema.ResponseDisciplinaSchema);

// Criar uma disciplina
registry.registerPath({
    method: "post",
    path: "/api/v1/discipline/add",
    tags: ["Disciplina"],

    request: {
        body: {
            content: {
                "application/json": {
                    schema: Schema.criarDisciplinaSchema
                }
            }
        }
    },
    responses: {
        201: {
            headers: {
                "Authorization": {
                    description: "Bearer Token de autenticação JWT",
                }
            },
            description: "Disciplina criada com sucesso",
            content: {
                "application/json": {
                    schema: Schema.ResponseDisciplinaSchema
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

// Listar disciplinas por escola
registry.registerPath({
    method: "get",
    path: "/api/v1/discipline/all/{escola_id}",
    tags: ["Disciplina"],
    request: {
       params: z.object({
            escola_id: z.string("O ID da escola é obrigatório").min(3, "O ID da escola deve ter pelo menos 3 caracteres").max(50)
        })
    },
    responses: {
        200: {
            headers: {
                "Authorization": {
                    description: "Bearer Token de autenticação JWT",
                }
            },
            description: "Disciplinas listadas com sucesso",
            content: {
                "application/json": {
                    schema: z.array(Schema.ResponseDisciplinaSchema)
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

// Listar disciplina por ID
registry.registerPath({
    method: "get",
    path: "/api/v1/discipline/each/{disciplina_id}",
    tags: ["Disciplina"],
    request: {
        params: z.object({
            disciplina_id: z.string("O ID da disciplina é obrigatório").min(3, "O ID da disciplina deve ter pelo menos 3 caracteres").max(50)
        })
    },
    responses: {
        200: {
            headers: {
                "Authorization": {
                    description: "Bearer Token de autenticação JWT",
                }
            },
            description: "Disciplina listada com sucesso",
            content: {
                "application/json": {
                    schema: Schema.ResponseDisciplinaSchema
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

// Atualizar disciplina por ID
registry.registerPath({
    method: "put",
    path: "/api/v1/discipline/update/{disciplina_id}",
    tags: ["Disciplina"],

    request: {
        params: z.object({
            disciplina_id: z.string("O ID da disciplina é obrigatório").min(3, "O ID da disciplina deve ter pelo menos 3 caracteres").max(50)
        }),
        body: {
            content: {
                "application/json": {
                    schema: Schema.atualizarDisciplinaSchema
                }
            }
        }
    },
    responses: {
        200: {
            headers: {
                "Authorization": {
                    description: "Bearer Token de autenticação JWT",
                }
            },
            description: "Disciplina atualizada com sucesso",
            content: {
                "application/json": {
                    schema: Schema.ResponseDisciplinaSchema
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