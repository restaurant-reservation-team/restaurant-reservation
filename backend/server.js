require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Backend running ✅" });
});

// DB health check
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS ok");
    res.json({ db: rows[0].ok === 1 });
  } catch (e) {
    res.status(500).json({ db: false, error: e.message });
  }
});

// Reservations
app.get("/api/reservations", async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM reservations ORDER BY created_at DESC"
  );
  res.json(rows);
});

app.post("/api/reservations", async (req, res) => {
  const { name, email, phone, people, date, time, message } = req.body;

  if (!name || !email || !people || !date || !time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const [result] = await db.query(
    `INSERT INTO reservations (name, email, phone, people, date, time, message)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, email, phone || null, people, date, time, message || null]
  );

  res.status(201).json({ id: result.insertId });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
