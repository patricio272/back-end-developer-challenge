const request = require('supertest');
const express = require('express');
const router = require('./routes');

const app = express();
app.use(express.json());
app.use(router);

describe('POST /deal-damage', () => {
    it('returns 400 when damage is not numeric', async () => {
        const res = await request(app)
            .post('/deal-damage')
            .send({ damage: 'not numeric', damageType: 'thunder' });
        expect(res.statusCode).toEqual(400);
    });

    it('returns 400 when damageType is not a string', async () => {
        const res = await request(app)
            .post('/deal-damage')
            .send({ damage: 10, damageType: 123 });
        expect(res.statusCode).toEqual(400);
    });

    it('returns 200 when valid damage and damageType are provided', async () => {
        const res = await request(app)
            .post('/deal-damage')
            .send({ damage: 10, damageType: 'thunder' });
        expect(res.statusCode).toEqual(200);
    });
});

describe('POST /heal', () => {
    it('returns 400 when healAmount is not numeric', async () => {
        const res = await request(app)
            .post('/heal')
            .send({ healAmount: 'not numeric' });
        expect(res.statusCode).toEqual(400);
    });

    it('returns 200 when valid healAmount is provided', async () => {
        const res = await request(app)
            .post('/heal')
            .send({ healAmount: 10 });
        expect(res.statusCode).toEqual(200);
    });
});

describe('POST /add-temp-hp', () => {
    it('returns 400 when tempHP is not numeric', async () => {
        const res = await request(app)
            .post('/add-temp-hp')
            .send({ tempHP: 'not numeric' });
        expect(res.statusCode).toEqual(400);
    });

    it('returns 200 when valid tempHP is provided', async () => {
        const res = await request(app)
            .post('/add-temp-hp')
            .send({ tempHP: 10 });
        expect(res.statusCode).toEqual(200);
    });
});