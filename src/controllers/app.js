const dateFNS = require("date-fns");

class appController {
  async getAddDays(req, res) {
    try {
      const { date, days } = req.query;

      const finalDate = dateFNS.addDays(new Date(date), days);

      return res.status(200).json({ result: finalDate });
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }

  async getListOfDays(req, res) {
    try {
      const { date, days } = req.query;

      if (days <= 0) {
        return res.status(400).json({ error: "Invalid days" });
      }

      const listOfDays = [];
      let dateAux = new Date(date);
      for (let i = 0; i < days; i++) {
        listOfDays.push(dateAux.toISOString().split("T")[0]);
        dateAux = dateFNS.addDays(dateAux, 1);
      }

      return res.status(200).json({ result: listOfDays });
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }
}

module.exports = new appController();
