const mongoose = require('mongoose');

const vaccinationDataSchema = new mongoose.Schema({
    code: {
        type: Number,
        required: [true, 'Required Valid Code'],
    },
    name: {
        type: String,
        required: [true, 'Required Name'],
    },
    totalVac: {
        type: Number,
        required: [true, 'Required Number']
    }
});

const vaccination_data = mongoose.model('vaccination_data', vaccinationDataSchema);

module.exports = vaccination_data;