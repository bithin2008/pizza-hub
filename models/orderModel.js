var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;
require('mongoose-long')(mongoose);
const moment = require('moment')
let time = moment().utc().valueOf();
var uuidv4 = require('uuid/v4')
var OrderSchema = new Schema({
    _id: { type: String, required: true, default: uuidv4 },
    _createdAt: { type: mongoose.Schema.Types.Long, default: function () { return time } },
    _updatedAt: { type: mongoose.Schema.Types.Long, default: function () { return time } },
    _t: { type: mongoose.Schema.Types.Long, default: function () { return time } }
}, {
    strict: false,
    versionKey: false,
    timestamps: { createdAt: '_created', updatedAt: '_updated' },
    typecast: true
});
OrderSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Orders', OrderSchema);
