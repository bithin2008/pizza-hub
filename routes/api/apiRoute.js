var express = require("express");
var jwt = require('jsonwebtoken');
var config = require('../../config');
var apiUser = express.Router();
var UserService = require('../../services/userService');
var PizzaService = require('../../services/pizzaService');
var OrderService = require('../../services/orderService');

/*******************************
 * User Login
 * @method: POST
 * @request params
 *      email
 *      password
 * @url: /api/users/login
 ********************************/
apiUser.post('/login', function (req, res) {
    var userData = req.body;
    UserService.doLogin(userData, req.headers['user-agent'], function (response) {
        res.send(response);
    });
});
/**************************
 * Get pizza list
 * @method: GET
 * @request header
 *     
 * @url: /api/pizza
 **************************/
apiUser.get('/pizza', function (req, res) {
    PizzaService.getPizzas(req.query, function (response) {
        res.send(response);
    });
});
/*******************************
 * User Create order
 * @method: POST
 * @request params
 *      
 * @url: /api/order
 ********************************/
apiUser.post('/order', function (req, res) {
    var userData = req.body;
    OrderService.createOrder(userData, function (response) {
        res.send(response);
    });
});
/******************************
 *  Middleware to check token
 ******************************/
apiUser.use(function (req, res, next) {
    var token = req.body.token || req.params.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                res.send({ success: false, error: true, status: 0, message: "Authentication failed" });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.send({ success: false, error: true, status: 0, message: "Session expired" });
    }
});
/**************************
 * User CHECKING
 * @method: POST
 * @request params
 *     token
 * @url: /api/users/checklogin
 **************************/
apiUser.post('/checklogin', function (req, res) {
    var userData = req.body;
    UserService.checkUserLogin(userData, function (response) {
        res.send(response);
    });
});
/**************************
 * Get profile
 * @method: GET
 * @request header
 *     token
 * @url: /api/users/me
 **************************/
apiUser.get('/me', function (req, res) {
    UserService.me(req.decoded, function (response) {
        res.send(response);
    });
});
/**************************
 * Get order history
 * @method: GET
 * @request header
 *     token
 *     page
 *     limit
 *     sortby
 * @url: /api/users/order-history
 **************************/
apiUser.get('/order-history', function (req, res) {
    OrderService.orderHistory(req.decoded, req.query, function (response) {
        res.send(response);
    });
});

module.exports = apiUser;