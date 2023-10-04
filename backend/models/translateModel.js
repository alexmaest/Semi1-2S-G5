const db = require("../database");
const {
  TranslateClient,
  TranslateTextCommand,
  ListLanguagesCommand,
} = require("@aws-sdk/client-translate");

const config = {
  region: process.env.AWS_REGION_ACCESS_KEY,
  credentials: {
    accessKeyId: process.env.AWS_PUBLIC_TRANSLATE_KEY,
    secretAccessKey: process.env.AWS_SECRET_TRANSLATE_KEY,
  },
};

const translate = new TranslateClient(config);

class translateModel {
  constructor(content, language) {
    this.content = content;
    this.language = language;
  }

  translate() {
    return new Promise((resolve, reject) => {
      const params = {
        Text: this.content,
        SourceLanguageCode: "auto",
        TargetLanguageCode: this.language,
      };

      translate
        .send(new TranslateTextCommand(params))
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getListLanguages() {
    return new Promise((resolve, reject) => {
      translate
        .send(new ListLanguagesCommand())
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = translateModel;
