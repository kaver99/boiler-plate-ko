const { User } = require('../models/User');

// [ Auth ] - 인증 처리
let auth = (req, res, next) => {
    // 1. cookie에서 token 가져오기
    let token = req.cookies.x_auth;

    // 2. token을 복호화 한 후 user를 찾는다.
    User.findByToken(token, (err, user) => {
        if(err) throw err;

        // 3. user가 없으면 인증 실패
        if(!user) return res.json({ isAuth: false, error: true });

        // 4. user가 있으면 인증 성공
        req.token = token;
        req.user = user;
        next();
    });
}

module.exports = { auth };