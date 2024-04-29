// --- import dependencies ---
const mysql = require("mySQL2");

// Connect mySQL
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Blacksea1983$',
        database: 'company_db',
    },
    console.log('Successfully connected to the company_db database.')
);

module.exports = db;