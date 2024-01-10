const shopModel = require('../models/shop.model')
const bcrypt = require("bcrypt")
const crypto = require('crypto');

const RoleShop = {
    SHOP : 'SHOP',
    WRITE : 'WRITER',
    EDITOR :  'EDITOR',
    ADMIN : 'ADMIN',
}
class AccessService {
    static signUp = async ({name , email , password}) => {
        try {
            console.log("123")
            const holderShop = await shopModel.findOne({email}).lean()
            console.log(holderShop)
            if(holderShop){
                return {
                    code : 'xxxx',
                    message : 'Shop already registered',
                    status : 'error'
                }
            }
            const passwordHash = bcrypt.hash(password , 10);
            const newShop = await shopModel.create({
                name , email , password : passwordHash , role : [RoleShop.SHOP]
            })  
            if(newShop){
                const {privateKey , publicKey} = crypto.generateKeyPairSync('rsa' , {
                    modulusLength : 4096
                })
                console.log({privateKey, publicKey})
            }

        } catch (error) {
            return {
                code : 'xxxx',
                message : error.message,
                status : 'error'
            }
        }
    }
}

module.exports = AccessService