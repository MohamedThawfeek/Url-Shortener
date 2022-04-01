const router = require("express").Router();
const urlShort = require("./url");
const Users = require("./user");

router.use("/shortUrl", urlShort);
router.use("/user", Users);

module.exports = router;
