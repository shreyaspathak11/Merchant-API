const mongoose = require('mongoose');

// Merchant Schema
const merchantSchema = new mongoose.Schema({
    storeID: { type: String, required: true },
    merchantName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    commission: { type: Number, required: true },             //commission in percentage (assumed)
    createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Merchant', merchantSchema);
