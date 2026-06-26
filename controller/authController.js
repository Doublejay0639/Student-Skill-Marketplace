import { z } from "zod";
import { registerUser, loginUser } from "../services/authService.js";

const RegisterSchema = z.object({
    name: z.string().min(2, 'Name too short'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password too short'),
    bio: z.string().optional()
})

const loginSchema = z.object({
    email: z.string().email('Invalid Email'),
    password: z.string().min(6, "password is required")
})


export const register = async(req, res) => {
    try {
        const validated = RegisterSchema.parse(req.body)
        const newUser = await registerUser(validated)
        return res.status(201).json({
            message: "Account created successfully",
            data: newUser
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: error.errors
            })
        } else if (error.message === 'Email already in use') {
            return res.status(409).json({
                message: 'Email already exists',
                error: error.message
            })
        } else {
            return res.status(500).json({
                message: 'Server error',
                error: error.message
            })
            console.log(error.message)
        }
    }
}

export const login = async(req, res) => {
    try {
        const valid = loginSchema.parse(req.body)
        const foundUser = await loginUser(valid)
        return res.status(200).json({
            message: 'Login Successful',
            data: foundUser.user,
            token: foundUser.token
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: error.errors
            })
        }
        else if (error.message === 'Invalid Email or password') {
            return res.status(401).json({
                message: 'Invalid Email or Password',
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