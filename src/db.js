const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgres://qezuaezksgohlm:a966bad868a94a25c5b4c986001f6dc5415fe236f0cb3a816e295229c11a0b9c@ec2-107-21-98-89.compute-1.amazonaws.com:5432/dqmg3u7e4g6l8?ssl=true'
const pool = new Pool({ connectionString: connectionString })


exports.pool = pool