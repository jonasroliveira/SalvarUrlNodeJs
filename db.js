const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(path.join(__dirname, "urls.db"));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      data DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

function salvarURL(url) {
  const dataAtual = new Date().toLocaleString("sv-SE");

  return new Promise((resolve, reject) => {
    db.get("SELECT id FROM urls WHERE url = ?", [url], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        db.run(
          "UPDATE urls SET data = ? WHERE id = ?",
          [dataAtual, row.id],
          function (err) {
            if (err) reject(err);
            else resolve(row.id);
          }
        );
      } else {
        db.run(
          "INSERT INTO urls (url, data) VALUES (?, ?)",
          [url, dataAtual],
          function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
          }
        );
      }
    });
  });
}

function listarURLs() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM urls ORDER BY data ASC", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function deletarURL(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM urls WHERE id = ?", [id], function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
}

module.exports = {
  salvarURL,
  listarURLs,
  deletarURL,
};
