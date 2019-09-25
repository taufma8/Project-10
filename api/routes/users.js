const express = require('express');
const router = express.Router(); 
var sqlite3 = require('sqlite3');
const { User } = require('../models');
const bcryptjs = require('bcryptjs');
const authenticateUser = require('../authenticationUser');
const { check } = require('express-validator');
const { validationResult } = require('express-validator');

// Route that returns the current authenticated user.
router.get('/', authenticateUser, (req, res) => {
    const user = req.currentUser;
    console.log(user);
    res.json({
        id: user.dataValues.id,
        name: user.dataValues.firstName + " " + user.dataValues.lastName,
        username: user.dataValues.emailAddress,

    });
});

// // Route that creates a new user.
// **Includes email valid & already existing features for extra credit
router.post('/', [
    check('firstName')
        .exists({
            checkNull: true,
            checkFalsy: true
        })
        .withMessage('Please provide a value for the "first name"'),
    check('lastName')
        .exists({
            checkNull: true,
            checkFalsy: true
        })
        .withMessage('Please provide a value for the "last name"'),
    check('emailAddress')
        .exists({
            checkNull: true,
            checkFalsy: true
        })
        .withMessage('Please provide a value for the "email address"')
        .if((val, { req }) => req.body.emailAddress)
        .isEmail()
        .withMessage('Please provide a valid "email address"')
        .custom(async (val, { req }) => {
            const emailAddressExists = await User.findAll({ where: { emailAddress: val } });
//Extra credit-feature email already exist
            if (emailAddressExists.length !== 0) {
                throw new Error('Your selected email address already exists');
            }


            return true;
        }),
    check('password')
        .exists({
            checkNull: true,
            checkFalsy: true
        })
        .withMessage('Please provide a value for "password"'),
], async (req, res, next) => {
    // Attempt to get the validation result from the Request object.
    const errors = validationResult(req);

    // If there are validation errors...
    if (!errors.isEmpty()) {
        // Use the Array `map()` method to get a list of error messages.
        const errorMessages = errors.array().map(error => error.msg);

        // Return the validation errors to the client.
        return res.status(400).json({
            errors: errorMessages
        });
    }

    // Set the firstName, lastName & email address.
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const emailAddress = req.body.emailAddress;
    const password = bcryptjs.hashSync(req.body.password);

    // Add the user to the database.
    try {
        await User.create({
            firstName,
            lastName,
            emailAddress,
            password

        });

        // Set the status to 201 Created and end the response.
        return res.location('/').status(201).end();
    } catch (error) {
        error.message = error.errors.map(value => value.message);
        error.status = 400;

        next(error);
    }
});

module.exports = router;

