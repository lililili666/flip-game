
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('data.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY,
    text TEXT,
    image TEXT
  )`);
  for (let i = 1; i <= 30; i++) {
    db.run(`INSERT OR IGNORE INTO cards (id, text, image) VALUES (?, '', '')`, [i]);
  }
});

const upload = multer({ dest: 'public/uploads/' });

app.get('/api/cards', (req, res) => {
  db.all('SELECT * FROM cards', (err, rows) => res.json(rows));
});

app.post('/api/card/:id', upload.single('image'), (req, res) => {
  const { text } = req.body;
  const image = req.file ? '/uploads/' + req.file.filename : null;
  db.run(
    `UPDATE cards SET text=?, image=COALESCE(?, image) WHERE id=?`,
    [text, image, req.params.id],
    () => res.json({ success: true })
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running'));
