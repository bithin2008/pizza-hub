"use strict";
var express = require('express');
var admin = express.Router();
var adminService = require('../../services/adminService');
var userService = require('../../services/userService');
//Run it into rest client after starting the project to create a new admin account//
/**************************
 * CREATE ADMIN
 * @method: POST
 * @request params
 *     email
 *     password
 *     first_name
 *     last_name
 * @url: /admin/register-admin
 **************************/
admin.post('/register-admin', function (req, res) {
    var adminData = req.body;
    adminService.createAdmin(adminData, function (response) {
        res.send(response);
    });
});
/**************************
 * ADMIN LOGIN
 * @method: POST
 * @request params
 *     email
 *     password
 * @url: /admin/login
 **************************/
admin.post('/login', function (req, res) {
    var adminData = req.body;
    console.log('adminData', adminData);
    adminService.login(adminData, function (response) {
        res.send(response);
    });
});
/**************************
 * ADMIN CHECKING
 * @method: POST
 * @request params
 *     token
 * @url: /admin/checklogin
 **************************/
admin.post('/checklogin', function (req, res) {
    var adminData = req.body;
    adminService.checkAdminlogin(adminData, function (response) {
        res.send(response);
    });
});
/******************************
*  Middleware to check admin
******************************/
admin.use(function (req, res, next) {
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
 *  Get All users
 *  @method: GET
 *  @request params:
 *      page
 *      limit
 *      sortby
 *  @url: /admin/user
 ****************************************/
admin.get('/user', function (req, res) {
    userService.getAllUsers(req.query, function (response) {
        res.json(response);
    });
});
module.exports = admin;
