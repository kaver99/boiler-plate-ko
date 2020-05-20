const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,     // 중간 공백 제거
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: { // token 사용 유효 기간
        type: Number
    }
});

// user정보를 저장하기 전에 실행
// arrow 함수 사용 안됨 userSchema.pre('save', (next) => {});
userSchema.pre('save', function(next) {
    var user = this;
    
    // 패스워드 변경이 있을 시(사용자 정보에서 패스워드까지 포함되어 변경이 있을 시)
    if(user.isModified('password')) {
        // 비밀번호 암호화
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if(err) return next(err);

            bcrypt.hash(user.password, salt, (err, hash) => {
                // hash: 암호화된 패스워드
                if(err) return next(err);

                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

// [ Login ] - password 비교
userSchema.methods.comparePassword = function(plainPassword, callback) {
    // plainPassword
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
        if(err) return callback(err);
        callback(null, isMatch);
    });
}

// [ Login ] - token 생성기
userSchema.methods.generateToken = function(callback) {
    var user = this;

    // jsonwebtoken 모듈을 이용해 token 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token;
    user.save((err, user) => {
        if(err) return callback(err);
        callback(null, user);
    });
}

// [ Auth ]
userSchema.statics.findByToken = function(token, callback) {
    var user = this;

    // token Decode
    jwt.verify(token, 'secretToken', (err, decode) => {
        // user._id를 이용해서 user를 찾은 다음 클라이언트에서 가져온 token과 DB의 token이 일치하는지 확인
        user.findOne({ "_id": decode, "token": token }, (err, user) => {
            if(err) return callback(err);
            callback(null, user);
        });
    });
}

const User = mongoose.model('User', userSchema);

module.exports = { User };