// controllers/dashboard.controller.js
import { db } from "../config/firebase.js";
import { now } from "../utils/time.js";

export async function reply(req, res) {
  const { apiKey, sessionId, text } = req.body;

  await db.ref(`messages/${apiKey}/${sessionId}`).push({
    at: now(),
    from: "owner",
    text,
  });

  await db.ref(`sessions/${apiKey}/${sessionId}`).update({
    updatedAt: now(),
    lastMessage: text,
    lastMessageAt: now(),
    lastFrom: "owner",
    unreadOwner: 0,
  });

  res.json({ ok: true });
}

export async function markSessionRead(req, res) {
  const { apiKey, sessionId } = req.body;

  await db.ref(`sessions/${apiKey}/${sessionId}`).update({
    unreadOwner: 0,
    ownerLastReadAt: now(),
  });

  res.json({ ok: true });
}

function clampWeekStartMs(ms) {
  const n = Number(ms);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export async function createShift(req, res) {
  const ownerId = req.user.userId;

  const startedAt = Number(req.body.startedAt);
  const endedAt = Number(req.body.endedAt);
  const durationMs = Number(req.body.durationMs);

  if (!Number.isFinite(startedAt) || !Number.isFinite(endedAt) || !Number.isFinite(durationMs)) {
    return res.status(400).json({ error: "Invalid shift payload" });
  }

  if (endedAt <= startedAt || durationMs <= 0) {
    return res.status(400).json({ error: "Shift times are invalid" });
  }

  const ref = db.ref(`owners/${ownerId}/shifts`).push();
  const shiftId = ref.key;

  const payload = {
    id: shiftId,
    startedAt,
    endedAt,
    durationMs,
    createdAt: now(),
  };

  await ref.set(payload);
  return res.status(201).json({ shift: payload });
}

export async function listShifts(req, res) {
  const ownerId = req.user.userId;

  const weekStart = clampWeekStartMs(req.query.weekStart);
  const weekStartMs = weekStart || (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d.getTime();
  })();

  const weekEndMs = weekStartMs + 7 * 24 * 60 * 60 * 1000;

  const snap = await db.ref(`owners/${ownerId}/shifts`).get();
  const all = snap.val() || {};

  const shifts = Object.values(all)
    .filter((s) => {
      const st = Number(s?.startedAt || 0);
      return st >= weekStartMs && st < weekEndMs;
    })
    .sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0));

  return res.json({ weekStart: weekStartMs, shifts });
}

export async function listReminders(req, res) {
  const ownerId = req.user.userId;
  const snap = await db.ref(`owners/${ownerId}/reminders`).get();
  const all = snap.val() || {};
  const reminders = Object.values(all).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  return res.json({ reminders });
}

export async function createReminder(req, res) {
  const ownerId = req.user.userId;
  const text = String(req.body.text || "").trim();
  if (!text) return res.status(400).json({ error: "Text is required" });

  const ref = db.ref(`owners/${ownerId}/reminders`).push();
  const id = ref.key;

  const payload = {
    id,
    text,
    createdAt: now(),
  };

  await ref.set(payload);
  return res.status(201).json({ reminder: payload });
}

export async function deleteReminder(req, res) {
  const ownerId = req.user.userId;
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "Missing id" });

  await db.ref(`owners/${ownerId}/reminders/${id}`).remove();
  return res.json({ ok: true });
}
