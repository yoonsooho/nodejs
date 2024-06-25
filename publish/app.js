const express = require("express");
const path = require("path");

const app = express();

app.set("port", process.env.PORT || 3000);

app.use((req, res, next) => {
    console.log("모든 요청에 실행");
    next();
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/", (req, res) => {
    res.send("hello express!");
});

app.get("/category/:name", (req, res) => {
    res.send(`hello ${req.params.name}`);
});

app.get("/about", (req, res) => {
    res.send("hello express!");
});

app.use((req, res, next) => {
    res.send("404에러가 발생했습니다.");
});

app.use((err, req, res, next) => {
    console.error(err);
    res.send("알 수 없는 에러가 발생했습니다.");
});

app.listen(app.get("port"), () => {
    console.log("익스프레스 실행");
});
