const express = require("express");
const router = express.Router();
const { getUser, addUser } = require("../controllers/user");

router.get("/", async function (req, res) {
  try {
    const { result: user, err } = await getUser();
    if (err) throw err;
    res.json({
      data: user,
      status: "success",
    });
  } catch (e) {
    console.log(e);
    res.send({
      message: e.message,
      code: e.code ? e.code : 500,
    });
  }
});

router.post("/", async function (req, res) {
  try {
    const { result: user, err } = await addUser(req.body);
    if (err) throw err;
    res.json({
      data: user,
      status: "success",
    });
  } catch (e) {
    console.log(e);
    res.send({
      message: e.message,
      code: e.code ? e.code : 500,
    });
  }
});

module.exports = router;
