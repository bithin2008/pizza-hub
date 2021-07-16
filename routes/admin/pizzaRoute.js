"use strict";
var express = require('express');
var pizzaService = require('../../services/pizzaService');
var adminService = require('../../services/adminService');
var PizzaRoute = express.Router();
/******************************
*  Middleware to check admin
******************************/
PizzaRoute.use(function (req, res, next) {
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
 *  Create Pizza
 *  @method: POST
 *  @request params:
 *      name
 *      description
 *      price
 *      displayOrder
 *      image
 *      isActive
 *  @url: /admin/pizza/create
 ********************************/
PizzaRoute.post('/create', function (req, res) {
    var files = req.files;
    var data = req.body;
    pizzaService.createPizza(data,files,function (response) {
        res.json(response);
    });
});
/******************************
 *  Update
 *  @method: PUT
 *  @request params:
 *      name
 *      description
 *      price
 *      displayOrder
 *      image
 *      isActive
 *  @url: /admin/pizza/:pizzaId
 ********************************/
PizzaRoute.put('/:pizzaId', function (req, res) {
    var files = req.files;
    var data = req.body;
    var pizzaId = req.params.pizzaId;
    pizzaService.update(pizzaId, data,files,function (response) {
        res.json(response);
    });
});
/******************************
 *  Get All pizza
 *  @method: GET
 *  @request params:
 *      page
 *      limit
 *      sortby
 *  @url: /admin/pizza
 ****************************************/
PizzaRoute.get('/', function (req, res) {
    pizzaService.getAllPizza(req.query, function (response) {
        res.json(response);
    });
});
module.exports = PizzaRoute;