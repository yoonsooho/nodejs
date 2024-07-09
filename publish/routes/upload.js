const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();

try {
    // console.log(fs.readdirSync("uploads"));
    fs.readdirSync("uploads");
} catch (error) {
    console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
    fs.mkdirSync("uploads");
}

const upload = multer({
    //multer에서는 꼭 프론트에서 텍스트 + 이미지를 보낼때 텍스트를 이미지보다 먼저 넣어야 된다. 따라서 이미지를 마지막에 넣는 습관을 들여야된다.
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, "uploads/");
        },
        filename(req, file, done) {
            console.log("req.body", req.body.title);
            const ext = path.extname(file.originalname);
            const title = req.body.title || Buffer.from(file.originalname, "ascii").toString("utf8"); //
            done(null, path.basename(title) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});
router
    .route("/")
    .get((req, res) => {
        res.sendFile(path.join(__dirname, "../multipart.html"));
    })
    .post(upload.fields([{ name: "image1" }, { name: "image2" }, { name: "title" }]), (req, res) => {
        // console.log("req.file", req.body.title);
        res.send("ok");
    });

module.exports = router;
