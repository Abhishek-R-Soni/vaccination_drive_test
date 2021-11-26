const mongoose = require('mongoose');

const citizenDataSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Required First Name'],
    },
    lastName: {
        type: String,
        required: [true, 'Required Last Name'],
    },
    age:{
        type: Number,
        required: [true, 'Age must require'],
    },
    gender: {
        type: String
    },
    address: {
        city: String,
        country: String,
        zipcode: Number    
    },
    phoneNo: {
        type: String
    },
    lastHospitalCode: {
        type: mongoose.Schema.ObjectId, ref: 'hospital', required: true 
    },
    vaccinations: [{
        code: {
            type: mongoose.Schema.ObjectId, ref: 'vaccination_data', required: true 
        },
        date: {
            type: Date,
            default: Date.now()
        },
        isVaccinated: {
            type: Boolean
        }
    }]
});

const citizen = mongoose.model('citizen', citizenDataSchema);

module.exports = citizen;