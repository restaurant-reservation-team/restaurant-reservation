import React, { useMemo, useState } from "react";
import "./TablePlan.css";

const TABLES = [
  { id: "T1", name: "Table 1", seats: 2, zone: "Window", shape: "rect", x: 60, y: 90, w: 90, h: 70, status: "available" },
  { id: "T2", name: "Table 2", seats: 2, zone: "Window", shape: "circle", x: 170, y: 95, r: 34, status: "available" },
  { id: "T3", name: "Table 3", seats: 4, zone: "Window", shape: "rect", x: 250, y: 85, w: 110, h: 75, status: "reserved" },

  { id: "T4", name: "Table 4", seats: 4, zone: "Center", shape: "circle", x: 170, y: 210, r: 40, status: "available" },
  { id: "T5", name: "Table 5", seats: 4, zone: "Center", shape: "rect", x: 280, y: 200, w: 110, h: 75, status: "available" },
  { id: "T6", name: "Table 6", seats: 6, zone: "Center", shape: "rect", x: 420, y: 185, w: 130, h: 85, status: "reserved" },

  { id: "T7", name: "Table 7", seats: 2, zone: "Bar", shape: "circle", x: 440, y: 110, r: 32, status: "available" },
  { id: "T8", name: "Table 8", seats: 2, zone: "Bar", shape: "circle", x: 520, y: 110, r: 32, status: "available" },
  { id: "T9", name: "Table 9", seats: 4, zone: "Bar", shape: "rect", x: 600, y: 165, w: 120, h: 75, status: "available" },

  { id: "T10", name: "Table 10", seats: 6, zone: "VIP", shape: "rect", x: 590, y: 280, w: 150, h: 90, status: "available" },
  { id: "T11", name: "Table 11", seats: 6, zone: "Bar", shape: "circle", x: 770, y: 290, r: 40, status: "reserved" },

  { id: "T12", name: "Table 12", seats: 8, zone: "Family", shape: "rect", x: 80, y: 330, w: 160, h: 95, status: "available" },
  { id: "T13", name: "Table 13", seats: 4, zone: "Family", shape: "circle", x: 280, y: 350, r: 42, status: "available" },

  { id: "T14", name: "Table 14", seats: 2, zone: "Entrance", shape: "circle", x: 430, y: 320, r: 34, status: "available" },
  { id: "T15", name: "Table 15", seats: 4, zone: "Entrance", shape: "rect", x: 560, y: 390, w: 115, h: 75, status: "blocked" },
];

export default function TablePlanPage() {
  const [selectedId, setSelectedId] = useState(null); // store id (stable)
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [reservedIds, setReservedIds] = useState(() => new Set()); // frontend-only

  const tables = useMemo(() => {
    return TABLES.map((t) => ({
      ...t,
      status: reservedIds.has(t.id) ? "reserved" : t.status,
    }));
  }, [reservedIds]);

  const selected = useMemo(
    () => tables.find((t) => t.id === selectedId) ?? null,
    [tables, selectedId]
  );

  function handleReserve(table) {
    if (!table || table.status !== "available") return;

    setReservedIds((prev) => {
      const next = new Set(prev);
      next.add(table.id);
      return next;
    });

    setSelectedId(null); // close popup
    alert(`Reserved ${table.name} ✅ (frontend only)`);
  }

  function openPopupForTable(e, table) {
    e.stopPropagation();

    const floorEl = e.currentTarget.closest(".tp-floor");
    if (!floorEl) return;

    const floorRect = floorEl.getBoundingClientRect();
    setPopupPos({ x: e.clientX - floorRect.left, y: e.clientY - floorRect.top });
    setSelectedId(table.id);
  }

  return (
    <div className="tp-page">
      <div className="tp-shell">
        <div className="tp-header">
          <h2>Choose your table</h2>
          <p>Click a table to see details and reserve.</p>
        </div>

        {/* Legend (CSS will style it) */}
        <div className="tp-legend">
          <div className="tp-leg-item">
            <span className="tp-dot available" /> Available
          </div>
          <div className="tp-leg-item">
            <span className="tp-dot reserved" /> Reserved
          </div>
          <div className="tp-leg-item">
            <span className="tp-dot blocked" /> Blocked
          </div>
        </div>

        <div className="tp-floorWrap">
          {/* click outside closes */}
          <div className="tp-floor" onClick={() => setSelectedId(null)}>
            {/* Walls / areas */}
            <div className="tp-wall tp-wall-top" />
            <div className="tp-wall tp-wall-left" />
            <div className="tp-wall tp-wall-right" />
            <div className="tp-wall tp-wall-bottom" />

            <div className="tp-area tp-bar">BAR</div>
            <div className="tp-area tp-kitchen">KITCHEN</div>
            <div className="tp-area tp-entrance">ENTRANCE</div>

            {tables.map((t) => (
              <div
                key={t.id}
                className={`tp-table tp-${t.shape} tp-${t.status}`}
                style={tableStyle(t)}
                onClick={(e) => openPopupForTable(e, t)}
                tabIndex={0}
                role="button"
                aria-label={`${t.name}, seats ${t.seats}, ${t.status}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    // open near the table if keyboard
                    setPopupPos({ x: t.x + 12, y: t.y + 12 });
                    setSelectedId(t.id);
                  }
                }}
              >
                {t.id}
              </div>
            ))}

            {selected && (
              <div
                className="tp-card"
                style={cardStyle(popupPos)}
                onClick={(e) => e.stopPropagation()}
              >
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
                  <span className={`tp-pill ${selected.status}`}>
                    {selected.status}
                  </span>

                  <button
                    className="tp-btn"
                    onClick={() => handleReserve(selected)}
                    disabled={selected.status !== "available"}
                    title={selected.status !== "available" ? "This table is not available" : "Reserve this table"}
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

function tableStyle(t) {
  if (t.shape === "circle") {
    return {
      left: t.x,
      top: t.y,
      width: (t.r ?? 36) * 2,
      height: (t.r ?? 36) * 2,
    };
  }
  return {
    left: t.x,
    top: t.y,
    width: t.w ?? 90,
    height: t.h ?? 70,
  };
}

function cardStyle(pos) {
  const floorW = 900;
  const floorH = 520;

  const cardW = 290;
  const cardH = 150;

  const maxX = floorW - cardW - 10;
  const maxY = floorH - cardH - 10;

  return {
    left: Math.max(10, Math.min(pos.x + 14, maxX)),
    top: Math.max(10, Math.min(pos.y + 14, maxY)),
  };
}
