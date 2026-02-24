import {registry} from "../../../openapi/registry";
import {z} from "zod";
import * as Schema from "./funcionario";

registry.register("Funcionario", Schema.ResponseFuncionarioSchema);

// Criar um funcionário
registry.registerPath({
    method: "post",
    path: "/funcionarios/add",
    tags: ["Funcionario"],

    request: {
        body: {
            content: {
                "application/json": {
                    schema: Schema.CreateFuncionarioSchema
                }
            }
        }
    },
    responses: {
        201: {
            description: "Funcionário criado com sucesso",
            content: {
                "application/json": {
                    schema: Schema.ResponseFuncionarioSchema
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

// Listar funcionários por escola
registry.registerPath({
    method: "get",
    path: "/funcionarios/all/{escola_id}",  
    tags: ["Funcionario"],
    request: {
        params: z.object({
            escola_id: z.string("O ID da escola é obrigatório").min(3, "O ID da escola deve ter pelo menos 3 caracteres").max(50)
        })
    },
    responses: {
        200: {
            description: "Funcionários listados com sucesso",
            content: {
                "application/json": {
                    schema: z.array(Schema.ResponseFuncionarioSchema)
                }
            }
        },
        400: {
            description: "ID da escola inválido",
        },
        404: {
            description: "Escola não encontrada",
        },
        500: {
            description: "Erro interno do servidor",
        }
    }
});

// Pegar um funcionário por ID
registry.registerPath({
    method: "get",
    path: "/funcionarios/each/{funcionario_id}",
    tags: ["Funcionario"],
    request: {
        params: z.object({
            funcionario_id: z.string("O ID do funcionário é obrigatório").min(3, "O ID do funcionário deve ter pelo menos 3 caracteres").max(50)
        })
    },
    responses: {
        200: {
            description: "Funcionário encontrado com sucesso",
            content: {
                "application/json": {
                    schema: Schema.ResponseFuncionarioSchema
                }
            }
        },
        400: {
            description: "ID do funcionário inválido",
        },
        404: {
            description: "Funcionário não encontrado",
        },
        500: {
            description: "Erro interno do servidor",
        }
    }
});

// Eliminar um funcionário
registry.registerPath({
    method: "delete",
    path: "/funcionarios/delete/{funcionario_id}",
    tags: ["Funcionario"],
    request: {
        params: z.object({
            funcionario_id: z.string("O ID do funcionário é obrigatório").min(3, "O ID do funcionário deve ter pelo menos 3 caracteres").max(50)
        })
    },
    responses: {
        200: {
            description: "Funcionário eliminado com sucesso",
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
            description: "ID do funcionário inválido",
        },
        404: {
            description: "Funcionário não encontrado",
        },
        500: {
            description: "Erro interno do servidor",
        }
    }
});

// Atualizar um funcionário
registry.registerPath({
    method: "put",
    path: "/funcionarios/update/{funcionario_id}",
    tags: ["Funcionario"],
    
    request: {
        params: z.object({
            funcionario_id: z.string("O ID do funcionário é obrigatório").min(3, "O ID do funcionário deve ter pelo menos 3 caracteres").max(50)
        }),
        body: {
            content: {
                "application/json": {
                    schema: Schema.UpdateFuncionarioSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "Funcionário atualizado com sucesso",
            content: {
                "application/json": {
                    schema: Schema.ResponseFuncionarioSchema
                }
            }
        },
        400: {
            description: "Dados inválidos fornecidos",
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
            description: "Funcionário não encontrado",
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