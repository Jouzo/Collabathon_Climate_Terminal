import express from 'express'
import * as account from '../src/back/account/account'
import { register } from '../src/back/account/register'
import { login } from '../src/back/account/login'
import { getFields } from './middleware/upload'

var router = express.Router()

router.get('/logout', account.logout)
router.post('/login', login)
router.post('/register', getFields, register)
router.get('/connected', account.connected)

export default router
