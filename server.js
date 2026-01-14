import jsonServer from "json-server";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  const db = JSON.parse(
    fs.readFileSync(path.join(__dirname, "db.json"), "utf-8")
  );

  const user = db.users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = crypto.randomUUID();
  const { password: _, ...safeUser } = user;

  res.json({ user: safeUser, token });
});

const swaggerDocument = yaml.load(path.join(__dirname, "openapi.yaml"));

server.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Mini Dashboard API",
    customfavIcon: "/favicon.ico",
  })
);

server.use(router);

server.listen(5000, () => {
  console.log("JSON Server is running on http://localhost:5000");
  console.log("Swagger UI available at: http://localhost:5000/api-docs");
});
