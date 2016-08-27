/* eslint-env node */

var DemoBot = function() {
  "use strict";
  this.name = "DemoBot";
};

/*
 * The `respond` function is called to retrieve the bot's response.
 * All request parameters are passed to the `respond` function.
 * The given callback must be called with an object with two properties:
 *   `contentType`: A valid Content Type that is send to the requesting client
 *   `text`: The actual response that is send to the requesting client 
 */
DemoBot.prototype.respond = function(params, callback) {
  "use strict";
  callback({
    contentType: "application/json",
    text: "{\"text\": \"I am the DemoBot\"}",
  });
};

/*
 * When required each bot module must return a valid object with at least a `respond` function	
 */
module.exports = new DemoBot();