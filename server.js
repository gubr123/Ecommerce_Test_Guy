/**
 * Created by guy on 11/08/2016.
 */
var express = require("express");
var app = express();
var serv = require("http").Server(app);

var paypal = require('./paypal');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var fs = require('fs');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: true}
}));

app.use("/public", express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/home/home.html");
});

//Get users from Database (text file)
app.get("/getUsersList", function (req, res) {
    fs.readFile(__dirname + "/DB/db.txt", function (err, data) {
        if (err) {
            res.send(false);
            throw err;
        }
        res.send(data.toString().split('\n'));
    })
});

//Redirecting
app.get('/payment/payment.html', function (req, res) {
    res.sendFile(__dirname + "/public/payment/payment.html");
});

//Redirecting
app.get('/backOffice/backOffice.html', function (req, res) {
    res.sendFile(__dirname + "/public/backOffice/backOffice.html");
});

//Execute paying in paypal
app.get('/execute', paypal.execute);

//After canceling in paypal
app.get('/cancel', paypal.cancel);

//Put new user in Database (text file), send him an email, and integrate with payPal
app.post("/makePurchase", function (req, res) {

    //Insert records to Database
    var user = req.body;

    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'ecommerce.test.guy@gmail.com',
            pass: 'guytest!'
        }
    });

    transporter.sendMail({
        from: 'ecommerceApp',
        to: user.email,
        subject: 'You have clicked on buy!',
        text: 'Hi ' + user.firstName + ' ' + user.lastName + '! Thanks for buying!'
    }, function (err) {
        if (err)
            console.log(err);
    });

    paypal.pay(req, res);

});

serv.listen(1337);





