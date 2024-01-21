const shopModel = require('../models/shop.model')
const KeyTokenSerivce = require('../services/keyToken.service')
const {createTokenPair} = require('../auth/authUtils')
const bcrypt = require("bcrypt")
const crypto = require('node:crypto');
const {getInfoData} = require('../utils/index')
const RoleShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}
class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            console.log("123")
            const holderShop = await shopModel.findOne({ email }).lean()
            console.log("holderShop : " , holderShop)
            if (holderShop) {
                return {
                    code: 'xxxx',
                    message: 'Shop already registered',
                    status: 'error'
                }
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
                    userId : newShop._id,
                    publicKey,
                    privateKey
                })
                if(!keyStore) {
                    return {
                        code : "xxxx",
                        message : "keyStore error"
                    }
                }
                // create token pair
                const tokens = await createTokenPair({userId : newShop._id, email} , publicKey , privateKey)
                console.log('Created Token success' , tokens)
                return {
                    code : 201,
                    metadata : {
                        shop : getInfoData({fileds : ['_id' , 'email' , 'name'], object : newShop}),
                        tokens
                    }
                }
            }
            return {
                code : 200,
                metadata : null
            }

        } catch (error) {
            console.log(error)
            return {
                code: 'xxxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService