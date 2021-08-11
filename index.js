const express = require("express");
const app = express();
require("dotenv").config({ path: "./.env.dev" });
const userRouter = require("./user/routes/user");
const { PORT } = require("./appconstants.js");

app.use(express.json());

app.listen(PORT, () => {
  console.log(`server listening on PORT ${PORT}`);
});

app.use("/api/user", userRouter);
