const Redis = require('redis')


class Cache {
    constructor(){
        this.redis = null
    }

    async connect() {
       try{
            this.redis = Redis.createClient()

            this.redis.connect()

            this.redis.on('connect', () => {
                console.log('Redis connected...')
            })

            this.redis.on('error', () => {
                console.log('Redis connection error')
            })
       }catch(err){
            console.log(err)
       }
    }
}

const instance = new Cache()

module.exports = instance