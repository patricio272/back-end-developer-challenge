const fs = require('fs');
const path = require('path');

const config = require('../config');

const characterDataPath = path.join(__dirname, '../briv.json');
let characterData = JSON.parse(fs.readFileSync(characterDataPath));
characterData.temporaryHP = 0;

const dealDamage = async (req, res, next) => {
    try {
        const { damage, damageType } = req.body;

        if (!config.DAMAGE_TYPES.includes(damageType)) {

            return res.status(400).send({ message: 'Invalid damage type' });
        }

        if (characterData.hitPoints === 0) {
            return res.status(400).send({ message: 'Character is already dead' });
        }

        let effectiveDamage = damage;
        let defense = characterData.defenses.find(defense => defense.type === damageType)?.defense;

        if (defense) {
            switch (defense) {
                case 'immunity':
                    effectiveDamage = 0;
                    break;
                case 'resistance':
                    effectiveDamage = Math.floor(damage / 2);
                    break;
            }
        }

        if (characterData.temporaryHP > 0) {
            if (characterData.temporaryHP >= effectiveDamage) {
                characterData.temporaryHP -= effectiveDamage;
                effectiveDamage = 0;
            } else {
                effectiveDamage -= characterData.temporaryHP;
            }
            characterData.temporaryHP = 0;
        }

        characterData.hitPoints = Math.max(0, characterData.hitPoints - effectiveDamage);

        let message = `Damage dealt${characterData.hitPoints === 0 ? ' and character is dead' : ''}`;
        const { name, hitPoints, temporaryHP } = characterData;
        res.send({ message, character: name, hitPoints, temporaryHP });
    } catch (error) {
        next(error);
    }
};

const heal = async (req, res, next) => {
    try {
        const { healAmount } = req.body;

        characterData.hitPoints += healAmount;

        const { name, hitPoints, temporaryHP } = characterData;
        res.send({ message: 'Character healed', character: name, hitPoints, temporaryHP });
    } catch (error) {
        next(error);
    }
};

const addTemporaryHP = async (req, res, next) => {
    try {
        const { tempHP } = req.body;

        characterData.temporaryHP = Math.max(tempHP, characterData.temporaryHP);

        const { name, hitPoints, temporaryHP } = characterData;
        res.send({ message: 'Temporary HP added', character: name, hitPoints, temporaryHP });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    dealDamage,
    heal,
    addTemporaryHP
};