const appColorsList = require("../models/colors");
const validation = require("../libs/validation");

class colorController {
  async get(req, res) {
    try {
      const colors = await appColorsList.find();

      return res.status(200).json(colors);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }

  async post(req, res) {
    try {
      const color = req.body.color;

      if (!color || !validation.validateHexColor(color)) {
        return res.status(400).json({ error: "Invalid hex color" });
      }

      const newColor = await appColorsList.create({
        hexColor: color,
      });

      return res.status(201).json(newColor);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }

  async put(req, res) {
    try {
      const id = req.params.id;
      const newColor = req.body.color;

      if (!validation.validateIdObject(id)) {
        return res.status(400).json({ error: "Invalid id" });
      }

      if (!newColor || !validation.validateHexColor(newColor)) {
        return res.status(400).json({ error: "Invalid hex color" });
      }

      const colorExists = await appColorsList.findById(id);

      if (!colorExists) {
        return res.status(404).json({ error: "Id not found" });
      }

      const updatedColor = await appColorsList.findByIdAndUpdate(
        id,
        {
          hexColor: newColor,
        },
        {
          new: true,
        }
      );

      return res.status(200).json(updatedColor);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;

      if (!validation.validateIdObject(id)) {
        return res.status(400).json({ error: "Invalid id" });
      }

      const colorExists = await appColorsList.findById(id);

      if (!colorExists) {
        return res.status(404).json({ error: "Id not found" });
      }

      const deletedColor = await appColorsList.findByIdAndDelete(id);

      return res.status(200).json(deletedColor);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }
}

module.exports = new colorController();
