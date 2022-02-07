const multer = require("multer");
const { Assets } = require("../models");

const getAllAssets = async (req, res) => {
  try {
    const [results] = await Assets.findMany();
    res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getAllImages = async (req, res) => {
  try {
    const [results] = await Assets.findManyImages();
    res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getOneAssetById = async (req, res) => {
  const id = req.params.id ? req.params.id : req.assets_id;
  const statusCode = req.method === "POST" ? 201 : 200;
  try {
    const [result] = await Assets.findOneAssetById(id);
    if (result.length === 0) {
      res.status(404).send(`Image ${id} not found`);
    } else {
      res.status(statusCode).json(result[0]);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const uploadOneAsset = async (req, resp, next) => {
  const { type } = req.query;
  const assetStorage = multer.diskStorage({
    destination: (_req, asset, cb) => {
      cb(null, `public/assets/${type}`);
    },
    filename: (_, asset, cb) => {
      cb(null, `${asset.originalname}`);
    },
  });

  const upload = multer({ storage: assetStorage }).single("asset");
  upload(req, resp, (err) => {
    if (err) {
      resp.status(500).json(err);
    } else {
      console.log(req.file);
      next();
    }
  });
};

const createOneAsset = async (req, resp, next) => {
  let { type } = req.query;
  type = "image";

  const newAsset = {
    type,
    source: "image",
  };

  try {
    const [result] = await Assets.createOne(newAsset);
    req.assets_id = result.insertId;
    next();
  } catch (err) {
    resp.status(500).send(err.message);
  }
};

const deleteOneAsset = async (req, resp) => {
  const { id } = req.params;
  try {
    const [result] = await Assets.deleteOneById(id);
    if (result.affectedRows === 0) {
      resp.status(404).send(`Image with ${id} not found`);
    } else {
      resp.status(200).send(`LImage with ${id} deleted`);
    }
  } catch (err) {
    resp.status(500).send(`Error while displaying the image  ${err.message}`);
  }
};

module.exports = {
  getAllAssets,
  getAllImages,
  getOneAssetById,
  uploadOneAsset,
  createOneAsset,
  deleteOneAsset,
};
