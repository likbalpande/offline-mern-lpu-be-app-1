const dotEnv = require("dotenv");
dotEnv.config();
const express = require("express");
require("./config/db.js");
const cors = require("cors");

const { apiRouter } = require("./api/v1/routes.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log("------------");
    console.log(new Date(), req.method, req.url);
    console.log("------------");
    next();
});

app.use("/api/v1", apiRouter);

app.listen(2900, () => {
    console.log("------ Server is running --------");
});
