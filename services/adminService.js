var express = require("express");
var Admin = require('../models/adminModel');
var jwt = require('jsonwebtoken');
var config = require('../config');
var secretKey = config.secret;
var AdminService = {
    createAdmin: (adminData, callback) => {
        var admin = {
            email: adminData.email,
            password: adminData.password,
            first_name: adminData.first_name,
            last_name: adminData.last_name,
            is_admin: true
        };
        new Admin(admin).save(function (err, u) {
            if (err) {
                callback({ success: true, error: false, errors: err, result: null });
            } else {
                callback({ success: true, error: false, message: "Admin Created Successfully", result: u });
            }
        });
    },
    login:(adminData, callback) => {
        Admin.findOne({ email: adminData.email })
            .select('email password is_admin first_name last_name')
            .exec(function (err, admin) {
                if (err) {
                    callback({ success: false, error: true, message: "Internal server error", errors: err });
                }
                if (!admin) {
                    callback({ success: false, error: true, message: "Admin doesn't exist", result: {} });
                } else if (admin) {
                    var validPassword = admin.comparePassword(adminData.password);
                    if (!validPassword) {
                        callback({ success: false, error: true, message: "Invalid password", result: {} });
                    } else {
                        var token = jwt.sign({
                            email: adminData.email
                        }, secretKey, { expiresIn: '2h' });
                        Admin.updateOne(
                            { _id: admin._id },
                            {
                                $set: {
                                    authtoken: token,
                                    last_login: Date.now(),
                                    is_logged_in: true
                                }
                            }
                        ).exec(function (err, result) {
                            if (!err) {
                                callback({
                                    success: true,
                                    error: false,
                                    message: 'Login successfully',
                                    result: {
                                        email: adminData.email,
                                        token: token
                                    }
                                });
                            }
                        })
                    }
                }
            });
    },
    checkAdminlogin:(adminData, callback) => {
        Admin.findOne({ authtoken: adminData.token })
            .select('email is_admin first_name last_name phone_number')
            .exec(function (err, admin) {
                if (err) {
                    callback({ success: false, error: true, message: "Internal server error", errors: err });
                }
                if (!admin) {
                    callback({ success: false, error: true, message: "Access denied", result: {} });
                } else if (admin) {
                    callback({ success: true, error: false, message: "Admin access granted", result: admin });
                }
            });
    }
}

module.exports = AdminService;