const { Pool } = require('pg')
const connectionString = process.env.DATABA
const pool = new Pool({ connectionString: connectionString })


exports.pool = pool