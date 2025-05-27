// server.js

const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const PORT = 3000;

// Setup SQLite database
const db = new sqlite3.Database('./todos.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      priority TEXT DEFAULT 'low',
      isComplete INTEGER DEFAULT 0,
      isFun TEXT DEFAULT 'true'
    )
  `);
});

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET all todos
app.get('/todos', (req, res) => {
  db.all('SELECT * FROM todos', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST a new todo
app.post('/todos', (req, res) => {
  const { name, priority = 'low', isFun = 'true' } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  const stmt = db.prepare('INSERT INTO todos (name, priority, isFun) VALUES (?, ?, ?)');
  stmt.run(name, priority, isFun, function (err) {
    if (err) return res.status(500).json({ error: err.message });

    const newTodo = {
      id: this.lastID,
      name,
      priority,
      isFun
    };

    const logEntry = `New TODO added: ${JSON.stringify(newTodo)}\n`;
    fs.appendFile('todo.log', logEntry, err => {
      if (err) console.error('Failed to log TODO:', err);
    });

    res.status(201).json(newTodo);
  });
});

// DELETE a todo by ID
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.run('DELETE FROM todos WHERE id = ?', id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Todo item not found' });
    }
    res.json({ message: `Todo item ${id} deleted.` });
  });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
  });
  
