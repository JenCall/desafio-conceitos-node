const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");
const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validateId = (request, response, next) => {
  const { id } = request.params;
  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID.' });
  }
  return next();
};

const findIndex = (id) => {
  return repositories.findIndex((repo) => repo.id === id);
};

app.use("repositories/:id", validateId);

app
  .get("/repositories", (request, response) => {
    return response.json(repositories);
  })
  .post("/repositories", (request, response) => {
    const { title, url, techs } = request.body;
    const repository = { id: uuid(), title, url, techs, likes:0 };
    repositories.push(repository);
    
    return response.json(repository);
  })
  .put("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;
    
    const repIndex = findIndex(id);
    if(repIndex < 0 ) {
      return response.status(400).json({error: "repository not found."})
    }
    const repository = { ...repositories[repIndex], title, url, techs };
    repositories[repIndex] = repository;

    return response.json(repository);
  })
  .delete("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const repIndex = findIndex(id);
    if(repIndex < 0 ) {
      return response.status(400).json({error: "repository not found."})
    }
    repositories.splice(repIndex, 1);
    return response.status(204).send();
  })
  .post("/repositories/:id/like", (request, response) => {
    const { id } = request.params;
    const repIndex = findIndex(id);
    if(repIndex < 0) { 
      return response.status(400).json( { error: 'repository not found'});
    }
    repositories[repIndex].likes++;
    return response.status(200).json(repositories[repIndex]);
  });

module.exports = app;
