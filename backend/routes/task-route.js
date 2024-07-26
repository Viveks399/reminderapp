import express from "express";
import {
  createTask,
  returnTask,
  deleteTask,
  updateTask,
  deleteCompletedTask,
  mailOptionSwitch
} from "../controller/task-controller.js";

const router = express.Router();
router.post("/createTask", createTask);
router.get("/returnTask", returnTask);
router.delete("/deleteTask/:id", deleteTask);
router.put("/updateTask/:id", updateTask);
router.delete("/deleteCompletedTask/:id", deleteCompletedTask);
router.put("/mailOptionSwitch/:id", mailOptionSwitch);

export default router;
