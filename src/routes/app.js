const express = require("express");
const router = express.Router();
const appColorsList = require("../lists/colors");

router.get("/colors", async (req, res) => {
  try {
    const colors = await appColorsList.find();

    return res.status(200).json(colors);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.post("/color", async (req, res) => {
  const color = req.body.color;

  try {
    await appColorsList.validate({
      hexColor: color,
    });
  } catch (error) {
    return res.status(400).json(error);
  }

  try {
    const newColor = await appColorsList.create({
      hexColor: color,
    });

    return res.status(200).json(newColor);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.put("/color/:id", async (req, res) => {
  const id = req.params.id;
  const newColor = req.body.color;

  if (!id) {
    return res.status(400).json({ error: "id is mandatory" });
  }

  try {
    await appColorsList.validate({
      _id: id,
      hexColor: newColor,
    });
  } catch (error) {
    return res.status(400).json(error);
  }

  const colorExists = await appColorsList.findById(id);

  if (!colorExists[0]) {
    return res.status(404).json({ error: "id not found" });
  }

  try {
    const updatedColor = await appColorsList.findByIdAndUpdate(id, {
      color: newColor,
    });

    return res.status(200).json(updatedColor);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.delete("/color/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "Id is mandatory" });
  }

  try {
    const colorExists = await appColorsList.findById(id);

    if (!colorExists[0]) {
      return res.status(404).json({ error: "id not found" });
    }
  } catch (error) {
    return res.status(400).json({ error: "id is invalid" });
  }
  try {
    const deletedColor = await appColorsList.findByIdAndDelete(id);

    return res.status(200).json(deletedColor);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

module.exports = router;
