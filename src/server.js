import path from "path";
import { fileURLToPath } from "url";

if (process.env.NODE_ENV !== "production") {
  const dotenv = await import("dotenv");
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  dotenv.config({
    path: path.resolve(__dirname, "../.env")
  });
}

const { default: app } = await import("./app.js");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

