// const Sequelize = require("sequelize"); //시퀄라이저 불러오기
// const User = require("./user");
// const Post = require("./post");
// const Hashtag = require("./hashtag");
// //그동안 만든 모델 가져오기
// const env = process.env.NODE_ENV || "development"; //환경 변수가져오기
// const config = require("../config/config.json")[env]; //환경변수에 맞는 설정
// const db = {};
// const sequelize = new Sequelize(config.database, config.username, config.password, config); //설정에 있는 각 요소들 넣어서 연결하기

// db.sequelize = sequelize;
// db.User = User;
// db.Post = Post;
// db.Hashtag = Hashtag;
// //시퀄라이저와 각각의 모델은 두고두고 재사용하기 때문에 객체로 묶기

// User.initiate(sequelize);
// Post.initiate(sequelize);
// Hashtag.initiate(sequelize);
// User.associate(db);
// Post.associate(db);
// Hashtag.associate(db);
// //각각 모델들 initiate와 associate를 호출해서 연결

// module.exports = db;

// 근데 이런 설정들을 하나라도 빼먹으면 안되는데 이런걸 강사님은 자동으로 해놓는다고 한다. 자동화한 코드는 아래에 전부 넣어보겠다.

const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

const basename = path.basename(__filename);
fs.readdirSync(__dirname) // 현재 폴더의 모든 파일을 조회
    .filter((file) => {
        // 숨김 파일, index.js, js 확장자가 아닌 파일 필터링
        return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
    })
    .forEach((file) => {
        // 해당 파일의 모델 불러와서 init
        const model = require(path.join(__dirname, file));
        console.log(file, model.name);
        db[model.name] = model;
        model.initiate(sequelize);
    });

Object.keys(db).forEach((modelName) => {
    // associate 호출
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;
