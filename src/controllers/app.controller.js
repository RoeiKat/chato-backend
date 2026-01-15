import { generateApiKey } from "../utils/crypto.js";
import { db } from "../config/firebase.js";

export async function createApp(req, res) {
  const apiKey = generateApiKey();

  await db.ref(`apps/${apiKey}`).set({
    ownerId: req.user.userId,
    name: req.body.name,
    createdAt: Date.now()
  });

  res.status(201).json({ apiKey });
}

export async function listApps(req, res) {
  const ownerId = req.user.userId;
  const snap = await db.ref("apps").get();
  const all = snap.val() || {};

  const apps = Object.entries(all)
    .map(([apiKey, app]) => ({ apiKey, ...app }))
    .filter((app) => app.ownerId === ownerId)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  res.json({ apps });
}

export async function deleteApp(req, res) {
  const ownerId = req.user.userId;
  const { apiKey } = req.params;

  const appRef = db.ref(`apps/${apiKey}`);
  const snap = await appRef.get();
  if (!snap.exists()) return res.status(404).json({ error: "App not found" });

  const app = snap.val();
  if (app.ownerId !== ownerId) return res.status(403).json({ error: "Forbidden" });


  const updates = {};
  updates[`apps/${apiKey}`] = null;
  updates[`sessions/${apiKey}`] = null;
  updates[`messages/${apiKey}`] = null;

  await db.ref().update(updates);

  return res.json({ ok: true });
}

