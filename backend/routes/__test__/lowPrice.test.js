import lowPriceRouter from '../lowPrice';
import { sendMsgByBot, getBotIdToken } from '../lowPrice';
import request from 'supertest';
import express from 'express';
import chatIdRouter from '../chatId';

const app = express();
app.use(express.json());
app.use('/chat-id', chatIdRouter);


describe('/lowPriceRouter API', () => {

    describe('test function', () => {
        // Test get bot id and token
        it('should return bot id and token', async () => {
            // Create bot id and token with /chat-id
            const botRes = await request(app).post('/chat-id').send({
                chat_id: '123456789',
                token: '1234ABCD5678',
            })
            expect(botRes.statusCode).toBe(200);

            // Get bot id and token
            const botIdToken = await getBotIdToken();

            expect(botIdToken).toHaveProperty('chat_id');
            expect(botIdToken).toHaveProperty('token');
        })
        
    })


})