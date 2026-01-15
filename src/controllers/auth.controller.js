import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { db } from "../config/firebase.js";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function emailKey(email) {
  const normalized = normalizeEmail(email);
  return Buffer.from(normalized, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export async function register(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const userId = uuid();
    const key = emailKey(email);
    const emailRef = db.ref(`emailToUid/${key}`);

    const tx = await emailRef.transaction((current) => {
      if (current) return;   
      return userId;        
    });

    if (!tx.committed) {
      return res.status(409).json({ error: "Email already in use" });
    }


    try {
      const hash = await bcrypt.hash(password, 10);
      await db.ref(`users/${userId}`).set({
        email,
        passwordHash: hash,
        createdAt: Date.now(),
      });
    } catch (e) {
      await emailRef.remove();
      throw e;
    }

    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET);
    return res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}


export async function login(req, res) {
  const email = normalizeEmail(req.body.email);
  const { password } = req.body;

  const key = emailKey(email);
  const uidSnap = await db.ref(`emailToUid/${key}`).once("value");
  if (!uidSnap.exists()) return res.status(401).json({ error: "Invalid credentials" });

  const userId = uidSnap.val();
  const userSnap = await db.ref(`users/${userId}`).once("value");
  const user = userSnap.val();
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId, email }, process.env.JWT_SECRET);
  res.json({ token });
}
