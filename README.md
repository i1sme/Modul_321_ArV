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
