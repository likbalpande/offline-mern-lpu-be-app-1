const dotEnv = require("dotenv");
dotEnv.config();
const express = require("express");
require("./config/db.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { apiRouter } = require("./api/v1/routes.js");

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

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
