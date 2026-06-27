import express from'express'
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { createCategory, getCategories } from '../controller/categoryController.js'


const router = express.Router()

router.post('/', protect, restrictTo, createCategory)
router.get('/', getCategories)

export default router