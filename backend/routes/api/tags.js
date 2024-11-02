const express = require('express');
const router = express.Router();
const tagsController = require('../../controllers/tagsController');

router
  .route('/')
  .get(tagsController.getAllTags)
  .post(tagsController.createNewTag)
  .put(tagsController.updateTag)
  .delete(tagsController.deleteTags);

module.exports = router;
