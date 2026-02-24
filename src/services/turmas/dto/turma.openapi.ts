import {registry} from "../../../openapi/registry";
import {z} from "zod";
import * as Schema from "./turma.dto";

const BASE = "/api/v1/class";

registry.register("Turma", Schema.responseTurmaSchema);

// Criar uma turma
registry.registerPath({
    method: "post",
    path: `${BASE}/create`,
    tags: ["Turma"],

    request: {
        body: {
            content: {
                "application/json": {
                    schema: Schema.createTurmaSchema
                }
            }
        }
    },
    responses: {
        201: {
            description: "Turma criada com sucesso",
            content: {
                "application/json": {
                    schema: Schema.responseTurmaSchema
                }
            }
        },
        400: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string" }
                        }
                    }
                }
            },
            description: "Dados inválidos fornecidos",
        },
        500: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string" }
                        }
                    }
                }
            },
            description: "Erro interno do servidor",
        }
    }
});

// Listar turmas por escola
registry.registerPath({
    method: "get",
    path: `${BASE}/all/{escola_id}`,
    tags: ["Turma"],
    request: {
        params: z.object({
            escola_id: z.string("O ID da escola é obrigatório").min(3, "O ID da escola deve ter pelo menos 3 caracteres").max(50)
        })
    },
    responses: {
        200: {
            description: "Turmas listadas com sucesso",
            content: {
                "application/json": {
                    schema: z.array(Schema.responseTurmaSchema)
                }
            }
        },
        400: {
            description: "ID da escola inválido",
        },
        500: {
            description: "Erro interno do servidor",
        }
    }
});

// pegar uma turma por ID
registry.registerPath({
    method: "get",
    path: `${BASE}/each/:turma_id`,
    tags: ["Turma"],
    request: {
        params: z.object({
            turma_id: z.string("O ID da turma é obrigatório").min(3, "O ID da turma deve ter pelo menos 3 caracteres").max(50)
        })
     },
     responses: {
        200: {
            description: "Turma listada com sucesso",
            content: {
                "application/json": {
                    schema: Schema.responseTurmaSchema
                }
            }
        },
        400: {
            description: "ID da turma inválido",
        },
        404: {
            description: "Turma não encontrada",
        },
        500: {
            description: "Erro interno do servidor",
        }
     }
});

// Atualizar uma turma por ID
registry.registerPath({
    method: "put",
    path: `${BASE}/update/{turma_id}`,
    tags: ["Turma"],
    request: {
        params: z.object({
            turma_id: z.string("O ID da turma é obrigatório").min(3, "O ID da turma deve ter pelo menos 3 caracteres").max(50)
        }),
        body: {
            content: {
                "application/json": {
                    schema: Schema.updateTurmaSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "Turma atualizada com sucesso",
            content: {
                "application/json": {
                    schema: Schema.responseTurmaSchema
                }
            }
        },
        400: {
            description: "ID da turma inválido ou dados de atualização inválidos",
        },
        404: {
            description: "Turma não encontrada",
        },
         500: {
            description: "Erro interno do servidor",
        }
    }
});
