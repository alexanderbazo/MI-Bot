/* eslint-env node */
(function() {
    "use strict";
    var express = require("express"),
        request = require("request"),
        bodyParser = require("body-parser"),
        MensaBot = require("./lib/mensabot/"),
        PhoneBot = require("./lib/phonebot/"),
        OpacBot = require("./lib/opacbot/"),
        INTERMEDIATE_RESPONSE = {
            response_type: "ephemeral",
            text: "Einen Augenblick bitte. Die Antwort wird erstellt.",
        },
        that = {},
        app;


    function sendIntermediateMessage(res) {
        res.header("Content-Type", "application/json");
        res.end(JSON.stringify(INTERMEDIATE_RESPONSE));
    }

    function sendResponseMessage(url, response) {
      console.log(url);
      console.log(response);
        var options = {
            url: url,
            contentType: response.contentType,
            body: response.contentType,
            method: 'post'
        };

        request(options, function(error, response, body) {
            //console.log(error, response, body);
        });
    }

    function handleRequestWithBot(bot, req, res) {
        var params = req.body.text || undefined,
            responseUrl = req.param("response_url");
        sendIntermediateMessage(res);
        bot.respond(params, function(response) {
          sendResponseMessage(responseUrl, response);
          //res.header("Content-Type", response.contentType);
          //res.end(response.text);
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
        app.post("/slack/opac", handleRequestWithBot.bind(this, OpacBot));
        app.listen(port);
    }

    that.run = run;
    return that;
}().run());
