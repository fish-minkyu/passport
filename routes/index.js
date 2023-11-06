const express = require('express')
const router = express.Router()
const authRouter = require('./auth')

router.use('/test', authRouter)

module.exports = router