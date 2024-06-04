const express = require('express');
const { check, validationResult} = require('express-validator');
const hpController = require('./hpController');

const router = express.Router();

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post('/deal-damage', [
    check('damage').isNumeric(),
    check('damageType').isString(),
    validateRequest
], hpController.dealDamage);

router.post('/heal', [
    check('healAmount').isNumeric(),
    validateRequest
], hpController.heal);

router.post('/add-temp-hp', [
    check('tempHP').isNumeric(),
    validateRequest
], hpController.addTemporaryHP);

module.exports = router;