import {registry} from "../../../openapi/registry";
import {z} from "zod";
import * as Schema from "./curso.dto";


const BASE = "/api/v1/course";

registry.register("Curso", Schema.responseCursoSchema);

// Criar um curso
registry.registerPath({
    method: "post",
    path: `${BASE}/create`,
    tags: ["Curso"],

    request: {
        body: {
            content: {
                "application/json": {
                    schema: Schema.responseCursoSchema
                }
            }
        }
    },
    responses: {
        201: {
            description: "Curso criado com sucesso",
            headers: {
                "Authorization": {
                    description: "Bearer Token de autenticação JWT",      
                }
            },
            content: {
                "application/json": {
                    schema: Schema.responseCursoSchema
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

// Listar cursos por escola
registry.registerPath({
    method: "get",
    path: `${BASE}/all/{escola_id}`,
    tags: ["Curso"],
    request: {
        query: z.object({
            escola_id: z.string("O ID da escola é obrigatório").min(3, "O ID da escola deve ter pelo menos 3 caracteres").max(50)
        })
    },
    responses: {
        200: {
            description: "Cursos listados com sucesso",
            content: {
                "application/json": {
                    schema: z.array(Schema.responseCursoSchema)
                }
            }
        },
        400: {
            description: "ID da escola inválido",
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

// Listar um curso por ID
registry.registerPath({
    method: "get",
    path: `${BASE}/each/{curso_id}`,
    tags: ["Curso"],
    request: {
        params: z.object({
            curso_id: z.string().uuid()
        })
    },
    responses: {
        200: {
            description: "Curso retornado com sucesso",
            content: {
                "application/json": {
                    schema: Schema.responseCursoSchema
                }
            }
        },
        404: {
            description: "Curso não encontrado",
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

//update um curso
registry.registerPath({
    method: "put",
    path: `${BASE}/update/{curso_id}`,
    tags: ["Curso"],

    request: {
        params: z.object({
            curso_id: z.string().uuid()
        }),
        body: {
            content: {
                "application/json": {
                    schema: Schema.responseCursoSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "Curso actualizado com sucesso",
            content: {
                "application/json": {
                    schema: Schema.responseCursoSchema
                }
             }
        },
        404: {
            description: "Curso não encontrado",
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

// Eliminar um curso
registry.registerPath({
    method: "delete",
    path: `${BASE}/delete/{curso_id}`,
    tags: ["Curso"],
    request: {
        params: z.object({
            curso_id: z.string().uuid()
        })
    },
    responses: {
        200: {
            description: "Curso eliminado com sucesso",
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
            description: "Curso não encontrado",
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