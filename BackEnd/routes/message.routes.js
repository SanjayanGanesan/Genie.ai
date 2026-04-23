const express = require('express');
const router = express.Router();
const {sendMessage} = require('../controllers/message.controller');
const {receiveMessage} = require('../controllers/message.controller');

router.post('/', sendMessage);
router.get('/:conversationId', receiveMessage);


module.exports = router;