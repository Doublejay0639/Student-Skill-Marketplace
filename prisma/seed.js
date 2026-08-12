import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client.js'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const seed = async () => {
    const hashedPassword = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@ssm.com' },
        update: {},
        create: {
            name: 'SSM Admin',
            email: 'admin@ssm.com',
            password: hashedPassword,
            role: 'ADMIN',
            bio: 'Platform administrator'
        }
    })

    console.log('Admin created:', admin.email)
    await prisma.$disconnect()
}

seed()