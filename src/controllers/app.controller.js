import { generateApiKey } from "../utils/crypto.js";
import { db } from "../config/firebase.js";

export async function createApp(req, res) {
  const apiKey = generateApiKey();

  await db.ref(`apps/${apiKey}`).set({
    ownerId: req.user.userId,
    name: req.body.name,
    createdAt: Date.now(),

    prechat: {
      q1: "Hey! this is the support, let's start with what is your name?",
      q2: "And your email?",
      q3: "Thanks! We'll answer you in a couple of minute in the meantime you can check our FAQ here",
      faqUrl: ""
    },

    theme: {
      bubbleBg: "",
      primary: "",
      iconSvg: "",
      title: ""
    }
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

export async function updateAppSettings(req, res) {
  const ownerId = req.user.userId;
  const { apiKey } = req.params;

  const appRef = db.ref(`apps/${apiKey}`);
  const snap = await appRef.get();
  if (!snap.exists()) return res.status(404).json({ error: "App not found" });

  const app = snap.val();
  if (app.ownerId !== ownerId) return res.status(403).json({ error: "Forbidden" });

  const { prechat, theme } = req.body || {};
  const updates = {};

  if (prechat) {
    if (prechat.q1 !== undefined) updates["prechat/q1"] = String(prechat.q1);
    if (prechat.q2 !== undefined) updates["prechat/q2"] = String(prechat.q2);
    if (prechat.q3 !== undefined) updates["prechat/q3"] = String(prechat.q3);
    if (prechat.faqUrl !== undefined) updates["prechat/faqUrl"] = String(prechat.faqUrl);
  }

  if (theme) {
    if (theme.bubbleBg !== undefined) updates["theme/bubbleBg"] = String(theme.bubbleBg);
    if (theme.primary !== undefined) updates["theme/primary"] = String(theme.primary);
    if (theme.iconSvg !== undefined) updates["theme/iconSvg"] = String(theme.iconSvg);
    if (theme.title !== undefined) updates["theme/title"] = String(theme.title);
  }

  await appRef.update(updates);
  return res.json({ ok: true });
}
