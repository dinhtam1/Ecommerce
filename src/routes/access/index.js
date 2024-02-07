const express = require('express');
const router = express.Router()
const AccessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
router.post('/shop/signup', asyncHandler(AccessController.signUp))
router.post('/shop/login', asyncHandler(AccessController.login))
router.use(authentication)
router.post('/shop/logout', asyncHandler(AccessController.logout))
module.exports = router