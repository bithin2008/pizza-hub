var User = require('../models/userModel');
var config = require('../config');
var secretKey = config.secret;
var jwt = require('jsonwebtoken');
var async = require("async");
var randomString = require('randomstring');

isUsernameExist = (email) => {
    var query = User.findOne({ email: email });
    var promise = query.exec();
    return promise;
};
createToken = (user) => {
    var tokenData = {
        id: user._id,
        username: user.email
    };
    var token = jwt.sign(tokenData, secretKey, {
        expiresIn: 60 * 60 * 24
    });
    return token;
};
var UserService = {
    getAllUsers: (params, callback) => {
        var page = 1,
            limit = 5,
            sort_field = '_createdAt';
        var sortObj = {};
        if (params.sortBy) {
            if (params.sortOrder == 'ASC') {
                sortObj[sort_field] = 1;
            } else {
                sortObj[sort_field] = -1;
            }
        } else {
            sortObj[sort_field] = 1;
        }

        if (params.page) {
            page = parseInt(params.page);
        }
        if (params.pageSize) {
            limit = parseInt(params.pageSize);
        }
        var query = {};
        User.paginate(query, { sort: sortObj, page: page, limit: limit }, function (err, result) {
            if (err) {
                callback({ success: false, error: true, errers: err });
            } else {
                var itemsArray = [];
                for (var i = 1; i < result.totalPages + 1; i++) {
                    itemsArray.push(i);
                }
                var paginationObj = {
                    total: result.totalDocs,
                    previousPage: result.prevPage || 0,
                    currentPage: result.page,
                    nextPage: result.nextPage || 0,
                    items: itemsArray
                };
                callback({ success: true, error: false, results: result.docs, pagination: paginationObj });
            }
        });
    },
    /*****************************
     *  For Api
     ******************************/
    doLogin: (userData, ua_str, callback) => {
        if (userData.email == "") {
            if (userData.mobile == '') {
                callback({ success: false, error: true, status: 0, message: "Provide email or mobile number" });
            } else {
                User.findOne({ $or: [{ 'email': userData.email }, { 'mobile': userData.mobile }] })
                    .select()
                    .exec(function (err, user) {
                        if (err) {
                            callback({ success: false, error: true, status: 0, message: "Internat DB error", errors: err });
                        } else if (!user) {
                            callback({ success: false, error: true, status: 0, message: "User doesn't exist" });
                        } else {
                            var UAParser = require('ua-parser-js');
                            var parser = new UAParser();
                            var uaObj = parser.setUA(ua_str);
                            var userAgent = uaObj.getResult();
                            var deviceToken = null;
                            if (typeof (userData.deviceToken) != 'undefined') {
                                deviceToken = userData.deviceToken;
                            }
                            var token = createToken(user);
                            var conditions = { _id: user._id },
                                fields = { isLoggedIn: true, authtoken: token, userAgent: userAgent, deviceToken: deviceToken, lastLogin: Date.now(), status: 'online' },
                                options = { upsert: false };
                            User.updateOne(conditions, fields, options, function (err, affected) {
                                user.lastLogin = fields.lastLogin;
                            });

                            callback({
                                success: true,
                                error: false,
                                status: 1,
                                message: "successfully logged in",
                                result: {
                                    token: token,
                                    user: user
                                }
                            });

                        }
                    });
            }
        } else {
            callback({ success: false, error: true, status: 0, message: "Provide email or mobile number" });

        }

    },
    checkUserLogin: (userData, callback) => {
        User.findOne({ authtoken: userData.token })
            .select()
            .exec(function (err, user) {
                if (err) {
                    callback({ success: false, error: true, message: "Internal server error", errors: err });
                }
                if (!user) {
                    callback({ success: false, error: true, message: "Session Expired", result: {} });
                } else if (user) {
                    callback({ success: true, error: false, message: "User access granted", result: user });
                }
            });
    },
    me: (decoded, callback) => {
        User.findOne({ _id: decoded.id })
            .exec(function (err, user) {
                if (err) {
                    callback({ success: false, error: true, status: 0, message: "Internat DB error", errors: err });
                }
                if (!user) {
                    callback({ success: false, error: true, status: 0, message: "user doesn't exist" });
                } else {
                    callback({
                        success: true,
                        error: false,
                        status: 1,
                        message: "my details",
                        result: user
                    });
                }
            });
    }
};
module.exports = UserService;