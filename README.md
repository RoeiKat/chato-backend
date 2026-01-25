# Chato

Chato is a lightweight customer messaging backend designed to be embedded into mobile applications via an SDK, with a web dashboard for app owners to manage conversations in real time.

The system automatically creates customer sessions, stores message history, and allows app owners to reply to users from a dashboard with live updates.

---

## What Chato Does

Chato provides:

- Owner authentication (dashboard users)
- App creation with unique API keys
- An SDK-facing messaging API for mobile apps
- Automatic session creation per customer
- A dashboard API for viewing sessions and replying to users
- Realtime messaging powered by Firebase Realtime Database
- SDK configuration delivery (branding, colors, titles, behavior)

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
6. Messages are written to Firebase Realtime Database
7. The owner views sessions and replies from the dashboard in real time

---

## Authentication Model

Chato uses two authentication mechanisms:

### Dashboard (Owner)

- JSON Web Tokens (JWT)
- Sent using the `Authorization: Bearer <jwt>` header

### SDK (Mobile App)

- API key–based authentication
- Sent using the `x-api-key` header
- Each API key maps to a single owner app

---

## Realtime Architecture

Chato uses **Firebase Realtime Database as a shared realtime layer** between:

- The Android SDK (customer-side)
- The Web Dashboard (owner-side)

The Node.js backend is responsible for:

- Authentication and authorization
- API key validation
- App and session management
- Controlled dashboard access

Live message delivery and updates are handled via Firebase subscriptions on both clients.

---

## Project Structure (Conceptual)

The backend is organized around the following core entities:

- **Owners** – dashboard users
- **Apps** – created by owners, identified by an API key
- **Sessions** – auto-created customer conversations
- **Messages** – append-only chat messages per session

Sessions store metadata (timestamps, last message, unread state), while messages are stored as an append-only log in the realtime database.

---

## API Documentation

This repository includes a full, styled HTML API reference covering:

- Authentication
- App creation and management
- SDK messaging
- Dashboard session handling
- SDK configuration endpoints
- Request / response examples

📄 **API Docs:**  
See `doc.html` (open it in a browser) for the complete API specification.

> This README intentionally does not duplicate endpoint-level documentation.

---

## Intended Usage

- Backend service for an Android chat SDK
- Owner-facing web dashboard
- Shared realtime messaging layer using Firebase Realtime Database

---

## Non-Goals

Chato is not intended to be:

- A full CRM system
- A chatbot platform
- A public multi-tenant messaging service

It is designed to be a lightweight, embeddable messaging and support backend for mobile applications.
