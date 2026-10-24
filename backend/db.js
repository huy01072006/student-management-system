const mysql = require('mysql2');

const db = mysql.createPool({
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USER || 'student_user',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'student_db',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Ket noi MySQL that bai:', err.message);
        return;
    }

    console.log('Ket noi MySQL thanh cong!');
    connection.release();
});

module.exports = db;
