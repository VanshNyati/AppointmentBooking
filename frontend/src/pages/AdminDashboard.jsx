import { useEffect, useMemo, useState } from "react";
import * as api from "../services/bookings";
import dayjs from "dayjs";

export default function AdminDashboard() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    api
      .allBookings()
      .then((d) => setRows(d.bookings || []))
      .catch(() => setRows([]));
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const s = q.toLowerCase();
    return rows.filter((r) =>
      [
        r?.user?.name,
        r?.user?.email,
        dayjs(r?.slot?.start_at).format("YYYY-MM-DD"),
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s))
    );
  }, [rows, q]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const view = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    // keep page in range when typing
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Admin — All bookings</h1>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, email, or date…"
            className="w-64 max-w-[60vw] rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="scroll-card">
        <table className="table min-w-[720px]">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Date</th>
              <th>Time (UTC)</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {view.map((r) => (
              <tr key={r.id}>
                <td className="p-3">{r.user?.name}</td>
                <td className="p-3">{r.user?.email}</td>
                <td className="p-3">
                  {dayjs(r.slot.start_at).format("YYYY-MM-DD")}
                </td>
                <td className="p-3">
                  {dayjs(r.slot.start_at).format("HH:mm")} –{" "}
                  {dayjs(r.slot.end_at).format("HH:mm")}
                </td>
                <td className="p-3">
                  {dayjs(r.created_at).format("YYYY-MM-DD HH:mm")}
                </td>
              </tr>
            ))}
            {view.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-slate-500">
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > pageSize && (
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-slate-600">
            Showing {(page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              className="btn-secondary"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span className="badge">
              Page {page} / {pageCount}
            </span>
            <button
              className="btn-secondary"
              disabled={page === pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
