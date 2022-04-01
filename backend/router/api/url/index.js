const router = require("express").Router();
const Url = require("../../../model/url");

router.post("/add", async (req, res) => {
  try {
    const data = await Url.create({ full: req.body.fullUrl });

    res.json({ url: data });
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/all", async (req, res) => {
  try {
    const url = await Url.find({});
    res.json({ shortUrls: url });
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/:shortUrl", async (req, res) => {
  try {
    const shorturl = await Url.findOne({ short: req.params.shortUrl });
    if (shorturl === null) {
      return res.sendStatus(404);
    }

    await shorturl.click++;
    await shorturl.save();

    res.json({ short: shorturl.full });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
