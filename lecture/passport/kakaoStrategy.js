const passport = require("passport");
const { Strategy: KakaoStrategy } = require("passport-kakao");
const User = require("../models/user");

module.exports = () => {
    passport.use(
        new KakaoStrategy(
            {
                clientID: process.env.KAKAO_ID,
                clientSecret: process.env.KAKAO_SECRET,
                callbackURL: "/auth/kakao/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                console.log("profile", profile);
                try {
                    const exUser = await User.findOne({ where: { snsId: profile?._json.id, provider: "kakao" } });
                    if (exUser) {
                        done(null, exUser);
                    } else {
                        const newUser = await User.create({
                            email: profile._json?.kakao_account?.email,
                            nick: profile?._json?.properties?.nickname,
                            snsId: profile?._json.id,
                            provider: "kakao",
                        });
                        done(null, newUser);
                    }
                } catch (error) {
                    console.error(error);
                    done(error);
                }
            }
        )
    );
};
