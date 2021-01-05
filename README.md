# Einzelprojekt im Modul 133 - Webshop #
Im Modul 133 mussten wir in einem Einzelprojekt einen Webshop mit Deno und TypeScript erstellen.
Nachfolgend sind die Befehle aufgelistet, mit denen man den Server starten kann.

## Applikations-Start ##
Sie können die Applikation unter Ubuntu durch Ausführen des Start-Scripts starten:
`./start.sh`

Alternativ können Sie die beiden Zeilen des Scripts auch manuell ausführen:

`deno run --allow-read --allow-write --unstable ./tools/builder.ts` (transpiliert und bundled die Frontend-JavaScript-Datei).

`deno run --allow-net --allow-read ./src/webserver.ts`  (startet den Webserver)

## Applikation aufrufen ##
Nachdem die Applikation gestart wurde, können Sie diese unter `http://localhost:8000` aufrufen