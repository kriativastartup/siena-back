import { registry } from "../../../openapi/registry";
import { z } from "zod";
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';


extendZodWithOpenApi(z);

export const LoginDTO = z.object({
    email: z.string().email('O campo "email" deve ser um email válido'),
    senha: z.string().min(6, 'O campo "password" deve conter no mínimo 6 caracteres'),
});

export type LoginDTOType = z.infer<typeof LoginDTO>;

registry.register("LoginDTO", LoginDTO);

registry.registerPath({
    method: "post",
    path: "/api/v1/auth/login",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: LoginDTO,
                },
            },
        }
    },
    responses: {
        200: {
            description: "Login bem-sucedido",
            content: {
                "application/json": {
                    schema: z.object({
                        token: z.string(),
                    }),
                },
            },
        },
        400: {
            description: "Requisição inválida",
            content: {
                "application/json": {
                    schema: z.object({
                        error: z.string(),
                    }),
                },
            },
        },
        401: {
            description: "Não autorizado",
            content: {
                "application/json": {
                    schema: z.object({
                        error: z.string(),
                    }),
                },
            },
        },
    },
})