const mongoose = require('mongoose');
// const jest = require('jest')
const URL = require('../models/urlModel');
const { connectDB, dropDB, dropCollections } = require('./db.js')



beforeAll(async () =>{
    await connectDB();
})

afterAll(async () => {
    await dropDB()
})

afterEach(async () => {
    await dropCollections()
})


describe('URL model', () => {
    it('should create or add a new record successfully', async () => {
        let validUrl = {
            urlId: '4weg452',
            originalUrl : 'https://www.makeuseof.com/mongoose-models-test-with-mongo-memory-server/',
            shortUrl : 'http://localhost/4weg452',
        };
        const newUrl = await URL(validUrl);
        await newUrl.save();
        expect(newUrl._id).toBeDefined();
        expect(newUrl.urlId).toBe(validUrl.urlId)
        expect(newUrl.originalUrl).toBe(validUrl.originalUrl)
        expect(newUrl.shortUrl).toBe(validUrl.shortUrl)
    });

    it('should fail for url without required fields', async () => {
        let validUrl = {
            urlId: '4weg452',
            shortUrl : 'http://localhost/4weg452',
        };
        try{
            const newUrl = await URL(validUrl);
            await newUrl.save();
        }catch(err){
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(err.errors.completed).toBeDefined();
        }
    });

    it('should fail for url with fields of wrong type', async () => {
        let validUrl = {
            urlId: 4452,
            originalUrl: { url: 'https://www.makeuseof.com/mongoose-models-test-with-mongo-memory-server/'},
            shortUrl : 'http://localhost/4weg452',
        };
        try{
            const newUrl = await URL(validUrl);
            await newUrl.save();
        }catch(err){
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(err.errors.completed).toBeDefined();
        }
    });
})


