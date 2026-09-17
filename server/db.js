const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Enable WAL mode for performance and concurrency
db.pragma('journal_mode = WAL');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS faculty (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    status TEXT DEFAULT 'authorized',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Admin DB queries
const getAdminByEmail = (email) => {
  const stmt = db.prepare('SELECT * FROM admins WHERE LOWER(email) = LOWER(?)');
  return stmt.get(email);
};

const getAdminById = (id) => {
  const stmt = db.prepare('SELECT id, name, email, created_at FROM admins WHERE id = ?');
  return stmt.get(id);
};

const createAdmin = (name, email, hashedPassword) => {
  const stmt = db.prepare('INSERT INTO admins (name, email, password) VALUES (?, LOWER(?), ?)');
  const info = stmt.run(name, email, hashedPassword);
  return { id: info.lastInsertRowid, name, email };
};

// Faculty DB queries
const getFacultyByEmail = (email) => {
  const stmt = db.prepare('SELECT * FROM faculty WHERE LOWER(email) = LOWER(?)');
  return stmt.get(email);
};

const addFaculty = (email, hashedPassword) => {
  const stmt = db.prepare('INSERT INTO faculty (email, password) VALUES (LOWER(?), ?)');
  const info = stmt.run(email, hashedPassword);
  return { id: info.lastInsertRowid, email };
};

const getAllFaculty = () => {
  const stmt = db.prepare('SELECT id, email, status, created_at FROM faculty ORDER BY created_at DESC');
  return stmt.all();
};

module.exports = {
  db,
  getAdminByEmail,
  getAdminById,
  createAdmin,
  getFacultyByEmail,
  addFaculty,
  getAllFaculty
};
