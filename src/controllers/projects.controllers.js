const { Projects } = require("../models");

const getAllProjects = async (req, res) => {
  try {
    const [results] = await Projects.findManyProjects();
    res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getOneProjectById = async (req, resp) => {
  const id = req.params.id ? req.params.id : req.projects_id;
  const statusCode = req.method === "POST" ? 201 : 200;

  let projectsResult;
  let assetsResult;
  try {
    [projectsResult] = await Projects.findOneProjectById(id);
  } catch (err) {
    resp.status(500).send(err.message);
  }
  try {
    [assetsResult] = await Projects.findAssetsByProjectId(id);
  } catch (err) {
    resp.status(500).send(err.message);
  }
  if (projectsResult.length === 0) {
    resp.status(404).send(`Project ${id} not found`);
  } else if (assetsResult.length === 0) {
    resp.status(statusCode).json(projectsResult[0]);
  } else {
    projectsResult[0].assets = assetsResult[0];
    resp.status(statusCode).json(projectsResult[0]);
  }
};

const createOneProject = async (req, res, next) => {
  const { title, link, description, assets_id } = req.body;
  try {
    const [result] = await Projects.createOne({
      title,
      link,
      description,
      assets_id,
    });
    req.projects_id = result.insertId;
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteOneProject = async (req, res, next) => {
  const projects_id = req.params.id;
  try {
    const [result] = await Projects.deleteOneProject(projects_id);
    if (result.affectedRows === 0) {
      res.status(404).send(`Project ${projects_id} not found`);
    } else {
      res.status(200).send(`Project ${projects_id} deleted`);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getAllProjects,
  getOneProjectById,
  createOneProject,
  deleteOneProject,
};
