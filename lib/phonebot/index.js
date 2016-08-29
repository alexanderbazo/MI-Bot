/* eslint-env node */

var request = require("request"),
  jsdom = require("jsdom"),
  RESULT_LIST_CELL_WIDTH = 40,
  PHONE_API_URL = "http://www-verwaltung.uni-regensburg.de/scripts/WWWProgTelefonauskunft.exe?NNAME={{query}}&Tel=Tel&Fax=Fax",
  PhoneBot = function() {
    "use strict";
    this.name = "PhoneBot";
  };

function getFormatedMissingParameterMessage() {
  "use strict";
  var result = {
    response_type: "ephemeral",
    text: "Kein Suchparamater übergeben. Gib `/phone \"Name\"` ein um nach einem Teilnehmer zu suchen",
  };
  return JSON.stringify(result);
}

function getFittingStringForResultList(string, width) {
  "use strict";
  var fittedString = string;
  if (fittedString.length >= width) {
    return fittedString.subString(0, width - 1);
  }
  for (let i = fittedString.length; i < width; i++) {
    fittedString += "";
  }
  return fittedString;
}

function getFormatedResultMessage(html, callback) {
  "use strict";
  var result = {
    response_type: "ephemeral",
    text: "*Suchergebnisse*\n\n"+getFittingStringForResultList("_Teilnehmer_", RESULT_LIST_CELL_WIDTH+2)+getFittingStringForResultList("_Rufnummer_", RESULT_LIST_CELL_WIDTH+2)+getFittingStringForResultList("_Nebenstelle_", RESULT_LIST_CELL_WIDTH+2)+"\n",
  };
  jsdom.env(
    html,
    function(err, window) {
      let rows = window.document.querySelectorAll("tr[bgcolor='#eaf3f7']"),
        row, name, phone, extension;
      for (let index = 1; index < rows.length; index++) {
        row = rows[index];
        name = row.childNodes[0].innerHTML;
        phone = row.childNodes[1].innerHTML;
        extension = row.childNodes[2].innerHTML;
        result.text += getFittingStringForResultList(name, RESULT_LIST_CELL_WIDTH) + getFittingStringForResultList(phone, RESULT_LIST_CELL_WIDTH) + getFittingStringForResultList(extension, RESULT_LIST_CELL_WIDTH) + "\n";
      }
      result.text += "\n";
      if (rows.length === 0) {
        result.text += "*Keine Teilnehmer gefunden.*";
      }
      window.close();
      callback(JSON.stringify(result));
    }
  );
}

PhoneBot.prototype.respond = function(params, callback) {
  "use strict";
  var query;
  if (!params) {
    callback({
      contentType: "application/json",
      text: getFormatedMissingParameterMessage(),
    });
  } else {
    query = params.split(" ").join("%20");
    request(PHONE_API_URL.replace("{{query}}", query), function(error, response, body) {
      getFormatedResultMessage(body, function(result) {
        callback({
          contentType: "application/json",
          text: result,
        });
      });
    });
  }
};

module.exports = new PhoneBot();
