import { z } from 'zod'


export const globalHandler = (err, req, res, next) => {

    console.error(err)

    if (err instanceof z.ZodError) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: err.errors
        })
    }
    return res.status(err.status || 500).json({
        message: err.message || 'Server error'
    })
}