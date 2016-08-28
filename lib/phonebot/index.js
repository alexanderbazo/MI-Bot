/* eslint-env node */

var request = require("request"),
  PHONE_API_URL = "http://www-verwaltung.uni-regensburg.de/scripts/WWWProgTelefonauskunft.exe?NNAME={{query}}&Tel=Tel&Fax=Fax",
  PhoneBot = function() {
    "use strict";
    this.name = "PhoneBot";
  };

PhoneBot.prototype.respond = function(params, callback) {
  "use strict";
  console.log(params);
  callback({
    contentType: "application/json",
    text: "I am PhoneBot",
  });
};

module.exports = new PhoneBot();
