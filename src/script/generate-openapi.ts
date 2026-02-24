import { openApiDocument } from "../openapi/document";
import fs from "fs";

fs.writeFileSync(
  "./openapi.json",
  JSON.stringify(openApiDocument, null, 2)
);

console.log("OpenAPI gerado com sucesso!");