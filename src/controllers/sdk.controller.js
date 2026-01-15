import { db } from "../config/firebase.js";
import { v4 as uuid } from "uuid";
import { now } from "../utils/time.js";

export async function sendMessage(req, res) {
  const { text, sessionId } = req.body;
  const apiKey = req.apiKey;
  const sid = sessionId || uuid();

  const sessionRef = db.ref(`sessions/${apiKey}/${sid}`);
  const exists = (await sessionRef.get()).exists();

  if (!exists) {
    await sessionRef.set({
      createdAt: now(),
      updatedAt: now(),
      status: "open"
    });
  }

  await db.ref(`messages/${apiKey}/${sid}`).push({
    at: now(),
    from: "customer",
    text
  });

  await sessionRef.update({
    updatedAt: now(),
    lastMessage: text
  });

  res.json({ sessionId: sid });
}
