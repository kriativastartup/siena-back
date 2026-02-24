import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi"
import { registry } from "./registry";


import "../services/auth/dto/auth.openapi"
import "../services/alunos/dto/aluno.openapi"
import "../services/escolas/dto/escola.openapi"
import "../services/funcionarios/dto/funcionario.openapi"
import "../services/matriculas/dto/matricula.openapi"
import "../services/cursos/dto/curso.openapi"
import "../services/turmas/dto/turma.openapi"
import "../services/professores/dto/professor.openapi"
import "../services/encarregado/dto/encarregado.openapi"
import "../services/ano_letivo/dto/ano_letivo.openapi"


const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDocument = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "Minha API",
    version: "1.0.0",
  },
  servers: [{ url: process.env.ENVIRONMENT === "prod" ? "https://siena.enor.tech" : "http://localhost:3000" }],
});