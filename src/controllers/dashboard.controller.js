// controllers/dashboard.controller.js
import { db } from "../config/firebase.js";
import { now } from "../utils/time.js";

export async function reply(req, res) {
  const { apiKey, sessionId, text } = req.body;

  await db.ref(`messages/${apiKey}/${sessionId}`).push({
    at: now(),
    from: "owner",
    text
  });

  // Mark last message metadata (and optionally clear unread)
  await db.ref(`sessions/${apiKey}/${sessionId}`).update({
    updatedAt: now(),
    lastMessage: text,
    lastMessageAt: now(),
    lastFrom: "owner",
    unreadOwner: 0
  });

  res.json({ ok: true });
}

export async function markSessionRead(req, res) {
  const { apiKey, sessionId } = req.body;

  await db.ref(`sessions/${apiKey}/${sessionId}`).update({
    unreadOwner: 0,
    ownerLastReadAt: now()
  });

  res.json({ ok: true });
}
