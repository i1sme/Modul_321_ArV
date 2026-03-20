# Modul_321_ArV
# Chat App — Verteiltes System

Ein verteiltes Echtzeit-Chat-System. 
Besteht aus drei Komponenten: **Frontend**, **Backend/API** und **Datenbank** — alle als Docker-Container.

---

## Systemarchitektur

```
Browser (Client)
      │
      │  HTTP + WebSocket (Socket.io)
      ▼
Backend / API  ──────────────────────  MySQL 8
(Node.js + Express)                  (Datenbank)
Port 3000                            Port 3306
      │
      │  Port 8080
      ▼
Frontend (nginx)
```

Mehrere Clients verbinden sich gleichzeitig mit dem Backend. Nachrichten werden in Echtzeit an alle Teilnehmer im selben Raum verteilt und in der Datenbank gespeichert.

---
## Technologien

| Komponente | Technologie |
|------------|-------------|
| Frontend   | HTML / CSS / JavaScript |
| Backend    | Node.js, Express, Socket.io |
| Datenbank  | MySQL 8.0 |
| Container  | Docker, Docker Compose |
| Webserver  | nginx (Frontend-Serving) |

---

## Voraussetzungen

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installiert
- Git installiert

---

## Installation & Start

```bash
# 1. Repository klonen
git clone https://github.com/i1sme/Modul_321_ArV.git
cd Modul_321_ArV

# 2. Umgebungsvariablen einrichten
cp .env.muster .env
# Optional: Passwörter in .env anpassen

# 3. Alle Container starten
docker compose up -d
```

Danach unter **http://localhost:8080** im Browser öffnen.

---

## Verwendung

1. Benutzernamen eingeben und auf **Use** klicken
2. Einen Raum in der linken Sidebar auswählen
3. Nachrichten schreiben und mit **Enter** oder **Send** abschicken
4. Aktive Teilnehmer sind in der Sidebar unter **Online** sichtbar

> Zum Testen der Echtzeit-Funktion: zwei Browser-Tabs öffnen, verschiedene Namen wählen, gleichen Raum beitreten.

---

## Projektstruktur
 
```
chat-app/
├── docker-compose.yml       # Startet alle Services
├── .env                     # Vorlage für Umgebungsvariablen
├── db/
│   └── init.sql             # Datenbankschema (wird automatisch ausgeführt)
├── backend/
│   ├── index.js             # Express + Socket.io Server
│   ├── db.js                # Datenbankanbindung (mysql2)
│   ├── package.json
│   └── Dockerfile
└── frontend/
    ├── index.html           # Chat-Oberfläche (Single Page)
    ├── nginx.conf
    └── Dockerfile
```
 
---
 
## Nützliche Befehle
 
```bash
# Status aller Container anzeigen
docker compose ps
 
# Logs anzeigen
docker compose logs -f backend
 
# Alle Container stoppen
docker compose down
 
# Container neu starten (nach Code-Änderungen)
docker compose up --build -d
```

## Dokumentation
 

`testprotokoll.docx` - Blackbox-Testfälle und Ergebnisse

`ausfallsicherheit.docx` - Ausfallanalyse aller Systemkomponenten 
 
---

## Autor
 
Arsenii Voloshyn
