import { useEffect, useState } from "react";
import * as api from "../services/bookings";
import dayjs from "dayjs";

export default function AdminDashboard() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api
      .allBookings()
      .then((d) => setRows(d.bookings))
      .catch(() => setRows([]));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin — All bookings</h1>

      <div className="overflow-x-auto border rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">User</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Time (UTC)</th>
              <th className="text-left p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.user.name}</td>
                <td className="p-2">{r.user.email}</td>
                <td className="p-2">
                  {dayjs(r.slot.start_at).format("YYYY-MM-DD")}
                </td>
                <td className="p-2">
                  {dayjs(r.slot.start_at).format("HH:mm")} -{" "}
                  {dayjs(r.slot.end_at).format("HH:mm")}
                </td>
                <td className="p-2">
                  {dayjs(r.created_at).format("YYYY-MM-DD HH:mm")}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="p-3 text-gray-500" colSpan="5">
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
