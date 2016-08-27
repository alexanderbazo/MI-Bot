# MiBot
A simple API for s slack/mettermost *Slash Commands* used by the Media Informatics Group

## Nutzung in Slack/Mattermost

**Aktuell stehen folgende Bots zur Verfügung:**

**MensaBot**
Der MensaBot zeigt den Speiseplan der Uni-Mensa für den aktuellen Tag an. Der Bot kann in den Slack/Mattermost-Teams der Medieninformatik über das Kommando `/mensa` aufgerufen werden.
![Screenshot der Antwort des MensaBots](http://i.imgur.com/LBfrnEs.png)

## Bots entwickeln
Zur Integration eigener Bots besteht eine simpe API:

* Die zentrale Anwendung startet einen [express](http://expressjs.com/)-Server.
* Für jeden Bot wird eine individuelle Route angelegt. Jeder Bot verfügt über `respond`-Funktion, die bei einem Aufruf der Route zur Generierung der Server-Anwort aufgerufen wird. Mögliche Parameter werden an den Bot weitergegeben.
* Der Bot ist für die Generierung einer validen Antwort zuständig und muss den an `respond` übergebenen Callback mit einem Objekt folgender Struktur aufrufen:
```javascript
{
    contentType: "", // Content-Type der Bot-Antwort
    text: "", // Antwort des Bots im korreten Content-Format
}
```
* Die Antwort des Bots wird an den Client zurückgegeben


In Slack/Mattermost werden die einzelnen Routen mit [Slash Commands](https://api.slack.com/slash-commands) verknüpft.

Eine Demo-Implementierung findet sich im `examples`-Ordner.




