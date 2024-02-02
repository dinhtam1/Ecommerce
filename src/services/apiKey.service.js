const apiKeyModel = require('../models/apiKey.model')
const cryto = require('crypto');
const findById = async (key) => {
    const newKey = await apiKeyModel.create({key : cryto.randomBytes(64).toString('Hex'), permissions:['0000']})
    const objKey = await apiKeyModel.findOne({key , status : true})
    return objKey;
}

module.exports = {
    findById,
}