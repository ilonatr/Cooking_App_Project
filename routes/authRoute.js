'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: './uploads/'});
const {body, sanitizeBody} = require('express-validator');
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/register', upload.single('avatar'),
    [
        body('name', 'minimum 3 characters').isLength({min: 3}),
        body('email', 'email is not valid').isEmail(),
        body('password', 'at least one upper case letter').
        matches('(?=.*[A-Z]).{8,}'),
        //sanitizeBody('name').escape(),
    ],
    authController.user_create_post,
);

module.exports = router;