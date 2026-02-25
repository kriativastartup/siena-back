import express from "express";
import * as Controller from "../controllers/funcionario";
import { validate } from "../middleware/zod_validate";
import * as Schema from "../services/funcionarios/dto/funcionario";
import * as Authotization from "../middleware/authorized";

const router = express.Router();

router.post("/add", validate(Schema.CreateFuncionarioSchema), Controller.createFuncionario);
router.get("/all/:escola_id", Authotization.verifyAuthenticationAdminSchool, Controller.getFuncionariosByEscola);
router.get("/each/:funcionario_id", Authotization.verifyAuthenticationAdminSchool, Controller.getFuncionarioById);
router.get("/me", Authotization.verifyAuthentication, Controller.getMeFuncionario);
router.put("/update", Authotization.verifyAuthenticationAdminSchool, Controller.updateFuncionario);

export default router;