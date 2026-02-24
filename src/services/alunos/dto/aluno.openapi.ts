import {registry} from "../../../openapi/registry";
import { z } from "zod";
import * as Schema from "./alunos.dto";

registry.register("Aluno", Schema.ResponseAlunoSchema);


// Pegar o aluno por turma_id
registry.registerPath({
    method: "get",
    path: "/api/v1/student/{turma_id}",
    tags: ["Aluno"],

    request: {
        params: z.object({
            turma_id: z.string().uuid()
        }),
        query: z.object({
            limit: z.string().optional(),
            page: z.string().optional(),
            search: z.string().optional()
        })
    },
    responses: {
        200: {
            description: "Lista de alunos da turma",
            headers: {
                "Authorization": {
                    description: "Token de autenticação JWT",
                    
                }
            },
            content: {
                "application/json": {
                    schema: Schema.ResponseAlunoSchema.array()
                }
            }
        },
        404: {
            description: "Turma não encontrada",
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

// Criar um aluno
registry.registerPath({
    method: "post",
    path: "/api/v1/student/create",
    tags: ["Aluno"],

    request: {
        body: {
            content: {
                "application/json": {
                    schema: Schema.CreateAlunoSchema
                }
            }
        }
    },
    responses: {
        201: {
            description: "Aluno criado com sucesso",
            headers: {
                "Authorization": {
                    description: "Token de autenticação JWT",
                    
                }
            },
            content: {
                "application/json": {
                    schema: Schema.ResponseAlunoSchema
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
        }
    }
}
);

// pegar um aluno por id
registry.registerPath({
    method: "get",
    path: "/api/v1/student/each/{id}",
    tags: ["Aluno"],

    request: {
        params: z.object({
            id: z.string().uuid()
        })
    },
    responses: {
        200: {
            description: "Aluno encontrado",
            headers: {
                "Authorization": {
                    description: "Token de autenticação JWT",
                    
                }
            },
            content: {
                "application/json": {
                    schema: Schema.ResponseAlunoSchema
                }
            }
        },
        404: {
            description: "Aluno não encontrado",
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
        400: {
            description: "ID de aluno inválido",
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
        }
    }
}
);

// actualizar um aluno
registry.registerPath({
    method: "put",
    path: "/api/v1/student/update/{id}",
    tags: ["Aluno"],

    request: {
        params: z.object({
            id: z.string().uuid()
        }),
        body: {
            content: {
                "application/json": {
                    schema: Schema.UpdateAlunoSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "Aluno actualizado com sucesso",
            headers: {
                "Authorization": {
                    description: "Token de autenticação JWT",
                    
                }
            },
            content: {
                "application/json": {
                    schema: Schema.ResponseAlunoSchema
                }
            }
        },
        400: {
            description: "Dados inválidos ou ID de aluno inválido",
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
            description: "Aluno não encontrado",
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
        }
    }
}
);

// eliminar um aluno
registry.registerPath({
    method: "delete",
    path: "/api/v1/student/delete/{id}",
    tags: ["Aluno"],

    request: {
        params: z.object({
            id: z.string().uuid()
        })
    },
    responses: {
        200: {
            description: "Aluno eliminado com sucesso",
            headers: {
                "Authorization": {
                    description: "Token de autenticação JWT",
                    
                }
            },
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
            description: "Aluno não encontrado",
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
        400: {
            description: "ID de aluno inválido",
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
        }
    }
}
);