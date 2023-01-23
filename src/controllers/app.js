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
}

module.exports = new appController();
