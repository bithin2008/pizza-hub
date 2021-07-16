var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
require('mongoose-long')(mongoose);
const moment = require('moment')
let time = moment().utc().valueOf();
var uuidv4 = require('uuid/v4')
var AdminSchema = new Schema({
    _id: { type: String, required: true, default: uuidv4 },
    email: { type: String, required: true },
    password: { type: String, required: true },
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    phone_number: { type: String, default: null },
    is_admin: { type: Boolean, default: false },
    is_logged_in: { type: Boolean, default: false },
    last_login: { type: Date, default: null },
    is_active: { type: Boolean, default: true },
    authtoken: { type: String },
    _createdAt: { type: mongoose.Schema.Types.Long, default: function() { return time } },
    _updatedAt: { type: mongoose.Schema.Types.Long, default: function() { return time } },
    _t: { type: mongoose.Schema.Types.Long, default: function() { return time } },
    v1: { type: Boolean, default: true }
}, {
    //timestamps: true,        // will automatically add createdAt and updatedAt
    timestamps: { createdAt: '_created', updatedAt: '_updated' },
    typecast: true
});
AdminSchema.pre('save', function(next) {
    var admin = this;
    console.log(admin);
    if (!admin.isModified('password')) return next();
    bcrypt.hash(admin.password, null, null, function(err, hash) {
        if (err) {
            return next(err);
        }
        admin.password = hash;
        next();
    });
});
AdminSchema.methods.comparePassword = function(password) {
    var admin = this;
    return bcrypt.compareSync(password, admin.password);
}
module.exports = mongoose.model('Admin', AdminSchema);