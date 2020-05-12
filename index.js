const express = require('express');
const app = express();
const port = 3000;

// [ Configure mongoDB Connect ]
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://violet:violet@cluster0-yudbh.mongodb.net/test?retryWrites=true&w=majority', {
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

// [ Web Application Listen ]
app.listen(port, () => {
    console.log(`Express server is running. 'http://127.0.0.1:${port}'`);
});