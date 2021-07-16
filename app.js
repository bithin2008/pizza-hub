var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var fileUpload = require('express-fileupload');
const cors = require('cors')
var app = express();
app.use(favicon(__dirname + '/public/favicon.ico'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json({ limit: '500mb', extended: true }));
app.use(bodyParser.json({ limit: '500mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(cors())

app.use(fileUpload());
const routes = [
    { path: "/admin", obj: require('./routes/admin/adminRoute') },
    { path: "/admin/pizza", obj: require('./routes/admin/pizzaRoute') },
    { path: "/admin/order", obj: require('./routes/admin/orderRoute') },
    // { path: "/admin/user", obj: require('./routes/admin/usersRoute') },
    { path: "/api", obj: require('./routes/api/apiRoute') },

];
routes.forEach(rObj => {
    app.use(rObj.path, rObj.obj);
});

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => {
    res.status(200).send({
        message: 'Not found',
    })

});
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;