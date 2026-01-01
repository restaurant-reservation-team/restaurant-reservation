import { useEffect, useState } from "react";
import "./AdminReservations.css";

export default function AdminReservations() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/reservations");
      const data = await r.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id) {
    if (!window.confirm("Delete this reservation?")) return;

    setBusyId(id);
    try {
      const r = await fetch(`/api/reservations/${id}`, { method: "DELETE" });
      const payload = await r.json().catch(() => ({}));

      if (!r.ok) {
        alert(payload.error || "Delete failed");
        return;
      }

      setRows((prev) => prev.filter((x) => x.id !== id));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="admPage app__bg">
      <div className="admShell">
        <div className="admHeader">
          <h2>Admin Dashboard</h2>
          <p>Reservations list</p>

          <button className="admRefresh" onClick={load} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="admCard">
          {loading ? (
            <div className="admEmpty">Loading reservations...</div>
          ) : rows.length === 0 ? (
            <div className="admEmpty">No reservations found.</div>
          ) : (
            <table className="admTable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Table</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>People</th>
                  <th>Note</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{fmtDate(r.date)}</td>
                    <td>{fmtTime(r.time)}</td>
                    <td>{r.table_name ?? r.table_id}</td>
                    <td>{r.name}</td>
                    <td>{r.phone}</td>
                    <td>{r.people}</td>
                    <td className="admNote">{r.message || "-"}</td>
                    <td>
                      <button
                        className="admDelete"
                        onClick={() => onDelete(r.id)}
                        disabled={busyId === r.id}
                      >
                        {busyId === r.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function fmtDate(d) {
  if (!d) return "";
  return String(d).slice(0, 10);
}
function fmtTime(t) {
  if (!t) return "";
  return String(t).slice(0, 5);
}
