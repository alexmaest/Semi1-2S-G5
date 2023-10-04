const translateModel = require("../models/translateModel");

class TranslateController {
  constructor() {}

  async translate(req, res) {
    try {
      const data = req.body;
      const translator = new translateModel(data.content, data.language);
      const response = await translator.translate();
      res
        .status(200)
        .json({ message: "Succesful request", data: response.TranslatedText });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getListLanguages(req, res) {
    try {
      const data = req.body;
      const translator = new translateModel(null, null);
      const response = await translator.getListLanguages();
      res
        .status(200)
        .json({ message: "Succesful request", data: response.Languages });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = new TranslateController();
