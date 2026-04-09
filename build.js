const fs = require("fs");
const path = require("path");

fs.mkdirSync("dist", { recursive: true });
fs.copyFileSync("index.html", "dist/index.html");

const dest = path.join(__dirname, "site-destinations.js");
if (fs.existsSync(dest)) {
  fs.copyFileSync(dest, path.join(__dirname, "dist", "site-destinations.js"));
}

var quizzDir = path.join(__dirname, "dist", "quizz");
fs.mkdirSync(quizzDir, { recursive: true });
fs.copyFileSync(
  path.join(__dirname, "dist", "index.html"),
  path.join(quizzDir, "index.html")
);
