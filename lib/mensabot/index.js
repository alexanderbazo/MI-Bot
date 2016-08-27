/* eslint-env node */

var request = require("request"),
  MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember", ],
  WEEKDAYS = ["so", "mo", "di", "mi", "do", "fr", "sa", ],
  WEEKDAYS_FULL = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", ],
  MENSA_API_URL = "http://api.regensburger-forscher.de/mensa/uni/{{day}}",
  MensaBot = function() {
    "use strict";
    this.name = "MensaBot";
  };

function getFormatedWeekendMessage() {
  "use strict";
  var result = {
    response_type: "ephemeral",
    text: "Es ist Wochende. Die Mensa hat zu. Arbeite nicht: https://www.youtube.com/watch?v=3trhF-09DEk",
  };
  return JSON.stringify(result);
}

function getFormatedMenuMessage(menu) {
  "use strict";
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

MensaBot.prototype.respond = function(params, callback) {
  "use strict";
  var currentDay = WEEKDAYS[new Date().getDay()];
  if (currentDay === "so" || currentDay === "sa") {
    callback({
      contentType: "application/json",
      text: getFormatedWeekendMessage(),
    });
  } else {
    request(MENSA_API_URL.replace("{{day}}", currentDay), function(error, response, body) {
      callback({
        contentType: "application/json",
        text: getFormatedMenuMessage(body),
      });
    });
  }
};

module.exports = new MensaBot();
