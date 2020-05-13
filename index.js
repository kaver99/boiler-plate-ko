const express = require('express');
const app = express();
const port = 3000;
const config = require('./config/key');

// [ Configure bodyParser ]
const bodyParser = require('body-parser');
// application/x-www-form-urlencoded data를 분석해서 가져옴 
app.use(bodyParser.urlencoded({
    extended: true 
}));
// application/json를 분석해서 가져옴
app.use(bodyParser.json());

const { User } = require('./models/User');

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
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/register', (req, res) => {
    // 회원 가입에 필요한 정보를 Client에서 가져오면 해당 데이터를 데이터베이스에 적재
    const user = new User(req.body);

    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err });

        // validation 처리

        return res.status(200).json({
            success: true
        });
    });
});

// [ Web Application Listen ]
app.listen(port, () => {
    console.log(`Express server is running. 'http://127.0.0.1:${port}'`);
});