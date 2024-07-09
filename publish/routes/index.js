const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");

const router = express.Router();
router.use(cookieParser(process.env.COOKIE_SECRET));

router.use((req, res, next) => {
    console.log("모든 요청에 실행");
    req.data =
        "미들웨어 req와 app.get이런거에서의 req는 같기 때문에 미들웨어와 app.get같은거 끼리 데이터공유할떄 이렇게함";
    next();
});
router.use(
    session({
        resave: false, //모든 request마다 기존에 있던 session에 아무런 변경사항이 없을 시에도그 session을 다시 저장하는 옵션입니다.(매 request 마다 세션을 계속 다시 저장하는 것)
        saveUninitialized: false, // empty session obj가 쌓이는 걸 방지해 서버 스토리지를 아낄 수 있습니다.
        secret: process.env.COOKIE_SECRET, //위의 cookieParser의 시크릿넘버와 같을 필요는 없지만 강사님은 보통 같게 한다고 한다.
        cookie: {
            httpOnly: true,
            secure: false, //https적용할때 true로
        },
        name: "connect.sid",
    })
); //세션을 사용하기 위한 미들웨어

router.use("/", (req, res, next) => {
    //이렇게 미들웨어 내부에 미들웨어를 두면 미들웨어를 확장할 수 있다.
    //아래의 코드는 로그인했을 경우 id가 있을테니 그때만 정적파일을 반환하기 위함
    req.session.haha = "haha";
    console.log("모든곳에서 동작하는 미들웨어");
    if (req.session?.id) {
        express.static(path.join(__dirname, "public"))(req, res, next); //html css같은 정적 파일 보낼때 사용하는 미들웨어 app.use('요청 경로',express.static(__dirname,'실제경로'))
    } else {
        next();
    }
});

router.get("/", (req, res) => {
    // req.session[사용자이이디] 이렇게 적지 않아도 req.session을 하면 알아서 사용자에 대한 고유 세션을 가져옴
    // 예를 들면 req.session.id = 'hello'를 하면 특정 사용자의 id가 hello가됨 따라서 개인의 공간이 생겼다고 생각하면 될듯
    console.log("req.session", req.session);
    console.log(req.data);

    let name = { test: "테스트이긴해" };
    if (req.cookies.name) {
        console.log("req.cookies", JSON.parse(decodeURIComponent(req.cookies.name))); // 쿠키 확인하는법
    }

    console.log("req.signedCookies", req.signedCookies); //쿠키 성형한걸 확인하는방법
    res.cookie("test", 200, { signed: true });
    res.cookie("name", encodeURIComponent(JSON.stringify(name)), {
        expires: new Date("2025-01-01"),
        httpOnly: true,
        path: "/",
    }); //cookieparser에서 쿠키 설정하는법
    // res.clearCookie("name", encodeURIComponent(name), { httpOnly: true, path: "/" }); //cookieparser에서 쿠키 없애는법
    res.sendFile(path.join(__dirname, "../index.html"));
});

router.post("/", (req, res) => {
    res.send("hello express!");
});

module.exports = router;
