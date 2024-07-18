const express = require("express");
const router = express.Router();
const colorController = require("../controllers/color");
const userController = require("../controllers/user");
const taskController = require("../controllers/task");
const authMiddleware = require("../middlewares/auth");

//------------ Static Routes ----------
router.get("/", (req, res) => {
  return res.send("It's a task manager API called Weekly");
});

//------------ unauthenticated routes --------
router.post("/user", userController.post);
router.get("/colors", colorController.get);

//------------ authenticated routes --------
router.use(authMiddleware.validate);

router.get("/user", userController.get);
router.put("/user", userController.put);
router.delete("/user", userController.delete);

router.post("/task", taskController.post);
router.get("/tasks", taskController.get);
router.put("/task/:id", taskController.put);
router.delete("/task/:id", taskController.delete);

module.exports = router;
