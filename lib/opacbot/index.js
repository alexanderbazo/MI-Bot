/* eslint-env node */

var request = require("request"),
    jsdom = require("jsdom"),
    jsesc = require("jsesc"),
    OPAC_URL = "https://www.regensburger-katalog.de/InfoGuideClient.ubrsis/start.do?Login=igubr",
    OPAC_DETAIL_URL_PREFIX = "https://www.regensburger-katalog.de",
    OpacBot = function() {
        "use strict";
        this.name = "OpacBot";
    };

function getFormatedMissingParameterMessage() {
    "use strict";
    var result = {
        response_type: "ephemeral",
        text: "Kein Suchparamater übergeben. Gib `/opac \"Query\"` ein um im Opac zu suchen.",
    };
    return JSON.stringify(result);
}

function getFormatedResultMessage(query, html, callback) {
    "use strict";
    var result = {
        response_type: "ephemeral",
        text: "Sucherergebnisse für: '" + query + "'\n\n",
    };
    jsdom.env(
        html,
        function(err, window) {
            let books = window.document.querySelectorAll("table.data tbody tr ");
            for (let index = 0; index < books.length; index++) {
                let book = books[index];
                let linkNode = book.querySelector("td[style='width:100%'] a[href^='/InfoGuideClient.ubrsis']");
                let link = OPAC_DETAIL_URL_PREFIX + linkNode.getAttribute("href");
                let title = linkNode.innerHTML.replace(/<[^>]*>/g, "").trim();
                result.text += index + 1 + ". '" + title + "' => <" + link + "|zum Buch>" + "\n";
            }
            window.close();
            callback(JSON.stringify(result));
        }
    );
}

function createRequestOptions(query) {
    "use strict";
    return {
        form: {
            qStr: query,
            Query: "-1=\"" + query + "\"",
            Login: "igubr",
        },
    };
}

OpacBot.prototype.respond = function(params, callback) {
    "use strict";
    var query;
    if (!params) {
        callback({
            contentType: "application/json",
            text: getFormatedMissingParameterMessage(),
        });
    } else {
        query = jsesc(params);
        query = query.split("\\x").join("%");
        request.post(OPAC_URL, createRequestOptions(query), function(error, response, body) {
            getFormatedResultMessage(query, body, function(result) {
                callback({
                    contentType: "application/json",
                    text: result,
                });
            });
        });
    };
}

module.exports = new OpacBot();
