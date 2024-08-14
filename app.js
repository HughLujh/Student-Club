var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const favicon = require('serve-favicon');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var clubsRouter = require('./routes/clubs');


var mysql = require('mysql2');

var dbConnectionPool = mysql.createPool({
    host: 'localhost',
    database: 'langen',
    user: 'u',
    password: 'password'
});

var app = express();

app.use(favicon(path.join(__dirname, '/public/images/icon.png')));

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// for session login
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'super secret string',
    // TODO: set to be true???
    secure: false
}));

app.use(function (req, res, next) {
    if (req.url === '/javascripts/admin.js') {
        dbConnectionPool.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                res.status(500);
                res.sendFile(path.resolve("private/invalid.html"));
                return;
            }
            var query = "SELECT COUNT(user_email) AS found FROM user INNER JOIN user_session WHERE user.email = user_session.user_email AND user.role = \"admin\" AND user_session.session = ?";
            connection.query(query, [req.session.id], function (err2, rows, fields) {
                connection.release();
                if (err2) {
                    console.log(err2);
                    res.sendStatus(500);
                    return;
                }
                if (rows[0].found > 0) {
                    res.sendFile(path.resolve("public/javascripts/admin.js"));
                } else {
                    res.status(403);
                    res.sendFile(path.resolve("private/invalid.html"));
                    return;
                }
            });
        });
    } else {
        next();
    }
});

app.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html', 'htm']
}));

app.use(function (req, res, next) {
    req.pool = dbConnectionPool;
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/clubs', clubsRouter);

app.use((req, res, next) => {
    res.status(404).redirect('/404');
});

module.exports = app;
