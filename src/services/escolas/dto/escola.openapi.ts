import {registry} from "../../../openapi/registry";
import {z} from "zod";
import * as Schema from "./escola.dto";

registry.register("Escola", Schema.ResponseEscolaSchema);

// Criar uma escola
registry.registerPath({
    method: "post",
    path: "/api/v1/school/create",
    tags: ["Escola"],

    request: {
        body: {
            content: {
                "application/json": {
                    schema: Schema.CreateEscolaSchema
                }
            }
        }
    },
    responses: {
        201: {
            description: "Escola criada com sucesso",
            content: {
                "application/json": {
                    schema: Schema.ResponseEscolaSchema
                }
            }
        },
        400: {
            description: "Dados inválidos",
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

// Listar todas as escolas
registry.registerPath({
    method: "get",
    path: "/api/v1/school/list",
    tags: ["Escola"],
    request: {
        query: z.object({
            search: z.string().optional(),
            page: z.number().int().positive().optional(),
            limit: z.number().int().positive().optional()
        })
    },
    responses: {
        200: {
            description: "Lista de escolas obtida com sucesso",
            content: {
                "application/json": {
                    schema: z.array(Schema.ResponseEscolaSchema)
                }
            }
        },
        404: {
            description: "Nenhuma escola encontrada",
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

// Listar alunos de uma escola
registry.registerPath({
    method: "get",
    path: "/api/v1/school/each/{escola_id}",
    tags: ["Escola"],
    request: {
        params: z.object({
            escola_id: z.string()
        }),
        query: z.object({
            search: z.string().optional(),
            page: z.number().int().positive().optional(),
            limit: z.number().int().positive().optional()
        })
    },
    responses: {
        200: {
            description: "Pegar uma escola específica",
            content: {
                "application/json": {
                    schema: Schema.ResponseEscolaSchema
                }
            }
        },
        404: {
            description: "Escola não encontrada",
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

// actualizar uma escola
registry.registerPath({
    method: "put",
    path: "/api/v1/school/update/{escola_id}",
    tags: ["Escola"],

    request: {
        params: z.object({
            escola_id: z.string()
        }),
        body: {
            content: {
                "application/json": {
                    schema: Schema.UpdateEscolaSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "Escola actualizada com sucesso",
            content: {
                "application/json": {
                    schema: Schema.ResponseEscolaSchema
                }
            }
        },
        400: {
            description: "Dados inválidos",
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
            description: "Escola não encontrada",
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

// eliminar uma escola
registry.registerPath({
    method: "delete",
    path: "/api/v1/school/delete/{escola_id}",
    tags: ["Escola"],
    request: {
        params: z.object({
            escola_id: z.string()
        })
    },
    responses: {
        200: {
            description: "Escola eliminada com sucesso",
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
            description: "Escola não encontrada",
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

registry.registerPath({
    method: "put",
    path: "/api/v1/school/update/infra/{escola_id}",
    tags: ["Escola"],

    request: {
        params: z.object({
            escola_id: z.string()
        }),
        body: {
            content: {
                "application/json": {
                    schema: Schema.CreateInfraEscolaSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "Infraestrutura da escola actualizada com sucesso",
            content: {
                "application/json": {
                    schema: Schema.ResponseEscolaSchema
                }
            }
        },
        400: {
            description: "Dados inválidos"
        },
        404: {
            description: "Escola não encontrada",
        }
    }
});