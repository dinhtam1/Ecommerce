const mongoose = require('mongoose');
const {db : {host , port , name}} = require('../configs/config.mongodb')
const connectString  = `mongodb://${host}:${port}/${name}`;
console.log(connectString)
class Database {
    constructor () {
        this.connect()
    }
    connect (type = 'mongodb') {
        if(1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', {color : true});
        }
        mongoose.connect( connectString, {
            maxPoolSize : 50
        }).then( _ => 
            console.log('Database connected' )
        )
        .catch(err => console.log('Error connecting'))
    }
    static getInstance(){
        if(!Database.intance) {
            Database.intance = new Database ();
        }
        return Database.intance;
    }
}
const instanceMongodb =  Database.getInstance();
module.exports  = instanceMongodb;