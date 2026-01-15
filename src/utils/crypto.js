import crypto from "crypto";

export function generateApiKey() {
  return "app_" + crypto.randomBytes(24).toString("hex");
}
