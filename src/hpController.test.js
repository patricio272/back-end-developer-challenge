jest.clearAllMocks();
jest.mock('fs');

const data = {
    name: "Briv",
    hitPoints: 50,
    defenses: [{
        type: 'fire',
        defense: 'immunity'
    }, {
        type: 'slashing',
        defense: 'resistance'}
    ]
};

const fs = require('fs');
fs.readFileSync.mockReturnValue(JSON.stringify(data));

const { dealDamage, heal, addTemporaryHP } = require('./hpController');



describe('HP Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deals damage correctly', async () => {
        const req = { body: { damage: 10, damageType: 'thunder' } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        const next = jest.fn();

        await dealDamage(req, res, next);

        expect(res.send).toHaveBeenCalledWith({ message: 'Damage dealt', character: {
                hitPoints: 40,
                name: 'Briv',
                temporaryHP: 0
            } });
    });

    it('returns 400 when damage type is invalid', async () => {
        const req = { body: { damage: 10, damageType: 'invalid' } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        const next = jest.fn();

        await dealDamage(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({ message: 'Invalid damage type' });
    });

    it('deals no damage when character is immune', async () => {
        const req = { body: { damage: 10, damageType: 'fire' } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        const next = jest.fn();

        await dealDamage(req, res, next);

        expect(res.send).toHaveBeenCalledWith({ message: 'Damage dealt', character: {
                hitPoints: 40,
                name: 'Briv',
                temporaryHP: 0
            } });
    });

    it('deals half damage when character has resistance', async () => {
        const req = { body: { damage: 10, damageType: 'slashing' } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        const next = jest.fn();

        await dealDamage(req, res, next);

        expect(res.send).toHaveBeenCalledWith({ message: 'Damage dealt', character: {
                hitPoints: 35,
                name: 'Briv',
                temporaryHP: 0
            } });
    });

    it('heals correctly', async () => {
        const req = { body: { healAmount: 10 } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await heal(req, res, next);

        expect(res.send).toHaveBeenCalledWith({ message: 'Character healed', character: {
                hitPoints: 45,
                name: 'Briv',
                temporaryHP: 0
            } });
    });

    it('adds temporary HP correctly', async () => {
        const req = { body: { tempHP: 10 } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await addTemporaryHP(req, res, next);

        expect(res.send).toHaveBeenCalledWith({ message: 'Temporary HP added', character: {
                hitPoints: 45,
                name: 'Briv',
                temporaryHP: 10
            } });
    });

    it('does not add temporary HP if current temporary HP is higher', async () => {
        const req = { body: { tempHP: 5 } };
        const res = { send: jest.fn() };
        const next = jest.fn();

        await addTemporaryHP(req, res, next);

        expect(res.send).toHaveBeenCalledWith({ message: 'Temporary HP added', character: {
                hitPoints: 45,
                name: 'Briv',
                temporaryHP: 10
            } });
    });

    it('returns 400 when character is already dead', async () => {
        let req = { body: { damage: 100, damageType: 'thunder' } };
        let res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        let next = jest.fn();

        await dealDamage(req, res, next);

        expect(res.send).toHaveBeenCalledWith({ message: 'Damage dealt and character is dead', character: {
            hitPoints: 0,
                name: 'Briv',
                temporaryHP: 0
            } });

        req = { body: { damage: 100, damageType: 'thunder' } };
        res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        next = jest.fn();

        await dealDamage(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({ message: 'Character is already dead' });
    });
});