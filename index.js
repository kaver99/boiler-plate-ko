const express = require('express');
const app = express();
const port = 5000;
const config = require('./server/config/key');
const { auth } = require('./server/middleware/auth');

// [ Configure cookieParser ]
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// [ Configure bodyParser ]
const bodyParser = require('body-parser');
// application/x-www-form-urlencoded data를 분석해서 가져옴 
app.use(bodyParser.urlencoded({
    extended: true 
}));
// application/json를 분석해서 가져옴
app.use(bodyParser.json());

const { User } = require('./server/models/User');

// [ Configure mongoDB Connect ]
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('MongoDB Connected..');
}).catch((err) => {
    console.error('MongoDB Connect Failure');
    console.error(err);
});


// [ Router ]
app.get('/api/hello', (req, res) => {
    res.send('Hello World!');
});

// [ Register Route ]
app.post('/api/users/register', (req, res) => {
    // 회원 가입에 필요한 정보를 Client에서 가져오면 해당 데이터를 데이터베이스에 적재
    const user = new User(req.body);

    user.save((err, userInfo) => {
        if(err) {
            console.error(err);
            return res.json({ success: false, err });
        }

        // validation 처리

        return res.status(200).json({
            success: true
        });
    });
});

// [ Login Route ]
app.post('/api/users/login', (req, res) => {
    // 요청한 이메일이 DB에 있는지 확인
    User.findOne({ email: req.body.email }, (err, user) => {
        if(err) res.status(400).send(err);
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "User is not found."
            });
        }

        // 요청한 이메일이 DB에 있다면, 비밀번호가 같은지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(err) res.status(400).send(err);
            if(!isMatch) {
                return res.json({
                    loginSuccess: false,
                    message: "User Password is not match."
                });
            }
        });

        // 비밀번호가 맞다면 token 생성
        // token을 DB에 적재 후 token정보를 쿠키에 저장
        user.generateToken((err, user) => {
            if(err) res.status(400).send(err);

            // token을 쿠키에 저장(쿠키, 로컬 스토리지)
            res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id });
        });
    });
});

// [ Auth Route ]
// auth는 middleware
// role[ 0: 일반유저, 1: 관리자 ]
app.get('/api/users/auth', auth, (req, res) => {
    // auth 미들웨어를 통과 : Authentication이 true
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false: true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    });
});

// [ Logout ]
app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id}, { token: "" }, (err, user) => {
        if(err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});


// [ Web Application Listen ]
app.listen(port, () => {
    console.log(`Express server is running. 'http://127.0.0.1:${port}'`);
});