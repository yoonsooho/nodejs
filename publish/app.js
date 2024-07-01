const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const morgan = require("morgan");
// const session = require("express-session");

const indexRouter = require("./routes");
const uploadRouter = require("./routes/upload");
const categoryRouter = require("./routes/category");
const portRouter = require("./routes/port");

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(morgan("dev")); // 요청과 응답을 기록하는 라이브러리
// app.use(morgan("combined"));// combined는 더 자세한 기록이 남음(실무에서 배포할때는 이걸로 잘 사용한다고함) ip, 브라우저, 시간도 나옴
app.use(express.json()); //이 미들웨어를 사용하면 클라이언트에서 보내는 json을 파싱하지 않고 바로 사용할 수 있음
app.use(express.urlencoded({ extended: true }));
//클라이언트에서 form 보낼때 알아서 파싱해줌 extended가 true면 qs모듈을 이용해서 querystring을 해석, false면 querystring모듈을 사용해서 해석 하지만 qs가 훨씬 강력하기 때문에 true추천
// multipart/form-data의 경우(프론트에서 파일같은 걸보낼때 사용하는듯)

app.use("/", indexRouter);
app.use("/upload", uploadRouter);
app.use("/category", categoryRouter);
app.use("/port", portRouter);

app.use((req, res, next) => {
    //인자를 3개 받는 콜백함수가 있다면 일반미들웨어 4개를 받는 다면 에러처리 콜백함수
    res.status(404).send("404에러가 발생했습니다.");
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("알 수 없는 에러가 발생했습니다.");
}); //에러처리 미들웨어

app.listen(app.get("port"), () => {
    console.log("익스프레스 실행");
});
