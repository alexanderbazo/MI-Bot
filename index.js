/* eslint-env node */
(function() {
  "use strict";
  var express = require("express"),
    request = require("request"),
    that = {},
    MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember", ],
    WEEKDAYS = ["so", "mo", "di", "mi", "do", "fr", "sa", ],
    WEEKDAYS_FULL = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", ],
    MENSA_API_URL = "http://api.regensburger-forscher.de/mensa/uni/{{day}}",
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
      res.header("Content-Type", "application/json");
      res.end(menu);
    });
  }

  function getFormatedMenu(menu) {
    var index, menulist = JSON.parse(menu),
      date = new Date(),
      dateString = WEEKDAYS_FULL[date.getDay()] + ", den " + date.getUTCDate() + ". " + MONTHS[date.getUTCMonth()],
      result = {
        response_type: "ephemeral",
        text: "---\n#### Speiseplan der Uni-Mensa für " + dateString + "\n| Kategorie     | Gericht     | Labels |\n|:--------------|:------------|:-------\n",
      };
    for (index = 0; index < menulist.length; index++) {
      result.text += "| " + menulist[index].category + " | " + menulist[index].name + " | " + menulist[index].labels + " |\n";
    }
    result.text += "---";
    return JSON.stringify(result);
  }

  function sendIsWeekendMessage(res) {
    var result = {
      response_type: "ephemeral",
      text: "Es ist Wochende. Die Mensa hat zu. Arbeite nicht: https://www.youtube.com/watch?v=3trhF-09DEk",
    };
    res.header("Content-Type", "application/json");
    res.end(JSON.stringify(result));
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
