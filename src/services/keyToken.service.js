const keytokenModel = require('../models/keytoken.model')

class KeyTokenSerivce {
    static createKeyToken = async({userId, publicKey, privateKey}) => {
        try {
            const tokens = await keytokenModel.create({
                user : userId,
                publicKey,
                privateKey
            })
            console.log("tokens::::::" , tokens.publicKey);
            return tokens ? tokens.publicKey : null 
        } catch (error) {
            return error
        }
    }
}


module.exports = KeyTokenSerivce;