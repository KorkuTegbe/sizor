const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')


// let mongo = new MongoMemoryServer({
//     instance: {
//         debug: true,
//     }
// })

let mongo = null;

const connectDB = async () => {
    mongo = await MongoMemoryServer.create();
    console.log(`mms instance: ${mongo}`)
    const uri = mongo.getUri();

    await mongoose.connect(uri, {
        useNewUrlParser : true,
        useUnifiedTopology: true
    });
};

connectDB()

const dropDB = async () => {
    if(mongo){
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongo.stop();
    }
}

const dropCollections = async () => {
    if(mongo){
        const collections = await mongoose.connection.db.collections;
        for (let collection of collections){
            await collection.remove();
        }
    }
}


module.exports = {
    connectDB, dropDB, dropCollections
}