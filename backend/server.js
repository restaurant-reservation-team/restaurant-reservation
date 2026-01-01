require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/* ---------------- ROOT ---------------- */
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Backend running ✅" });
});

/* ---------------- DB HEALTH CHECK ---------------- */
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS ok");
    res.json({ db: rows[0].ok === 1 });
  } catch (e) {
    res.status(500).json({ db: false, error: e.message });
  }
});

/* ---------------- TABLES (TablePlan) ---------------- */
app.get("/api/tables", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tables ORDER BY id ASC");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ---------------- HELPERS FOR SLOTS ---------------- */
function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
function fromMinutes(min) {
  const h = String(Math.floor(min / 60)).padStart(2, "0");
  const m = String(min % 60).padStart(2, "0");
  return `${h}:${m}`;
}
// generate candidate start times that still fit duration before close
function generateSlots(openHHMM, closeHHMM, stepMin, durationMin) {
  const slots = [];
  let t = toMinutes(openHHMM);
  const end = toMinutes(closeHHMM);
  while (t + durationMin <= end) {
    slots.push(fromMinutes(t));
    t += stepMin;
  }
  return slots;
}

/* ---------------- AVAILABLE TIMES (Option 2) ----------------
   GET /api/available-times?date=YYYY-MM-DD&people=2&duration=90
*/
app.get("/api/available-times", async (req, res) => {
  const date = req.query.date;
  const people = Number(req.query.people ?? 2);
  const duration = Number(req.query.duration ?? 90);

  if (!date) return res.status(400).json({ error: "Missing date" });

  // You can later move these to ENV or a settings table
  const slotSize = 15;
  const open = "12:00";
  const close = "23:00";

  try {
    // 1) tables that can fit this party size
    const [tables] = await db.query(
      "SELECT id, seats FROM tables WHERE seats >= ? ORDER BY seats ASC",
      [people]
    );

    if (tables.length === 0) {
      return res.json({ date, slotSize, availableTimes: [] });
    }

    // 2) all confirmed reservations for that date
    const [resRows] = await db.query(
      `
      SELECT table_id,
             TIME_FORMAT(time, '%H:%i') AS start,
             duration_minutes AS dur
      FROM reservations
      WHERE date = ?
        AND status = 'confirmed'
      `,
      [date]
    );

    // 3) generate candidates
    const candidates = generateSlots(open, close, slotSize, duration);

    // 4) keep only times where at least one table has no overlap
    const availableTimes = candidates.filter((t) => {
      const startMin = toMinutes(t);
      const endMin = startMin + duration;

      return tables.some((table) => {
        const conflicts = resRows
          .filter((r) => r.table_id === table.id)
          .some((r) => {
            const s2 = toMinutes(r.start);
            const e2 = s2 + Number(r.dur);
            // overlap rule: newStart < existingEnd AND newEnd > existingStart
            return startMin < e2 && endMin > s2;
          });

        return !conflicts;
      });
    });

    res.json({ date, slotSize, availableTimes });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ---------------- AVAILABILITY FOR TABLEPLAN ----------------
   GET /api/availability?date=YYYY-MM-DD&time=HH:MM&duration=90
   Returns which tables are RESERVED for that time window (overlap)
*/
app.get("/api/availability", async (req, res) => {
  const { date, time } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Missing date" });
  }

  try {
    // If time is provided -> reserved tables at that exact time
    if (time) {
      const [rows] = await db.query(
        `SELECT DISTINCT table_id
         FROM reservations
         WHERE date = ?
           AND status = 'confirmed'
           AND time = ?`,
        [date, time]
      );
      return res.json({ reservedTableIds: rows.map((r) => r.table_id) });
    }

    // If time is NOT provided -> reserved tables for the whole day
    const [rows] = await db.query(
      `SELECT DISTINCT table_id
       FROM reservations
       WHERE date = ?
         AND status = 'confirmed'`,
      [date]
    );

    res.json({ reservedTableIds: rows.map((r) => r.table_id) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


/* ---------------- RESERVATIONS ---------------- */
app.get("/api/reservations", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM reservations ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ---------------- CREATE RESERVATION (SAFE) ----------------
   Re-checks overlap before insert (prevents double-booking).
*/
app.post("/api/reservations", async (req, res) => {
  const { tableId, name, email, phone, people, date, time, duration, message } =
    req.body;

  if (!tableId || !name || !email || !people || !date || !time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const durationMin = Number(duration ?? 90);

  try {
    // 1) check overlap conflicts for this table
    const [conflicts] = await db.query(
      `
      SELECT id
      FROM reservations
      WHERE table_id = ?
        AND date = ?
        AND status = 'confirmed'
        AND (? < ADDTIME(time, SEC_TO_TIME(duration_minutes*60)))
        AND (ADDTIME(?, SEC_TO_TIME(?*60)) > time)
      LIMIT 1
      `,
      [tableId, date, time, time, durationMin]
    );

    if (conflicts.length > 0) {
      return res
        .status(409)
        .json({ error: "Table is not available for this time window" });
    }

    // 2) insert
    const [result] = await db.query(
      `
      INSERT INTO reservations
        (table_id, name, email, phone, people, date, time, duration_minutes, status, message)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?)
      `,
      [
        tableId,
        name,
        email,
        phone || null,
        people,
        date,
        time,
        durationMin,
        message || null,
      ]
    );

    res.status(201).json({ id: result.insertId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
