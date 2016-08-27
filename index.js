/* eslint-env node */
(function() {
  "use strict";
  var express = require("express"),
    MensaBot = require("./lib/mensabot/"),
    that = {},
    app;

  function handleRequestWithBot(bot, req, res) {
    bot.respond(req.params, function(response){
      res.header("Content-Type", response.contentType);
      res.end(response.text);
    });
  }

  function run() {
    var port = parseInt(process.argv[2]);
    console.log("Starting mibot"); // eslint-disable-line no-console
    app = express();
    app.get("/slack/mensa", handleRequestWithBot.bind(this, MensaBot));
    app.listen(port);
  }

  that.run = run;
  return that;
}().run());
