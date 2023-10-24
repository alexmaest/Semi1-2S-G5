const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_LEX,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_LEX,
  region: process.env.AWS_REGION_LEX,
});

const lexruntimev2 = new AWS.LexRuntimeV2();

class ChatBotModel {
  constructor(unique_id, message) {
    this.unique_id = unique_id;
    this.message = message;
  }

  singleMessage(callback) {
    const params = {
      botId: process.env.AWS_BOT_ID,
      botAliasId: process.env.AWS_BOT_ALIAS_ID,
      localeId: 'es_419',
      sessionId: this.unique_id,
      text: this.message,
    };

    lexruntimev2.recognizeText(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        callback(err, null);
      } else {
        const message = data.messages[0].content;
        callback(null, message);
      }
    });
  }
}

module.exports = ChatBotModel;
