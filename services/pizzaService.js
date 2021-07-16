var Pizza = require('../models/pizzaModel');
var fs = require('fs');
var mv = require('mv');
var pizzaService = {
    /*****************************
    *  For Admin
    ******************************/
    createPizza: (data, fileData, callback) => {
        var pizzaData = new Pizza(data);
        pizzaData.save(function (err, result) {
            if (err) {
                callback({ success: false, error: true, message: "some error occurred", errors: err });
            } else {
                if (fileData != null) {
                    var dir = `./public/uploads/pizza-images`;
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    if (fileData.image != null) {
                        pizzaImage = fileData.image;
                        var imageext = pizzaImage.name.slice(pizzaImage.name.lastIndexOf('.'));
                        var pizzafileName = `${result._id}${imageext}`;
                        pizzaImage.mv('./public/uploads/pizza-images/' + pizzafileName, function (err) {
                            if (err) {
                                pizzafileName = null;
                            }
                        });
                    }
                    Pizza.updateOne({ _id: result._id }, { image: pizzafileName }, { upsert: false }, function (err, affected) {
                        if (err) {
                            callback({
                                success: false,
                                message: err
                            });
                        } else {
                            callback({ success: true, error: false, message: "Pizza added successfully" });
                        }
                    });
                } else {
                    callback({ success: true, error: false, message: "Pizza added successfully" });
                }
            }
        });
    },
    update: (pizzaId, data, fileData, callback) => {
        Pizza.findById(pizzaId, function (err, result) {
            if (err) {
                callback({ success: false, error: true, message: "invalid pizza id", errors: err });
            } else {
                if (!data.name || data.name == "") {
                    callback({ success: false, error: true, message: "Provide pizza name" });
                } else {
                    var query = { _id: pizzaId },
                        fields = data,
                        options = { upsert: false };
                    Pizza.updateOne(query, fields, options, function (err, affected) {
                        if (err) {
                            callback({ success: false, error: true, message: "some error occurred", errers: err });
                        } else {
                            if (fileData != null) {
                                var dir = `./public/uploads/pizza-images`;
                                if (!fs.existsSync(dir)) {
                                    fs.mkdirSync(dir);
                                }
                                if (fileData.image != null) {
                                    var pizzafileName = '';
                                    if (result.image != '' && result.image != null) {
                                        fs.stat('./public/uploads/pizza-images/' + result.image, function (err, stats) {
                                            if (err) {
                                                return console.error(err);
                                            }
                                            fs.unlink('./public/uploads/pizza-images/' + result.image, function (err) {
                                                if (err) {
                                                    return console.log(err);
                                                } else {
                                                    pizzaImage = fileData.image;
                                                    var imageext = pizzaImage.name.slice(pizzaImage.name.lastIndexOf('.'));
                                                    pizzafileName = `${result._id}${imageext}`;
                                                    pizzaImage.mv('./public/uploads/pizza-images/' + pizzafileName, function (err) {
                                                        if (err) {
                                                            pizzafileName = null;
                                                        }
                                                    });
                                                }
                                            });
                                        });
                                    } else {
                                        pizzaImage = fileData.image;
                                        var imageext = pizzaImage.name.slice(pizzaImage.name.lastIndexOf('.'));
                                        pizzafileName = `${result._id}${imageext}`;
                                        pizzaImage.mv('./public/uploads/pizza-images/' + pizzafileName, function (err) {
                                            if (err) {
                                                pizzafileName = null;
                                            }
                                        });
                                    }
                                    Pizza.updateOne({ _id: result._id }, { image: pizzafileName }, { upsert: false }, function (err, affected) {
                                        if (err) {
                                            callback({
                                                success: false,
                                                message: err
                                            });
                                        } else {
                                            callback({ success: true, error: false, message: "Pizza updated successfully" });
                                        }
                                    });
                                }

                            }
                            else {
                                callback({ success: true, error: false, message: "Pizza updated successfully" });
                            }
                        }
                    });
                }
            }
        });
    },
    getAllPizza: (params, callback) => {
        var page = 1,
            limit = 5,
            sort_field = 'displayOrder';
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
        Pizza.paginate(query, { sort: sortObj, page: page, limit: limit }, function (err, result) {
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
    getPizzas: (params, callback) => {
        var query = { isActive: 'YES' };
        if (params.ids) {
            var idsArray = params.ids.split(',');
            query._id = { $in: idsArray }
        }
        Pizza.find(query)
            .select()
            .sort({
                displayOrder: 'asc'
            })
            .exec(function (err, result) {
                if (err) {
                    callback({ success: false, error: true, errers: err });
                } else {
                    callback({ success: true, error: false, results: result });
                }
            });
    },
}
module.exports = pizzaService;