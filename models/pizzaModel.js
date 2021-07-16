var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate-v2'),
    Schema = mongoose.Schema;
require('mongoose-long')(mongoose);
const moment = require('moment')
let time = moment().utc().valueOf();
var uuidv4 = require('uuid/v4');
var PizzaSchema = new Schema({
    _id: { type: String, required: true, default: uuidv4 },
    name: { type: String, required: true },
    description: { type: String, default:null },
    price: { type: Number },
    displayOrder: { type: Number, required: true },
    image: {type: String,default: ''},
    isActive: {type: String,enum: ['YES', 'NO'],default: 'YES'},
    _createdAt: { type: mongoose.Schema.Types.Long, default: function () { return time } },
    _updatedAt: { type: mongoose.Schema.Types.Long, default: function () { return time } },
    _t: { type: mongoose.Schema.Types.Long, default: function () { return time } },
    v1: { type: Boolean, default: true }
}, {
    timestamps: { createdAt: '_created', updatedAt: '_updated' },
    typecast: true
});

PizzaSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Pizzas', PizzaSchema);