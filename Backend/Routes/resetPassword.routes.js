const express = require('express');

const router = express.Router();

const {
    sendResetPassword
} = require('../Controller/resetPassword.controller');



router.post(
    '/send-reset',
    sendResetPassword
);



module.exports = router;