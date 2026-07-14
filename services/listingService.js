import 'dotenv/config'
import prisma from "../config/db.js"


export const createListing = async({title, description, price, categoryId, userId}) => {
    const newListing = await prisma.skillListing.create({
        data: {
            title,
            description,
            price,
            categoryId,
            userId
        }
    })
    return newListing;
}

// export const getAllListings = async () => {
//     const allListings = await prisma.skillListing.findMany({
//         where: {available: true},
//         //including related data
//         include: {
//             user: {
//                 select: { id: true, name: true, bio: true} //select let's us return only specific fields (don't wanna return the password/email)
//             },
//             category: true
//         }
//     })
//     return allListings;
// }

export const getAllListings = async ({page, limit, category, search, minPrice, maxPrice}) => {
    const pageNum = parseInt(page) || 1
    const limitNum = parseInt(limit) || 10
    const where = {
        available: true,
        ...(search && {
            title: { contains: search, mode: 'insensitive' }
        }),
        ...(category && { categoryId: category }),
        ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
        ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
    }
    const allListings = await prisma.skillListing.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        //including related data
        include: {
            user: {
                select: { id: true, name: true, bio: true} //select let's us return only specific fields (don't wanna return the password/email)
            },
            category: true
        }
    })
    
    const total = await prisma.skillListing.count({
        where
    })
    return [ allListings, total ];
}

export const getListingById = async (id) => {
    const listing = await prisma.skillListing.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true, name: true, bio: true
                }
            },
            category: true
        }
    })

    if (!listing) {
        throw new Error("Listing doesn't exist")
    }
    return listing
}

export const updateListing = async (id, { title, description, price, available }) => {
    const listing = await prisma.skillListing.findUnique({
        where: { id }
    })

    if (!listing) {
        throw new Error("Listing doesn't exist")
    }

    const updatedListing = await prisma.skillListing.update({
        where: { id },
        data: {
            title, description, price, available
        }
    })
    return updatedListing
}

export const deleteListing = async (id) => {
    const listing = await prisma.skillListing.findUnique({
        where: { id }
    })

    if (!listing) {
        throw new Error("Listing doesn't exist")
    }

    await prisma.skillListing.delete({
        where: { id }
    })
    return {message: 'Listing deleted successfully'}
}