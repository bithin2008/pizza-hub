var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate-v2'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');
require('mongoose-long')(mongoose);
const moment = require('moment')
let time = moment().utc().valueOf();
var uuidv4 = require('uuid/v4')
var usersSchema = new Schema({
    _id: { type: String, required: true, default: uuidv4 },
    name: { type: String, required: true },
    email: { type: String, createIndexes: { unique: true } },
    mobile: { type: String, default: null },
    address: { type: String, default: null },
    address2: { type: String, default: null },
    state: { type: String, default: null },
    zip: { type: String, default: null },
    country: { type: String, default: null },
    isLoggedIn: { type: Boolean, default: false },
    lastLogin: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
    userAgent: { type: Schema.Types.Mixed, default: null },
    authtoken: { type: String },
    _createdAt: { type: mongoose.Schema.Types.Long, default: function () { return time } },
    _updatedAt: { type: mongoose.Schema.Types.Long, default: function () { return time } },
    _t: { type: mongoose.Schema.Types.Long, default: function () { return time } },
    v1: { type: Boolean, default: true }
}, {
    timestamps: { createdAt: '_created', updatedAt: '_updated' },
    typecast: true
});
usersSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) { return next(); }
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) { return next(err); }
        user.password = hash;
        next();
    });
});
usersSchema.methods.comparePassword = function (password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
}
usersSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Users', usersSchema);