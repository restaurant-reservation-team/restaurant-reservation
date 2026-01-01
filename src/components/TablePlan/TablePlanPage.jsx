import React, { useMemo, useState, useEffect } from "react";
import "./TablePlan.css";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function TablePlanPage() {
  const [tables, setTables] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

  const [date, setDate] = useState(""); // "YYYY-MM-DD"
  const [time, setTime] = useState("");
  const [reservedIds, setReservedIds] = useState(() => new Set());

  // kept (even if you don’t show them now)
  const [people] = useState(2);
  const [duration] = useState(90);

  const [availableTimes, setAvailableTimes] = useState([]);

  /* ---------------- FETCH TABLES ---------------- */
  useEffect(() => {
    fetch("/api/tables")
      .then((r) => r.json())
      .then((data) => setTables(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  /* ---------------- FETCH AVAILABLE TIMES ---------------- */
  useEffect(() => {
    if (!date) {
      setAvailableTimes([]);
      setTime("");
      return;
    }

    fetch(
      `/api/available-times?date=${encodeURIComponent(date)}&people=${people}&duration=${duration}`
    )
      .then((r) => r.json())
      .then((data) => {
        setAvailableTimes(Array.isArray(data.availableTimes) ? data.availableTimes : []);
        setTime("");
      })
      .catch(console.error);
  }, [date, people, duration]);

  /* ---------------- FETCH RESERVED TABLES FOR EXACT TIME ---------------- */
  useEffect(() => {
    if (!date || !time) {
      setReservedIds(new Set());
      return;
    }

    fetch(`/api/availability?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`)
      .then((r) => r.json())
      .then((data) => setReservedIds(new Set(data.reservedTableIds || [])))
      .catch(console.error);
  }, [date, time]);

  /* ---------------- MERGE STATUS ---------------- */
  const tablesWithStatus = useMemo(() => {
    return tables.map((t) => ({
      ...t,
      status: reservedIds.has(t.id) ? "reserved" : "available",
    }));
  }, [tables, reservedIds]);

  const selected = useMemo(
    () => tablesWithStatus.find((t) => t.id === selectedId) ?? null,
    [tablesWithStatus, selectedId]
  );

  /* ---------------- RESERVE ---------------- */
  async function handleReserve(table) {
    if (!table) return;

    if (!date || !time) {
      alert("Please select date and time first");
      return;
    }

    if (table.status !== "available") return;

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableId: table.id,
        name: "Guest",
        email: "guest@test.com",
        people: table.seats,
        date,
        time,
        message: "",
      }),
    });

    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(payload.error || "Reservation failed");
      return;
    }

    alert(`Reserved ${table.name}`);
    setSelectedId(null);

    // refresh availability
    fetch(`/api/availability?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`)
      .then((r) => r.json())
      .then((data) => setReservedIds(new Set(data.reservedTableIds || [])))
      .catch(console.error);
  }

  function openPopupForTable(e, table) {
    e.stopPropagation();
    const floor = e.currentTarget.closest(".tp-floor")?.getBoundingClientRect();
    if (!floor) return;

    setPopupPos({ x: e.clientX - floor.left, y: e.clientY - floor.top });
    setSelectedId(table.id);
  }

  return (
    <div className="tp-page app__bg">
      <div className="tp-shell">
        {/* HEADER */}
        <div className="tp-header">
          <h2>Choose your table</h2>
          <p>Select date & time, then choose a table.</p>
        </div>

        {/* DATE + TIME CARD (this is what was missing / ugly) */}
        <div
          className="tp-pickerCard"
          style={{
            maxWidth: 980,
            margin: "0 auto 16px",
            background: "#111111",
            border: "1px solid #3a3a3a",
            borderRadius: 12,
            padding: "16px 18px",
            boxShadow: "0 18px 45px rgba(0, 0, 0, 0.65)",
          }}
        >
          {/* DATE */}
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ fontFamily: "Open Sans, sans-serif", color: "#cccccc", fontSize: 13, letterSpacing: "0.10em", textTransform: "uppercase" }}>
              Date
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#151515",
                border: "1px solid #333333",
                borderRadius: 10,
                padding: "0.75rem 0.9rem",
              }}
            >
              <span style={{ color: "#dcca87" }}>📅</span>

              <DatePicker
                selected={date ? new Date(date) : null}
                onChange={(d) => {
                  if (!d) return;
                  setDate(toYMD(d));
                  setTime("");
                }}
                dateFormat="dd.MM.yyyy"
                placeholderText="Select date"
                minDate={new Date()}
                withPortal
                className="tpDateInput"
              />
            </div>
          </div>

          {/* TIME */}
          <div style={{ height: 14 }} />

          <div
            style={{
              fontFamily: "Open Sans, sans-serif",
              color: "#cccccc",
              fontSize: 13,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Time
          </div>

          {!date ? (
            <div
              style={{
                background: "#151515",
                border: "1px dashed #333333",
                borderRadius: 10,
                padding: "0.85rem 0.95rem",
                color: "#aaaaaa",
                fontFamily: "Open Sans, sans-serif",
              }}
            >
              Select a date to see available times.
            </div>
          ) : availableTimes.length === 0 ? (
            <div
              style={{
                background: "#151515",
                border: "1px solid #333333",
                borderRadius: 10,
                padding: "0.85rem 0.95rem",
                color: "#aaaaaa",
                fontFamily: "Open Sans, sans-serif",
              }}
            >
              No times available for this date.
            </div>
          ) : (
            <div
              className="tp-slotsGrid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(92px, 1fr))",
                gap: 10,
              }}
            >
              {availableTimes.map((t) => {
                const isSelected = time === t;
                return (
                  <button
                    key={t}
                    type="button"
                    className={`tp-slotBtn ${isSelected ? "is-selected" : ""}`}
                    onClick={() => setTime(t)}
                    style={{
                      background: isSelected ? "#dcca87" : "#151515",
                      color: isSelected ? "#0b0b0b" : "#cccccc",
                      border: `1px solid ${isSelected ? "#dcca87" : "#333333"}`,
                      borderRadius: 999,
                      padding: "0.7rem 0.9rem",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                      transition: "transform 120ms ease, border-color 200ms ease",
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* LEGEND */}
        <div className="tp-legend">
          <div className="tp-leg-item">
            <span className="tp-dot available" /> Available
          </div>
          <div className="tp-leg-item">
            <span className="tp-dot reserved" /> Reserved
          </div>
        </div>

        {/* FLOOR */}
        <div className="tp-floorWrap">
          <div className="tp-floor" onClick={() => setSelectedId(null)}>
            {/* AREAS */}
            <div className="tp-wall tp-wall-top" />
            <div className="tp-wall tp-wall-left" />
            <div className="tp-wall tp-wall-right" />
            <div className="tp-wall tp-wall-bottom" />

            <div className="tp-area tp-bar">BAR</div>
            <div className="tp-area tp-kitchen">KITCHEN</div>
            <div className="tp-area tp-entrance">ENTRANCE</div>

            {tablesWithStatus.map((t) => (
              <div
                key={t.id}
                className={`tp-table tp-${t.shape} tp-${t.status}`}
                style={tableStyle(t)}
                onClick={(e) => openPopupForTable(e, t)}
                tabIndex={0}
              >
                {t.id}
              </div>
            ))}

            {selected && (
              <div className="tp-card" style={cardStyle(popupPos)} onClick={(e) => e.stopPropagation()}>
                <div className="tp-card-top">
                  <div>
                    <div className="tp-card-title">{selected.name}</div>
                    <div className="tp-card-sub">
                      Seats: {selected.seats} • Zone: {selected.zone}
                    </div>
                  </div>
                  <button className="tp-close" onClick={() => setSelectedId(null)}>
                    ✕
                  </button>
                </div>

                <div className="tp-card-bottom">
                  <span className={`tp-pill ${selected.status}`}>{selected.status}</span>
                  <button
                    className="tp-btn"
                    disabled={selected.status !== "available"}
                    onClick={() => handleReserve(selected)}
                  >
                    {selected.status === "available" ? "Reserve" : "Not available"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function toPx(v, fallback) {
  if (v === null || v === undefined || v === "") return `${fallback}px`;
  const n = Number(v);
  if (!Number.isNaN(n)) return `${n}px`;
  return `${fallback}px`;
}

function tableStyle(t) {
  if (t.shape === "circle") {
    const r = t.r ?? 36;
    return {
      left: toPx(t.x, 0),
      top: toPx(t.y, 0),
      width: toPx(r * 2, 72),
      height: toPx(r * 2, 72),
    };
  }

  return {
    left: toPx(t.x, 0),
    top: toPx(t.y, 0),
    width: toPx(t.w ?? 90, 90),
    height: toPx(t.h ?? 70, 70),
  };
}

function cardStyle(pos) {
  const cardW = 290;
  const cardH = 150;

  return {
    left: Math.max(10, Math.min(pos.x + 14, 900 - cardW - 10)),
    top: Math.max(10, Math.min(pos.y + 14, 520 - cardH - 10)),
  };
}

function toYMD(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
