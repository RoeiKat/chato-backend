import { db } from "../config/firebase.js";

export default async function authApiKey(req, res, next) {
  const apiKey = req.header("x-api-key");
  if (!apiKey) return res.status(401).json({ error: "Missing API key" });

  const snap = await db.ref(`apps/${apiKey}`).get();
  if (!snap.exists()) return res.status(401).json({ error: "Invalid API key" });

  req.apiKey = apiKey;
  next();
}
