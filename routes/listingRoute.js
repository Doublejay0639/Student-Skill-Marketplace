import express from 'express'
import { protect } from "../middlewares/authMiddleware.js";
import {
    createListing,
    getListings,
    fetchListingById,
    updateListing,
    deleteListing
} from "../controller/listingController.js"


const router = express.Router()

router.post('/', protect, createListing)
router.get('/', getListings)
router.get('/:id', fetchListingById)
router.patch('/:id', protect, updateListing)
router.delete('/:id', protect, deleteListing)

export default router;