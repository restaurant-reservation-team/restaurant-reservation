import { useEffect, useMemo, useState } from "react";

export default function useTablePlan() {
  const [tables, setTables] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reservedIds, setReservedIds] = useState(() => new Set());

  // for /available-times endpoint
  const [people, setPeople] = useState(2);
  const [duration, setDuration] = useState(90);
  const [availableTimes, setAvailableTimes] = useState([]);

  // NEW: customer info
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");

  // Fetch tables once
  useEffect(() => {
    fetch("/api/tables")
      .then((r) => r.json())
      .then((data) => setTables(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  // Fetch available times when date/people/duration changes
  useEffect(() => {
    if (!date) {
      setAvailableTimes([]);
      setTime("");
      return;
    }

    fetch(
      `/api/available-times?date=${encodeURIComponent(
        date
      )}&people=${people}&duration=${duration}`
    )
      .then((r) => r.json())
      .then((data) => {
        setAvailableTimes(
          Array.isArray(data.availableTimes) ? data.availableTimes : []
        );
        setTime("");
      })
      .catch(console.error);
  }, [date, people, duration]);

  // Fetch reserved tables for exact date+time
  useEffect(() => {
    if (!date || !time) {
      setReservedIds(new Set());
      return;
    }

    fetch(
      `/api/availability?date=${encodeURIComponent(
        date
      )}&time=${encodeURIComponent(time)}`
    )
      .then((r) => r.json())
      .then((data) => setReservedIds(new Set(data.reservedTableIds || [])))
      .catch(console.error);
  }, [date, time]);

  const tablesWithStatus = useMemo(() => {
    return tables.map((t) => ({
      ...t,
      status: reservedIds.has(t.id) ? "reserved" : "available",
    }));
  }, [tables, reservedIds]);

  const selected = useMemo(() => {
    return tablesWithStatus.find((t) => t.id === selectedId) ?? null;
  }, [tablesWithStatus, selectedId]);

  async function reserveSelected(table) {
    if (!table) return { ok: false, error: "No table selected" };
    if (!date || !time)
      return { ok: false, error: "Please select date and time first" };
    if (table.status !== "available")
      return { ok: false, error: "Table not available" };

    const name = custName.trim();
    const phone = custPhone.trim();

    if (!name || !phone)
      return { ok: false, error: "Please enter name and phone" };

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableId: normalizeTableId(table.id),
        name,
        phone,
        people,
        date,
        time,
        duration,
        message: "",
      }),
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: payload.error || "Reservation failed" };

    // refresh availability after success
    fetch(
      `/api/availability?date=${encodeURIComponent(
        date
      )}&time=${encodeURIComponent(time)}`
    )
      .then((r) => r.json())
      .then((data) => setReservedIds(new Set(data.reservedTableIds || [])))
      .catch(console.error);

    setSelectedId(null);
    setCustName("");
    setCustPhone("");
    return { ok: true };
  }

  function openPopupForTable(e, table) {
    e.stopPropagation();
    const floor = e.currentTarget.closest(".tp-floor")?.getBoundingClientRect();
    if (!floor) return;

    setPopupPos({ x: e.clientX - floor.left, y: e.clientY - floor.top });
    setSelectedId(table.id);
  }

  return {
    // state
    date,
    time,
    people,
    duration,
    availableTimes,
    popupPos,
    selectedId,
    selected,
    tablesWithStatus,
    custName,
    custPhone,

    // setters
    setDate,
    setTime,
    setPeople,
    setDuration,
    setSelectedId,
    setCustName,
    setCustPhone,

    // actions
    reserveSelected,
    openPopupForTable,
  };
}

function normalizeTableId(id) {
  const s = String(id).trim();
  const numeric = s.replace(/^t/i, "");
  const n = parseInt(numeric, 10);
  return Number.isNaN(n) ? id : n;
}
