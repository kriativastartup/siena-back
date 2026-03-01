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
                    schema: Schema.createMatriculaSchema
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


// update de matrícula
registry.registerPath({
    method: "put",
    path: "/api/v1/registration/update/{matricula_id}",
    tags: ["Matricula"],
    request: {
        params: z.object({
            matricula_id: z.string("O ID da matrícula é obrigatório").min(3, "O ID da matrícula deve ter pelo menos 3 caracteres").max(50)
        }),
        body: {
            content: {
                "application/json": {
                    schema: Schema.updateMatriculaSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "Matrícula atualizada com sucesso",
            content: {
                "application/json": {
                    schema: Schema.responseMatriculaSchema
                }
            }
        },
        400: {
            description: "Dados inválidos fornecidos",
        },
         404: {
            description: "Matrícula não encontrada",
        },
         409: {
            description: "Conflito de dados, como turma cheia ou aluno já matriculado",
        },
         422: {
            description: "Dados de atualização inválidos, como status ou turma inexistente",
         },
        500: {
            description: "Erro interno do servidor",
        }
    }
});