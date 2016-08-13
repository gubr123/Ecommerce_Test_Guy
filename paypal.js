/**
 * Created by guy on 12/08/2016.
 */
var paypal = require('paypal-rest-sdk');
var config = {};
var fs = require('fs');

var user = {};

var payment = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:1337/execute",
        "cancel_url": "http://localhost:1337/cancel"
    },
    "transactions": [{
        "amount": {
            "total": "5.00",
            "currency": "USD"
        },
        "description": "My awesome payment"
    }]
};

exports.pay = function (req, res) {
    user = req.body;
    user['paid'] = 'No'; //Only gets Yes when the execution succeed
    var now = new Date();
    var dd = now.getDate();
    var mm = now.getMonth()+1; //January is 0!
    var yyyy = now.getFullYear();
    var hh = now.getHours();
    var minutes = now.getMinutes();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    now = mm+'/'+dd+'/'+yyyy + ' ' + hh + ':' + minutes;

    user['dateTime'] = now;

    try {
        var configJSON = fs.readFileSync(__dirname + "/config.json");
        config = JSON.parse(configJSON.toString());
    } catch (e) {
        fs.appendFile(__dirname + "/DB/db.txt", JSON.stringify(user) + '\n');
        console.error("File config.json not found or is invalid: " + e.message);
        process.exit(1);
    }
    paypal.configure(config.api);
    paypal.payment.create(payment, function (error, payment) {
        if (error) {
            fs.appendFile(__dirname + "/DB/db.txt", JSON.stringify(user) + '\n');
            console.log(error);
        } else {
            if (payment.payer.payment_method === 'paypal') {
                req.session.paymentId = payment.id;
                var redirectUrl;
                for (var i = 0; i < payment.links.length; i++) {
                    var link = payment.links[i];
                    if (link.method === 'REDIRECT') {
                        redirectUrl = link.href;
                    }
                }
                res.send(redirectUrl);
            }
        }
    });
};

exports.execute = function (req, res) {
    var paymentId = req.query.paymentId;
    var payerId = req.query.PayerID;
    var details = {"payer_id": payerId};

    paypal.payment.execute(paymentId, details, function (error, payment) {
        if (error) {
            fs.appendFile(__dirname + "/DB/db.txt", JSON.stringify(user) + '\n');
            console.log(error);
        } else {
            user['paid'] = 'Yes';
            fs.appendFile(__dirname + "/DB/db.txt", JSON.stringify(user) + '\n');
            res.send('<div>You have made a successful purchase!</div><a href="/">Home</a>');
        }
    });
};

exports.cancel = function (req, res) {
    fs.appendFile(__dirname + "/DB/db.txt", JSON.stringify(user) + '\n');
    res.send('<div>You have canceled your purchase</div><a href="/">Home</a>');
};