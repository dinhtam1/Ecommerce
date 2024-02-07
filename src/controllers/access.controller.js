const AccessService = require('../services/access.service')
const { OK, CREATED, SuccessResponse } = require('../core/success.response')
class AccessController {
    login = async (req, res, next) => {
        new SuccessResponse({
            message: 'Login successfully',
            metadata: await AccessService.login(req.body)
        }).send(res)
    }
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Created successfully',
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }
    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout successfully',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }
}

module.exports = new AccessController();
