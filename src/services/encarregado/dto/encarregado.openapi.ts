import {registry} from "../../../openapi/registry";
import {z} from "zod";
import * as Schema from "./encarregado.dto";

const BASE = "/api/v1/guardian";

registry.register("Encarregado", Schema.ResponseEncarregadoSchema);

// Criar um encarregado
registry.registerPath({
    method: "post",
    path: `${BASE}/create`,
    tags: ["Encarregado"],

    request: {
        body: {
            content: {
                "application/json": {
                    schema: Schema.CreateEncarregadoSchema
                }
            }
        }
    },
    responses: {
        201: {
            description: "Encarregado criado com sucesso",
            content: {
                "application/json": {
                    schema: Schema.ResponseEncarregadoSchema
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

// Listar encarregados por escola
registry.registerPath({
    method: "get",
    path: `${BASE}/all/{escola_id}`,
    tags: ["Encarregado"],
    request: {
        params: z.object({
            escola_id: z.string("O ID da escola é obrigatório").min(3, "O ID da escola deve ter pelo menos 3 caracteres").max(50)
        })
    },
    responses: {
        200: {
            description: "Encarregados listados com sucesso",
            content: {
                "application/json": {
                    schema: z.array(Schema.ResponseEncarregadoSchema)
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

// Listar encarregado por ID
registry.registerPath({
    method: "get",
    path: `${BASE}/each/{encarregado_id}`,
    tags: ["Encarregado"],
    request: {
        params: z.object({
            encarregado_id: z.string("O ID do encarregado é obrigatório").min(3, "O ID do encarregado deve ter pelo menos 3 caracteres").max(50)
        })
    },
    responses: {
        200: {
            headers: {
                "Authorization": {
                    description: "Bearer Token de autenticação JWT",      
                }
            },
            description: "Encarregado encontrado com sucesso",
            content: {
                "application/json": {
                    schema: Schema.ResponseEncarregadoSchema
                }
            }
        },
        400: {
            description: "ID do encarregado inválido",
        },
        404: {
            description: "Encarregado não encontrado",
        },
        500: {
            description: "Erro interno do servidor",
        }
    }
});

// listar os meus dados
registry.registerPath({
    method: "get",
    path: `${BASE}/me`,
    tags: ["Encarregado"],
    responses: {
        200: {
            headers: {
             "Authorization": {
                description: "Bearer Token de autenticação JWT",      
             }
            },
            description: "Dados do encarregado retornados com sucesso",
            content: {
                "application/json": {
                    schema: Schema.ResponseEncarregadoSchema
                }
            }
        },
        401: {
            description: "Usuário não autenticado",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string" }
                        }
                    }
                }
            }
        },
        404: {
            description: "Encarregado não encontrado",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string" }
                        }
                    }
                }
            }
        },
        500: {
            description: "Erro interno do servidor",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string" }
                        }
                    }
                }
            }
        }
    }
});