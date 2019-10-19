const express = require("express");

//Variavel chamando a função!
const server = express();

server.use(express.json());

/**
 * Utilizamos a variável `numberOfRequests` como
 * `let` porque vai sofrer mutação. A variável
 * `projects` pode ser `const` porque um `array`
 * pode receber adições ou exclusões mesmo sendo
 * uma constante.
 */
let numberOfRequests = 0;
const projects = [];

/** Middlewares que verificar se o projeto existe*/
function checkProjectsExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

/** Middlewares que dá log no numero de requisições*/
function logRequest(req, res, next) {
  numberOfRequests++;

  console.log(`Numero de requisições: ${numberOfRequests}`);

  return next();
}

server.use(logRequest);
/**
 * Projects
 */

//Listar todos os usuários
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//Post - Criar
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

//Put - Editar
server.put("/projects/:id", checkProjectsExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

//Delete - Deletar
server.delete("/projects/:id", checkProjectsExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.find(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

/**
 * Tasks
 */

server.post("/projects/:id/tasks", checkProjectsExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

//Ouça o click da porta - http://localhost:8080/projects
server.listen(8080);
