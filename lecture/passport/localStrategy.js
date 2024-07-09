const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcrypt");
const User = require("../models/user");

module.exports = () => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: "email", //req.body.email
                passwordField: "password", //req.body.password
                passReqToCallback: false, //req가 필요하다면 true로 하고 아래의   async(email, password, done)를   async(req,email, password, done)로변경
            },
            async (email, password, done) => {
                try {
                    const exUser = await User.findOne({ where: { email } });
                    if (exUser) {
                        const result = await bcrypt.compare(password, exUser.password);
                        if (result) {
                            done(null, exUser);
                        } else {
                            done(null, false, { message: "비밀번호가 일치하지 않습니다." });
                        }
                    } else {
                        done(null, false, { message: "가입되지 않은 회원입니다." });
                    }
                } catch (error) {
                    console.error(error);
                    done(error);
                }
            }
        )
    );
};
