import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/db.js'


export const registerUser = async({name, email, password, bio}) => {
    // check if email exists
    const findUser = await prisma.user.findUnique({
        where: {email}
    })

    // if it exixts, handle it
    if (findUser) {
        throw new Error('email exists')
    }

    //if it doesnt exist, hash password and prepare to store

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: 'STUDENT',
            bio
        }
    })
    const {password: _, ...userWithoutPassword} = newUser
    return userWithoutPassword
}

export const loginUser = async({email, password}) => {
    //find user by email
    const existingUser = await prisma.user.findUnique({
        where: {email}
    })

    if(!existingUser) {
        throw new Error('Invalid Email or password')
    }

    // verify password
    // const enteredPassword = await bcrypt.hash(password);
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if(!isMatch) {
        throw new Error('Invalid Email or password!')
    }

    const token = jwt.sign(
        {id: existingUser.id,
            role: existingUser.role
        },
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
    )
    const { password: _, ...userWithoutPassword } = existingUser
    return {
        token,
        user: userWithoutPassword
    }
}