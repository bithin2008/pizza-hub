"use strict";
var express = require('express');
var orderService = require('../../services/orderService');
var adminService = require('../../services/adminService');
var OrderRoute = express.Router();
/******************************
*  Middleware to check admin
******************************/
OrderRoute.use(function (req, res, next) {
    var token = req.body.token || req.params.token || req.headers['x-access-token'];
    if (token) {
        adminService.checkAdminlogin({ token: token }, function (response) {
            if (response.success) {
                next();
            } else {
                res.send(response);
            }
        });
    }
    else {
        res.send({ success: false, error: true, message: "Session expired" });
    }
});
/******************************
 *  Update
 *  @method: PUT
 *  @request params:
 *      status
 *  @url: /admin/order/:orderId
 ********************************/
OrderRoute.put('/:orderId', function (req, res) {
    var data = req.body;
    var orderId = req.params.orderId;
    orderService.update(orderId, data, function (response) {
        res.json(response);
    });
});
/******************************
 *  Get All order
 *  @method: GET
 *  @request params:
 *      page
 *      limit
 *      sortby
 *  @url: /admin/order
 ****************************************/
OrderRoute.get('/', function (req, res) {
    orderService.getAllOrder(req.query, function (response) {
        res.json(response);
    });
});
module.exports = OrderRoute;