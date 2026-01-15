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
