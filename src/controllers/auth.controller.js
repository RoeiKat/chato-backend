import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { db } from "../config/firebase.js";

export async function register(req, res) {
  const { email, password } = req.body;
  const userId = uuid();

  const hash = await bcrypt.hash(password, 10);

  await db.ref(`users/${userId}`).set({
    email,
    passwordHash: hash,
    createdAt: Date.now()
  });

  const token = jwt.sign({ userId, email }, process.env.JWT_SECRET);
  res.status(201).json({ token });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const snap = await db.ref("users").once("value");
  const users = snap.val() || {};

  const entry = Object.entries(users).find(
    ([, u]) => u.email === email
  );

  if (!entry) return res.status(401).json({ error: "Invalid credentials" });

  const [userId, user] = entry;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId, email }, process.env.JWT_SECRET);
  res.json({ token });
}
