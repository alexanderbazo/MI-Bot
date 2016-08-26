/* eslint-env node */
(function() {
  "use strict";
  var express = require("express"),
    request = require("request"),
    that = {},
    WEEKDAYS = ["so", "mo", "di", "mi", "do", "fr", "sa", ],
    MENSA_API_URL = "http://api.regensburger-forscher.de/mensa/uni/{{day}}",
    WEEKEND_MESSAGE = "https://www.youtube.com/watch?v=3trhF-09DEk",
    app;

  function onMensaDataRequested(req, res) {
    var currentDay = WEEKDAYS[new Date().getDay()];
    if (currentDay === "so" || currentDay === "sa") {
      sendIsWeekendMessage(res);
    } else {
      sendMenuMessage(res, currentDay);
    }
  }

  function sendMenuMessage(res, currentDay) {
    var menu, url = MENSA_API_URL.replace("{{day}}", currentDay);
    request(url, function(error, response, body) {
      menu = getFormatedMenu(body);
      res.send("Heute in der Mensa:\n"+menu);
    });
  }

  function getFormatedMenu(menu) {
    var index, menulist = JSON.parse(menu),result = "";
    for (index = 0; index < menulist.length; index++) {
      result += "[" + menulist[index].category + "]\t" + menulist[index].name + " (" + menulist[index].labels + ")\n";
    }
    return result;
  }

  function sendIsWeekendMessage(res) {
    res.send(WEEKEND_MESSAGE);
  }

  function run() {
    var port = parseInt(process.argv[2]);
    console.log("Starting mibot"); // eslint-disable-line no-console
    app = express();
    app.get("/slack/mensa", onMensaDataRequested);
    app.listen(port);
  }

  that.run = run;
  return that;
}().run());
