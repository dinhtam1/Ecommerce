const shopModel = require('../models/shop.model')
const KeyTokenSerivce = require('../services/keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const bcrypt = require("bcrypt")
const crypto = require('node:crypto');
const { getInfoData } = require('../utils/index');
const { BadRequestError, ConflictRequestError, AuthFailureError } = require('../core/error.response');
const { findByEmail } = require('../services/shop.service')

const RoleShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}
class AccessService {
    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new BadRequestError('Shop not already registered')
        const match = await bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError('Authentication failed')
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        const { _id: userId } = foundShop
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)
        await KeyTokenSerivce.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId
        })
        return {
            shop: getInfoData({ fileds: ['_id', 'email', 'name'], object: foundShop }),
            tokens
        }
    }
    static signUp = async ({ name, email, password }) => {
        const holderShop = await shopModel.findOne({ email }).lean()
        console.log("holderShop ", holderShop)
        if (holderShop) {
            throw new BadRequestError('Error : Shop already registered!')
        }
        console.log("password ", password)
        const passwordHash = await bcrypt.hash(password, 10);
        console.log("passwordHash ", passwordHash)
        const newShop = await shopModel.create({
            name, email, password: passwordHash, role: [RoleShop.SHOP]
        })
        if (newShop) {
            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')
            console.log('privateKey ===============', privateKey)
            console.log('publicKey ================', publicKey)
            // save publickey to database
            const keyStore = await KeyTokenSerivce.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })
            if (!keyStore) {
                throw new BadRequestError("keyStore error")
            }
            // create token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
            console.log('Created Token success', tokens)
            return {
                code: 201,
                metadata: {
                    shop: getInfoData({ fileds: ['_id', 'email', 'name'], object: newShop }),
                    tokens
                }
            }
        }
        return {
            code: 200,
            metadata: null
        }
    }
    static logout = async (keyStore) => {
        const delkey = await KeyTokenSerivce.removeKeyById(keyStore._id);
        console.log("delkey", delkey)
        return delkey
    }
}

module.exports = AccessService