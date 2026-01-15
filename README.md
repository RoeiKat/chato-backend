# Chato

Chato is a lightweight customer messaging backend designed to be embedded into mobile applications via an SDK, with a web dashboard for app owners to manage conversations.

The system automatically creates customer sessions, stores message history, and allows app owners to reply to users from a dashboard in real time.

---

## What Chato Does

Chato provides:

- Owner authentication (dashboard users)
- App creation with unique API keys
- An SDK-facing messaging API for mobile apps
- Automatic session creation per customer
- A dashboard API for viewing sessions and replying to users
- Realtime database-backed message storage

This makes Chato suitable for:
- In-app support chat
- Customer communication tools
- Early-stage messaging platforms
- SDK-based integrations (Android only)

---

## High-Level Flow

1. An **owner** registers and logs in to the dashboard
2. The owner creates an **app** and receives an `apiKey`
3. The `apiKey` is embedded into a **mobile app / SDK**
4. A customer sends a message from the app
5. If no session exists, Chato **automatically creates one**
6. Messages are stored and linked to the app + session
7. The owner views sessions and replies from the dashboard

---

## Authentication Model

Chato uses two authentication mechanisms:

### Dashboard (Owner)
- JSON Web Tokens (JWT)
- Sent using the `Authorization: Bearer <jwt>` header

### SDK (Mobile App)
- API Key–based authentication
- Sent using the `x-api-key` header
- Each API key maps to a single owner app

---

## Project Structure (Conceptual)

The backend is organized around the following core entities:

- **Owners** – dashboard users
- **Apps** – created by owners, identified by an API key
- **Sessions** – auto-created customer conversations
- **Messages** – append-only chat messages per session


Sessions store metadata (timestamps, last message, etc.), while messages are stored as an append-only log.

---

## API Documentation

This repository includes a full, styled HTML API reference covering:

- Authentication
- App creation
- SDK messaging
- Dashboard messaging
- Request / response examples

📄 **API Docs:**  
See `doc.html` (open it in a browser) for the complete API specification.

> This README intentionally does not duplicate endpoint-level documentation.

---

## Intended Usage

- Backend service for an Android SDK
- Owner-facing dashboard
- Realtime messaging powered by a database with Firebase RealTime DB

---
