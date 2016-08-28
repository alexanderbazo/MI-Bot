/* eslint-env node */
(function() {
  "use strict";
  var express = require("express"),
    bodyParser = require("body-parser"),
    MensaBot = require("./lib/mensabot/"),
    PhoneBot = require("./lib/phonebot/"),
    that = {},
    app;

  function handleRequestWithBot(bot, req, res) {
    var params = req.body.text || undefined;
    bot.respond(params, function(response) {
      res.header("Content-Type", response.contentType);
      res.end(response.text);
    });
  }

  function run() {
    var port = parseInt(process.argv[2]);
    console.log("Starting mibot"); // eslint-disable-line no-console
    app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true, }));
    app.get("/slack/mensa", handleRequestWithBot.bind(this, MensaBot));
    app.post("/slack/phone", handleRequestWithBot.bind(this, PhoneBot));
    app.listen(port);
  }

  that.run = run;
  return that;
}().run());
