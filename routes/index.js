import express from 'express'
import account from './account'
import scrapping from './scrapping'

var router = express.Router()

router.use('/account', account)
router.use('/scrapping', scrapping)

export default router
