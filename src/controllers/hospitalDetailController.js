const hospital = require('../models/hospitalSchema')

module.exports.hospitalDetailController = async (req, res) => {
    try{
        const requestedHospitalCode = Number(req.params.id)

        const datas = await hospital.aggregate([
            {
                $match: {
                    "hospitalCode": requestedHospitalCode
                },
            },
            {
                $unwind: "$totalVacsinStorage"
            },
            {
                $lookup: {
                    from: "vaccination_data",
                    localField: "totalVacsinStorage.code",
                    foreignField: "code",
                    as: "hospital_vaccine_information"
                }
            },
            {
                $lookup: {
                    from: "citizen",
                    localField: "totalVacsinStorage.code",
                    foreignField: "vaccinations.code",
                    let: { code: requestedHospitalCode, status: true },
                    pipeline: [ 
                        {
                            $match: {
                                $expr: { $eq: [ "$$code", "$lastHospitalCode" ] },
                            }
                        } 
                    ],
                    as: "hospital_citizen_matches"
                 }
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    address: {
                        $concat: ['$address.city', ', ', '$address.country', ', ', {
                            $toString: '$address.zipcode'
                        }]
                    },
                    totalVaccineStorage:{
                        name: '$hospital_vaccine_information.name',
                        code: '$totalVacsinStorage.code',
                        people: '',
                        count: '$totalVacsinStorage.count'
                    },
                    remainingVaccine:{
                        name: '$hospital_vaccine_information.name',
                        code: '$bookedSlot.code',
                        count: '$bookedSlot.count',
                        remain: ''
                    },
                    hospital_citizen_matches: 1
                }
            }
        ])

        counter = 0
        datas.forEach(data => {
            if(data['hospital_citizen_matches'].length){
                data['hospital_citizen_matches'].map(
                    citizen => {
                        totalTrues = citizen['vaccinations'].filter(
                            vaccine_status => vaccine_status['code']==data['totalVaccineStorage']['code'] && vaccine_status['isVaccinated']
                        )
                        counter += totalTrues.length
                    }
                )

                data['totalVaccineStorage']['people'] = counter
                counter = 0

                if(data['totalVaccineStorage']['code'] == data['remainingVaccine']['code']){
                    data['remainingVaccine']['remain'] = data['totalVaccineStorage']['count'] - data['remainingVaccine']['count']
                }
                else{
                    data['remainingVaccine']={}
                }
                delete data['hospital_citizen_matches']
                delete data['remainingVaccine']['count']
                delete data['totalVaccineStorage']['count']
            }
            else{
                if(data['totalVaccineStorage']['code'] == data['remainingVaccine']['code']){
                    data['remainingVaccine']['remain'] = data['totalVaccineStorage']['count'] - data['remainingVaccine']['count']
                }
                else{
                    data['remainingVaccine']={}
                }
                delete data['hospital_citizen_matches']
                delete data['totalVaccineStorage']['count']
            }
        })


        res.status(200).json({
            status: 'success',
            data: datas
        })
    }
    catch(err){ 
        res.status(400).json({
            status: 'failed',
            data: err
        })
    }
  };