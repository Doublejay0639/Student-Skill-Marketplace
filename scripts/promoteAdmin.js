import prisma from '../config/db.js'

const email = process.argv[2]

if (!email) {
    console.error('Usage: node scripts/promoteAdmin.js <email>')
    process.exit(1)
}

const run = async () => {
    const user = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' }
    })
    console.log(`${user.email} is now an ADMIN`)
    await prisma.$disconnect()
}

run().catch((err) => {
    console.error(err)
    process.exit(1)
})