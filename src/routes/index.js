const express = require("express");
const router = express.Router();
const colorController = require("../controllers/color");
const userController = require("../controllers/user");
const sessionController = require("../controllers/session");
const taskController = require("../controllers/task");
const categoryController = require("../controllers/category");
const authMiddleware = require("../middlewares/auth");

//------------ Static Routes ----------
router.get("/", (req, res) => {
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

router.get("/user", userController.get);
router.put("/user", userController.put);
router.delete("/user", userController.delete);

router.post("/category", categoryController.post);
router.get("/categories", categoryController.get);
router.put("/category/:id", categoryController.put);
router.delete("/category/:id", categoryController.delete);

router.post("/task", taskController.post);
router.get("/tasks", taskController.get);
router.put("/task/:id", taskController.put);
router.delete("/task/:id", taskController.delete);

module.exports = router;
