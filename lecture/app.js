const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const passport = require("passport");

dotenv.config();
const passportConfig = require("./passport");
const pageRouter = require("./routes/page");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const profileRouter = require("./routes/profile");
const hashRouter = require("./routes/hash");
passportConfig();
const { sequelize } = require("./models");
const app = express();

app.set("port", process.env.PORT || 8081);
app.set("view engine", "html");
nunjucks.configure("views", {
    express: app,
    watch: true,
});

sequelize
    .sync({ force: false }) //force: true로 하면 서버 다시 시작하면 db를 전부 삭제하고 다시 만들어줌
    .then(() => {
        console.log("db연결완료");
    })
    .catch((err) => {
        console.log(err);
    });

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/img", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: { httpOnly: true, secure: false },
    })
);
app.use(passport.initialize()); // req.user, req.login, req.isAuthenticate, req.logout 생성
app.use(passport.session()); // connect.sid라는 이름으로 세션 쿠키가 브라우저로 전송

app.use("/", pageRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/hash", hashRouter);

app.use((req, res, next) => {
    //404 에러처리
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
app.listen(app.get("port"), function () {
    console.log(`${app.get("port")} 번에서 실행중`);
});
