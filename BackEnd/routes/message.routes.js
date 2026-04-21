const express = require('express');
const router = express.Router();
const {sendMessage} = require('../controllers/message.controller')

router.post('/',sendMessage)

module.exports = router;