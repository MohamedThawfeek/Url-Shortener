const router = require("express").Router();
const urlapi = require("./api");

router.use("/api", urlapi);

module.exports = router;
