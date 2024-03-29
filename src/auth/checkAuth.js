const { findById } = require('../services/apiKey.service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
}

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: 'Forbiddn error1'
            })
        }
        // check objKey
        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden error2'
            })
        }
        req.objKey = objKey;
        return next();
    } catch (error) {

    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'permission denieded',
            })
        }
        console.log('permissions: ' + req.objKey.permissions);
        if (!req.objKey.permissions.includes(permission)) {
            return res.status(403).json({
                message: 'Forbidden error4'
            })
        }
        return next();
    }
}

module.exports = {
    apiKey,
    permission
}