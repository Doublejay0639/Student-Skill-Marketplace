import { z } from "zod"
import { createCategory as createCategoryService, getAllCategories as getAllCategoriesService } from "../services/categoryService.js"

const categorySchema = z.object({
    name: z.string().min(5, "too short"),
    slug: z.string()
})


export const createCategory = async (req, res) => {
   try {
    const input = await categorySchema.parse(req.body);

    const newCategory = await createCategoryService(input)
    return res.status(201).json({
        message: 'Category created',
            data: newCategory
    })
   } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Failed to add new Category',
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

export const getCategories = async (req, res) => {
    try {
        const allCategories = await getAllCategoriesService()
        return res.status(200).json({
            message: 'Categories fetched successfully',
            data: allCategories
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            error: error.message
        })
    }
    
}