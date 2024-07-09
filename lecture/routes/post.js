const express = require("express");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");

const fs = require("fs");
const multer = require("multer");
const path = require("path");

const { afterUploadImage, uploadPost } = require("../controllers/post");
try {
    fs.readdirSync("uploads");
} catch (error) {
    console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
    fs.mkdirSync("uploads");
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, "uploads/");
        },
        filename(req, file, cb) {
            console.log(file);
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 20 * 1024 * 1024 }, //20mb
});

router.post("/img", isLoggedIn, upload.single("img"), afterUploadImage);

const upload2 = multer();
router.post("/", isLoggedIn, upload2.none(), uploadPost);

module.exports = router;
