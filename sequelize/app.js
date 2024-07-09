const express = require("express");
const path = require("path");
const morgan = require("morgan");
const nunjucks = require("nunjucks");

const { sequelize } = require("./models");
const indexRouter = require("./routes");
const usersRouter = require("./routes/users");
const commentsRouter = require("./routes/comments");

const app = express();
app.set("port", process.env.PORT || 3001);
app.set("view engine", "html");
nunjucks.configure("views", {
    express: app,
    watch: true,
});
sequelize
    .sync({ force: false })
    //force: false일 경우, Sequelize는 정의된 모델을 기반으로 데이터베이스에 테이블이 없으면 새로운 테이블을 생성합니다.
    //이미 테이블이 존재하는 경우, 테이블을 삭제하거나 재생성하지 않고, 필요한 경우에만 테이블의 구조를 업데이트합니다.
    //force: true는 데이터베이스에 이미 존재하는 모든 테이블을 삭제하고, 모델 정의에 따라 다시 생성합니다.
    //즉, 기존 테이블이 있으면 그 테이블을 드롭(drop)한 후 새로 생성합니다.
    .then(() => {
        console.log("데이터베이스 연결 성공");
    })
    .catch((err) => {
        console.error(err);
    });

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/comments", commentsRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});

app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기 중");
});
