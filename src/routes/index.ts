import { colorController } from "../controllers/color";
import { userController } from "../controllers/user";
import { sessionController } from "../controllers/session";
import { categoryController } from "../controllers/category";
import { taskController } from "../controllers/task";
import { authMiddleware, AuthRequest } from "../middlewares/auth";

import { Router, type Request, type Response } from "express";

const router = Router();

//------------ Static Routes ----------
router.get("/", (req: Request, res: Response) => {
  return res.send("It's a task manager API called Weekly");
});

//------------ unauthenticated routes --------
router.post("/user", userController.post);
router.post("/login", sessionController.login);
router.post("/forgot-password", sessionController.forgotPassword);
router.post("/reset-password", sessionController.resetPassword);

router.get("/colors", colorController.get);

//------------ authenticated routes --------
router.use(authMiddleware);

router.get("/user", (req, res) => userController.get(req as AuthRequest, res));
router.post("/user", (req, res) =>
  userController.post(req as AuthRequest, res)
);
router.put("/user", (req, res) => userController.put(req as AuthRequest, res));
router.delete("/user", (req, res) =>
  userController.delete(req as AuthRequest, res)
);

router.post("/category", (req, res) =>
  categoryController.post(req as AuthRequest, res)
);
router.get("/categories", (req, res) =>
  categoryController.get(req as AuthRequest, res)
);
router.put("/category/:id", (req, res) =>
  categoryController.put(req as unknown as AuthRequest, res)
);
router.delete("/category/:id", (req, res) =>
  categoryController.delete(req as unknown as AuthRequest, res)
);

router.post("/task", (req, res) =>
  taskController.post(req as AuthRequest, res)
);
router.get("/tasks", (req, res) => taskController.get(req as AuthRequest, res));
router.put("/task/:id", (req, res) =>
  taskController.put(req as unknown as AuthRequest, res)
);
router.delete("/task/:id", (req, res) =>
  taskController.delete(req as unknown as AuthRequest, res)
);

export const routes = router;
