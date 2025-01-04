const express = require("express");

const homeRouter = express.Router();

// Home route
homeRouter.get("/", (req, res) => {
  res.send("Working");
});

module.exports = homeRouter;
