const assetsRouter = require("express").Router();

const { assetsControllers } = require("../controllers");

assetsRouter.get("/", assetsControllers.getAllAssets);
assetsRouter.get("/:id", assetsControllers.getOneAssetById);
assetsRouter.get("/type/image", assetsControllers.getAllImages);
assetsRouter.delete("/:id", assetsControllers.deleteOneAsset);
assetsRouter.post(
  "/",
  assetsControllers.createOneAsset,
  assetsControllers.getOneAssetById
);

assetsRouter.post(
  "/upload",
  assetsControllers.uploadOneAsset,
  assetsControllers.createOneAsset,
  assetsControllers.getOneAssetById
);

module.exports = assetsRouter;
