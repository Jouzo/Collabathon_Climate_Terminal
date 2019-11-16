import express from 'express'
import { scrapping } from '../src/back/statistics/scrapping'

var router = express.Router()

router.get('/:type', scrapping)

export default router
