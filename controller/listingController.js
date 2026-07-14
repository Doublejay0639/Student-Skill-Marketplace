import { z } from "zod";
import { createListing as createListingService, getAllListings, getListingById, updateListing as updateListingService, deleteListing as deleteListingService} from "../services/listingService.js";


const ListingSchema = z.object({
    title: z.string().min(2, 'Name too short'),
    description: z.string().min(100, 'Short description'),
    price: z.number().positive('Price must be positive'),
    categoryId: z.string()
})

const UpdateSchema = z.object({
    title: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    available: z.boolean().optional()
})

export const createListing = async(req, res) => {
    try {
        const listingInfo = ListingSchema.parse(req.body);
        const {id: userId} = req.user
        const newListing = await createListingService({...listingInfo, userId});
        return res.status(201).json({
            message: "Listing created successfully",
            data: newListing
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Failed to add Listing',
                errors: error.errors
            })
        } else {
            return res.status(500).json({
                message: 'Server error',
                error: error.message
            })
        }
    }
}

export const getListings = async (req, res) => {
    try {
        const { page, limit, category, search, minPrice, maxPrice } = req.query
        const [listings, total] = await getAllListings({page, limit, category, search, minPrice, maxPrice})

        const totalPages = Math.ceil(total / (parseInt(limit) || 10))

        return res.status(200).json({
            data: listings,
            pagination: { total, page, limit, totalPages }
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            error: error.message
        })
    }   
}

export const fetchListingById = async (req, res) => {
    try {
        const { id } = req.params
        const listings = await getListingById(id)
        return res.status(200).json({
            data: listings
        })
    } catch (error) {
        if (error.message === "Listing doesn't exist") {
            return res.status(404).json({
            message: "Listing doesn't exist",
            error: error.message
        })
        } else {
            return res.status(500).json({
            message: 'Server error',
            error: error.message
        })
        }
    }   
}

export const updateListing = async (req, res) => {
    try {
        const { id } = req.params
        const validated = UpdateSchema.parse(req.body)
        const updated = await updateListingService(id,validated)
        return res.status(200).json({
            data: updated
        })
    } catch (error) {
        if (error.message === "Listing doesn't exist") {
            return res.status(404).json({
            message: "Listing doesn't exist",
            error: error.message
        })
        } else {
            return res.status(500).json({
            message: 'Server error',
            error: error.message
        })
        }
    }
}

export const deleteListing = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await deleteListingService(id)
        return res.status(200).json({
            message: "Listing deleted successfully"
        })
    } 
    catch (error) {
        if (error.message === "Listing doesn't exist") {
            return res.status(404).json({
                message: "Listing doesn't exist",
                error: error.message
            })
        } else {
            return res.status(500).json({
                message: 'Server error',
                error: error.message
            })
        }
    }   
}