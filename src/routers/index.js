const router = require("express").Router();
const {index} = require("../controllers");
const {hospitalDetailController} = require("../controllers/hospitalDetailController")

router.get("/", index);
router.get("/code/:id", hospitalDetailController)

module.exports = router;
