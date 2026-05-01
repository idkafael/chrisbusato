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

var dashboardDir = path.join(__dirname, "dist", "dashboard");
fs.mkdirSync(dashboardDir, { recursive: true });
fs.copyFileSync(
  path.join(__dirname, "dashboard.html"),
  path.join(dashboardDir, "index.html")
);

var valentineDir = path.join(__dirname, "dist", "valentine");
fs.mkdirSync(valentineDir, { recursive: true });
fs.copyFileSync(
  path.join(__dirname, "valentine.html"),
  path.join(valentineDir, "index.html")
);

var testeDir = path.join(__dirname, "dist", "teste");
fs.mkdirSync(testeDir, { recursive: true });
fs.copyFileSync(
  path.join(__dirname, "teste.html"),
  path.join(testeDir, "index.html")
);

var ingressoDir = path.join(__dirname, "dist", "ingresso");
fs.mkdirSync(ingressoDir, { recursive: true });
fs.copyFileSync(
  path.join(__dirname, "Iridescent card", "Ticket Reveal.html"),
  path.join(ingressoDir, "index.html")
);

var grupoDir = path.join(__dirname, "dist", "grupo");
fs.mkdirSync(grupoDir, { recursive: true });
fs.copyFileSync(
  path.join(__dirname, "grupo.html"),
  path.join(grupoDir, "index.html")
);

// Linkbio
fs.copyFileSync(
  path.join(__dirname, "linkbio.html"),
  path.join(__dirname, "dist", "linkbio.html")
);

// Imagens estáticas — copia toda a pasta /images para /dist/images
var imagesDir = path.join(__dirname, "images");
if (fs.existsSync(imagesDir)) {
  var distImagesDir = path.join(__dirname, "dist", "images");
  fs.mkdirSync(distImagesDir, { recursive: true });
  fs.readdirSync(imagesDir).forEach(function(file) {
    fs.copyFileSync(
      path.join(imagesDir, file),
      path.join(distImagesDir, file)
    );
  });
}
