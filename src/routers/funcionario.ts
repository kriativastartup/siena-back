import express from "express";
import * as Controller from "../controllers/funcionario";
import { validate } from "../middleware/zod_validate";
import * as Schema from "../services/funcionarios/dto/funcionario";
import * as Authotization from "../middleware/authorized";

const router = express.Router();

router.post("/add", validate(Schema.CreateFuncionarioSchema), Controller.createFuncionario);
router.get("/all/:escola_id", Authotization.verifyAuthenticationSuperAdmin, Controller.getFuncionariosByEscola);
router.get("/each/:funcionario_id", Controller.getFuncionarioById);
router.put("/update/:funcionario_id", Controller.updateFuncionario);

export default router;