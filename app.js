'use strict';
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const port = 3000;

const passport = require('./utils/pass');
const authRoute = require('./routes/authRoute');
const photoRoute = require('./routes/photoRoute');
const userRoute = require('./routes/userRoute');

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));
app.use(express.static('uploads'));

app.use('/auth', authRoute);
app.use('/photo', passport.authenticate('jwt', {session: false}), photoRoute); //passport.authenticate('jwt', {session: false}),
app.use('/user',  passport.authenticate('jwt', {session: false}), userRoute); //passport.authenticate('jwt', {session: false}),

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
