import { registry } from "../../../openapi/registry";
import { z } from "zod";
import * as Schema from "./professor.dto";

const BASE = "/api/v1/teacher";

registry.register("Professor", Schema.ResponseProfessorSchema);

// Criar um professor
registry.registerPath({
    method: "post",
    path: `${BASE}/create`,
    tags: ["Professor"],

    request: {
        body: {
            content: {
                "application/json": {
                    schema: Schema.CreateProfessorSchema
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
            description: "Professor criado com sucesso",
            content: {
                "application/json": {
                    schema: Schema.ResponseProfessorSchema
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

// Listar professores por escola
registry.registerPath({
    method: "get",
    path: `${BASE}/all/{escola_id}`,
    tags: ["Professor"],
    request: {
        params: z.object({
            escola_id: z.string("O ID da escola é obrigatório").min(3, "O ID da escola deve ter pelo menos 3 caracteres").max(50)
        })
    },
    responses: {
        200: {
            description: "Professores listados com sucesso",
            content: {
                "application/json": {
                    schema: z.array(Schema.ResponseProfessorSchema)
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

// Listar professor por ID
registry.registerPath({
    method: "get",
    path: `${BASE}/get/{professor_id}`,
    tags: ["Professor"],
    request: {
        params: z.object({
            professor_id: z.string("O ID do professor é obrigatório").min(3, "O ID do professor deve ter pelo menos 3 caracteres").max(50)
        })
    },
    responses: {
        200: {
            description: "Professor listado com sucesso",
            content: {
                "application/json": {
                    schema: Schema.ResponseProfessorSchema
                }
            }
        },
        400: {
            description: "ID do professor inválido",
        },
        404: {
            description: "Professor não encontrado",
        },
        500: {
            description: "Erro interno do servidor",
        }
    }
});

registry.registerPath({
    method: "get",
    path: `${BASE}/me`,
    tags: ["Professor"],
    responses: {
        200: {
            description: "Professor listado com sucesso",
            headers: {
                "Authorization": {
                    description: "Bearer Token de autenticação JWT",
                }
            },
            content: {
                "application/json": {
                    schema: Schema.ResponseProfessorSchema
                }
            }
        },
        404: {
            description: "Professor não encontrado",
        },
        500: {
            description: "Erro interno do servidor",
        }
    }
});

// Atualizar um professor
registry.registerPath({
    method: "put",
    path: `${BASE}/update`,
    tags: ["Professor"],

    request: {
        params: z.object({
            professor_id: z.string().uuid()
        }),
        body: {
            content: {
                "application/json": {
                    schema: Schema.UpdateProfessorSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "Professor actualizado com sucesso",
            content: {
                "application/json": {
                    schema: Schema.ResponseProfessorSchema
                }
            }
        },
        404: {
            description: "Professor não encontrado",
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

// Adicionar disciplina a um professor
registry.registerPath({
    method: "post",
    path: `${BASE}/discipline/add`,
    tags: ["Professor"],

    request: {
        body: {
            content: {
                "application/json": {
                    schema: Schema.CreateDisciplinaProfessorSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "Disciplina adicionada ao professor com sucesso",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string()
                    })
                }
            }
        },
        400: {
            description: "Dados inválidos fornecidos",
        },
        403: {
            description: "Permissão negada para adicionar disciplina a este professor",
        },
        500: {
            description: "Erro interno do servidor",
        }
    }
});

// remover disciplina de um professor
registry.registerPath({
    method: "post",
    path: `${BASE}/discipline/remove`,
    tags: ["Professor"],

    request: {
        body: {
            content: {
                "application/json": {
                    schema: Schema.CreateDisciplinaProfessorSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "Disciplina removida do professor com sucesso",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string()
                    })
                }
            }
        },
        400: {
            description: "Dados inválidos fornecidos",
        },
        403: {
            description: "Permissão negada para remover disciplina deste professor",
        },
        500: {
            description: "Erro interno do servidor",
                content: {
                    "application/json": {
                        schema: z.object({
                            message: z.string()
                        })
                    }
                }
        }
    }
});