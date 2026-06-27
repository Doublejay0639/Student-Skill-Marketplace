import 'dotenv/config'
import prisma from "../config/db.js"

export const createCategory = async ({name, slug}) => {
    const newCategory = await prisma.category.create({
        data: { name, slug } 
    })
    return newCategory
}

export const getAllCategories = async () => {
    const categories = await prisma.category.findMany({
        include: {
            listings: true
        }
    })
    return categories
}