const mongoose = require('mongoose');

const hospitalDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Required Name'],
    },
    hospitalCode: {
        type: Number,
        required: [true, 'Required Valid Code'],
    },
    address: {
        city: String,
        country: String,
        zipcode: Number    
    },
    totalVacsinStorage: [{
            code: {
                type: mongoose.Schema.ObjectId, ref: 'vaccination_data', required: true 
            },
            count: Number
        }
    ],
    bookedSlot: [{
            code: {
                type: mongoose.Schema.ObjectId, ref: 'vaccination_data', required: true 
            },
            count: Number
        }
    ],
    staffData: [{
        name: String,
        position: String,
        code: Number
    }]
});

const hospital = mongoose.model('hospital', hospitalDataSchema);

module.exports = hospital;