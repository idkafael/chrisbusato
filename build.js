const fs = require("fs");
const path = require("path");

fs.mkdirSync("dist", { recursive: true });
fs.copyFileSync("index.html", "dist/index.html");

const dest = path.join(__dirname, "site-destinations.js");
if (fs.existsSync(dest)) {
  fs.copyFileSync(dest, path.join(__dirname, "dist", "site-destinations.js"));
}
