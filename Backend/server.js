const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const path = require('path');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS roles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT NOT NULL, last_name TEXT NOT NULL, identification TEXT NOT NULL, email TEXT NOT NULL, role_id INTEGER NOT NULL, FOREIGN KEY(role_id) REFERENCES roles(id))");
});

// Rutas API
app.post('/api/roles', (req, res) => {
    const { name, description } = req.body;
    db.run("INSERT INTO roles (name, description) VALUES (?, ?)", [name, description], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID });
    });
});

app.get('/api/roles', (req, res) => {
    db.all("SELECT * FROM roles", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/users', (req, res) => {
    const { firstName, lastName, identification, email, roleId } = req.body;
    db.run("INSERT INTO users (first_name, last_name, identification, email, role_id) VALUES (?, ?, ?, ?, ?)",
        [firstName, lastName, identification, email, roleId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID });
        });
});

app.get('/api/users', (req, res) => {
    db.all("SELECT u.id, u.first_name, u.last_name, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});