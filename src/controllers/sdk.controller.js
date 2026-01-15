// controllers/sdk.controller.js
import { db } from "../config/firebase.js";
import { v4 as uuid } from "uuid";
import { now } from "../utils/time.js";

export async function sendMessage(req, res) {
  const { text, sessionId } = req.body;
  const apiKey = req.apiKey;
  const sid = sessionId || uuid();

  const sessionRef = db.ref(`sessions/${apiKey}/${sid}`);
  const snap = await sessionRef.get();
  const exists = snap.exists();
  const current = snap.val() || {};

  if (!exists) {
    await sessionRef.set({
      createdAt: now(),
      updatedAt: now(),
      status: "open",
      unreadOwner: 0
    });
  }

  await db.ref(`messages/${apiKey}/${sid}`).push({
    at: now(),
    from: "customer",
    text
  });

  await sessionRef.update({
    updatedAt: now(),
    lastMessage: text,
    lastMessageAt: now(),
    lastFrom: "customer",
    unreadOwner: (current.unreadOwner || 0) + 1
  });

  res.json({ sessionId: sid });
}
