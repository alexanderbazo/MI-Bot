# MiBot
A simple API for slack/mettermost *Slash Commands* used by the Media Informatics Group

** Slack rendert kein Markdown. Die Antworten der Bots sind daher möglicherweise schlecht lesbar. Als Workaround könnten Bilder erstellt und als Attatchment in den Chat gesendet werden.**

## Nutzung in Slack/Mattermost

**Aktuell stehen folgende Bots zur Verfügung:**

**MensaBot**

Der MensaBot zeigt den Speiseplan der Uni-Mensa für den aktuellen Tag an. Der Bot kann in den Slack/Mattermost-Teams der Medieninformatik über das Kommando `/mensa` aufgerufen werden.

<img alt="Screenshot der Antwort des MensaBots" src="http://i.imgur.com/LBfrnEs.png" width="50%">

**Phonebot**

Der Phonebot sucht im Telefonverzeichnis der Universität Regensburg. Der Bot kann in den Slack/Mattermost-Teams der Medieninformatik über das Kommando `/phone [Name]` aufgerufen werden.

<img alt="Screenshot der Antwort des Phonebot" src="http://i.imgur.com/9VG9NVe.png" width="50%">

## Bots entwickeln
Zur Integration eigener Bots besteht eine simple API:

* Die zentrale Anwendung startet einen [express](http://expressjs.com/)-Server.
* Für jeden Bot wird eine individuelle Route angelegt. Jeder Bot verfügt über `respond`-Funktion, die bei einem Aufruf der Route zur Generierung der Server-Antwort aufgerufen wird. Mögliche Parameter werden an den Bot weitergegeben.
* Der Bot ist für die Generierung einer validen Antwort zuständig und muss den an `respond` übergebenen Callback mit einem Objekt folgender Struktur aufrufen:
```javascript
{
    contentType: "", // Content-Type der Bot-Antwort
    text: "", // Antwort des Bots im korrekten Content-Format
}
```
* Die Antwort des Bots wird an den Client zurückgegeben


In Slack/Mattermost werden die einzelnen Routen mit [Slash Commands](https://api.slack.com/slash-commands) verknüpft.

Eine Demo-Implementierung findet sich im `examples`-Ordner.




