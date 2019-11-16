import express from 'express'
import account from './account'

var router = express.Router()

router.use('/account', account)

export default router
