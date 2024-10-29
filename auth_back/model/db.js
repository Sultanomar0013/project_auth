const mysql = require("mysql");

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "roots",
    password: "",
    database: "chat",
    port: 3306,
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the MySQL database.");
});

module.exports = db;