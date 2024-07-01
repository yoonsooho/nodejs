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
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, "uploads/");
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            console.log(ext);
            done(null, path.basename(Buffer.from(file.originalname, "ascii").toString("utf8")) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});
router
    .route("/")
    .get((req, res) => {
        res.sendFile(path.join(__dirname, "../multipart.html"));
    })
    .post(upload.fields([{ name: "image1" }, { name: "image2" }]), (req, res) => {
        console.log("req.file", req.file);
        res.send("ok");
    });

module.exports = router;
