import { db } from "../config/firebase.js";
import { now } from "../utils/time.js";

export async function reply(req, res) {
  const { apiKey, sessionId, text } = req.body;

  await db.ref(`messages/${apiKey}/${sessionId}`).push({
    at: now(),
    from: "owner",
    text
  });

  res.json({ ok: true });
}
