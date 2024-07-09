const Sequelize = require("sequelize");

class User extends Sequelize.Model {
    static initiate(sequelize) {
        User.init(
            {
                email: {
                    type: Sequelize.STRING(40),
                    allowNull: true,
                    unique: true,
                },
                nick: {
                    type: Sequelize.STRING(15),
                    allowNull: false,
                },
                password: {
                    type: Sequelize.STRING(100),
                    allowNull: true,
                },
                provider: {
                    type: Sequelize.ENUM("local", "kakao"),
                    allowNull: false,
                    defaultValue: "local",
                },
                snsId: {
                    type: Sequelize.STRING(30),
                    allowNull: true,
                },
            },
            {
                sequelize,
                timestamps: true, //createAt,updataAt
                underscored: false,
                modelName: "User",
                modelName: "users",
                paranoid: true, //deleteAt 유저 삭제일(soft delete)
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
            }
        );
    }
    static associate(db) {
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User, {
            foreignKey: "followingId",
            as: "Followers",
            through: "Follow",
        }); //팔로워
        db.User.belongsToMany(db.User, {
            foreignKey: "followerId",
            as: "Followings",
            through: "Follow",
        }); //팔로잉
        //내가 팔로잉하고 있는 사람을 찾으려면 내 아이디를 팔로워 아이디에서 찾아야된다. 그래서 foreignKey가 followingId가 아니라 followerId인것
    }
}
module.exports = User;
