const router = require("express").Router();
const { templateController } = require("../controller");

/**
 * *Note:  Replace the templateController with your controller
 */

router.post("/create", templateController.create);
router.get("/", templateController.findAll);
router.get("/:id", templateController.find);
router.put("/:id", templateController.update);
router.delete("/:id", templateController.remove);

module.exports = router;
