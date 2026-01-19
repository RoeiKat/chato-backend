// controllers/sdk.controller.js
import { db } from "../config/firebase.js";
import { v4 as uuid } from "uuid";
import { now } from "../utils/time.js";

export async function getConfig(req, res) {
  const apiKey = req.apiKey;

  const snap = await db.ref(`apps/${apiKey}`).get();
  if (!snap.exists()) return res.status(404).json({ error: "App not found" });

  const app = snap.val() || {};

  res.json({
    app: { name: app.name || "" },
    prechat: {
      q1: app.prechat?.q1 ?? "",
      q2: app.prechat?.q2 ?? "",
      q3: app.prechat?.q3 ?? "",
      faqUrl: app.prechat?.faqUrl ?? ""
    },
    theme: {
      bubbleBg: app.theme?.bubbleBg ?? "",
      primary: app.theme?.primary ?? "",
      iconSvg: app.theme?.iconSvg ?? ""
    }
  });
}

export async function sendMessage(req, res) {
  const apiKey = req.apiKey;

  const { text, sessionId } = req.body || {};
  const fromRaw = (req.body?.from ?? "customer").toString().trim().toLowerCase();

  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "text is required" });
  }

  // IMPORTANT: keep frontend stable: only ever write "customer" or "owner"
  // bot -> owner
  let from = "customer";
  if (fromRaw === "owner" || fromRaw === "bot" || fromRaw === "agent" || fromRaw === "support") {
    from = "owner";
  }

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
    from,
    text: text.trim()
  });

  const unreadOwner =
    from === "customer" ? (current.unreadOwner || 0) + 1 : (current.unreadOwner || 0);

  await sessionRef.update({
    updatedAt: now(),
    lastMessage: text.trim(),
    lastMessageAt: now(),
    lastFrom: from,
    unreadOwner
  });

  res.json({ sessionId: sid });
}
