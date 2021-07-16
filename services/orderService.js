var Order = require('../models/orderModel');
var User = require('../models/userModel');
var async = require("async");
var randomString = require('randomstring');
var orderService = {
    /*****************************
    *  For Admin
    ******************************/
    update: (orderId, data, callback) => {
        Order.findById(orderId, function (err, result) {
            if (err) {
                callback({ success: false, error: true, message: "invalid order id", errors: err });
            } else {
                if (!data.status || data.status == "") {
                    callback({ success: false, error: true, message: "Provide status" });
                } else {
                    var query = { _id: orderId },
                        fields = data,
                        options = { upsert: false };
                    Order.updateOne(query, fields, options, function (err, affected) {
                        if (err) {
                            callback({ success: false, error: true, message: "some error occurred", errers: err });
                        } else {

                            callback({ success: true, error: false, message: "Order updated successfully" });

                        }
                    });
                }
            }
        });
    },
    getAllOrder: (params, callback) => {
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
            sortObj[sort_field] = -1;
        }

        if (params.page) {
            page = parseInt(params.page);
        }
        if (params.pageSize) {
            limit = parseInt(params.pageSize);
        }
        var query = {};
        Order.paginate(query, { sort: sortObj, page: page, limit: limit }, function (err, result) {
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
    createOrder: (paramsData, callback) => {
        async.waterfall([
            function (callback) {
                var userData = paramsData.shippingDetails;
                User.findOne({ $or: [{ 'email': userData.email }, { 'mobile': userData.mobile }] },
                    function (err, docs) {
                        if (err) {
                            callback(err);
                        }
                        else if (docs) {
                            callback(null, docs);
                        } else {
                            var user = new User(userData);
                            user.save(function (err, result) {
                                callback(null, result);
                            });
                        }
                    });

            },
            function (arg1, callback) {
                var orderItems = [];
                paramsData.itemDetails.forEach(element => {
                    var itemObj = {
                        _id: element._id,
                        name: element.name,
                        image: element.image,
                        price: element.price,
                        quantity: element.quantity,
                        itemPrice: element.itemPrice
                    }
                    orderItems.push(itemObj);
                });
                var randomCode = randomString.generate({ length: 20, charset: 'alphanumeric' });
                var orderData = new Order({
                    userId: arg1._id,
                    orderId: randomCode,
                    shippingDetails: paramsData.shippingDetails,
                    items: orderItems,
                    deliveryCharge: paramsData.deliveryCharge,
                    subTotal: paramsData.subTotal,
                    total: paramsData.total,
                    totalQuantity: paramsData.totalQuantity,
                    currency: paramsData.currency,
                    status:'created'

                })
                orderData.save(function (err, result) {
                    callback(null, result);
                });
            },
        ], function (err, result) {
            if (err) {
                callback({ success: false, error: true, status: 0, message: "Internal server error", errors: err });
            } else {
                callback({ success: true, error: false, status: 1, message: "Your order has been placed successfully.", result: result });
            }
        });
    },
    orderHistory: (decoded, params, callback) => {
        var page = 1,
            limit = 25,
            sort_field = '_createdAt';
        var sortObj = {};
        if (params.sortBy) {
            if (params.sortOrder == 'ASC') {
                sortObj[sort_field] = 1;
            } else {
                sortObj[sort_field] = -1;
            }
        } else {
            sortObj[sort_field] = -1;
        }

        if (params.page) {
            page = parseInt(params.page);
        }
        if (params.pageSize) {
            limit = parseInt(params.pageSize);
        }
        var query = { userId: decoded.id };
        Order.paginate(query, { sort: sortObj, page: page, limit: limit }, function (err, result) {
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
    }
}
module.exports = orderService;