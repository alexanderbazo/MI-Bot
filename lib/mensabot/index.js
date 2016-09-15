/* eslint-env node */

var request = require("request"),
    CELL_WIDTH_FOR_CATEGORIES = 10,
    CELL_WIDTH_FOR_MEAL = 45,
    CELL_WIDTH_FOR_LABELS = 10,
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

function getFittingStringForResultList(string, width) {
    "use strict";
    var fittedString = string;
    if (fittedString.length >= width) {
        return fittedString.substring(0, width - 1);
    }
    for (let i = fittedString.length; i < width; i++) {
        fittedString += " ";
    }
    return fittedString;
}

function getFormatedMenuMessage(menu) {
    "use strict";
    var index, menulist = JSON.parse(menu),
        date = new Date(),
        dateString = WEEKDAYS_FULL[date.getDay()] + ", den " + date.getUTCDate() + ". " + MONTHS[date.getUTCMonth()],
        result = {
            response_type: "ephemeral",
            text: "*Speiseplan der Uni-Mensa für " + dateString + "*\n```\n" + getFittingStringForResultList("Kategorie", CELL_WIDTH_FOR_CATEGORIES) + getFittingStringForResultList("Gericht", CELL_WIDTH_FOR_MEAL) + getFittingStringForResultList("Labels", CELL_WIDTH_FOR_LABELS) + "\n",
        };
    for (index = 0; index < menulist.length; index++) {
        result.text += getFittingStringForResultList(menulist[index].category, CELL_WIDTH_FOR_CATEGORIES) + getFittingStringForResultList(menulist[index].name, CELL_WIDTH_FOR_MEAL) + getFittingStringForResultList(menulist[index].labels, CELL_WIDTH_FOR_LABELS) + "\n";
    }
    result.text += "```\n";
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
