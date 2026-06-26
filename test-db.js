// test-db.js
import 'dotenv/config'
import { Pool } from 'pg'

console.log('Connection string:', JSON.stringify(process.env.DATABASE_URL))

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const client = await pool.connect()
console.log('Connected successfully!')
await client.end()