import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import * as api from "../services/bookings";
import Alert from "../components/Alert";

export default function PatientDashboard() {
  const today = dayjs().format("YYYY-MM-DD");
  const week = dayjs().add(6, "day").format("YYYY-MM-DD");

  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(week);
  const [available, setAvailable] = useState([]);
  const [mine, setMine] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const rangeValid = useMemo(
    () =>
      dayjs(from).isValid() &&
      dayjs(to).isValid() &&
      dayjs(from).isBefore(dayjs(to).add(1, "day")),
    [from, to]
  );

  async function load() {
    if (!rangeValid) return;
    setLoading(true);
    setMsg("");
    try {
      const [s, b] = await Promise.all([
        api.fetchSlots(from, to),
        api.myBookings(),
      ]);
      setAvailable(s.available);
      setMine(b.bookings);
    } catch (e) {
      setMsg(e?.response?.data?.error?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [from, to]);

  async function onBook(id) {
    setLoading(true);
    setMsg("");
    try {
      await api.bookSlot(id);
      setMsg("Booked! 🎉");
      await load();
    } catch (e) {
      setMsg(e?.response?.data?.error?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Patient dashboard</h1>

      {msg && <Alert type="success">{msg}</Alert>}

      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-sm mb-1">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-xl border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-xl border px-3 py-2"
          />
        </div>
        <button
          onClick={load}
          disabled={!rangeValid || loading}
          className="rounded-xl border px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      <section className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-medium mb-2">Available slots</h2>
          <div className="space-y-2">
            {available.length === 0 && (
              <p className="text-sm text-gray-500">No slots in range.</p>
            )}
            {available.map((s) => (
              <div
                key={s.id}
                className="border rounded-xl p-3 flex items-center justify-between"
              >
                <div className="text-sm">
                  <div className="font-medium">
                    {dayjs(s.start_at).format("ddd, MMM D")}
                  </div>
                  <div className="text-gray-600">
                    {dayjs(s.start_at).format("HH:mm")} —{" "}
                    {dayjs(s.end_at).format("HH:mm")} UTC
                  </div>
                </div>
                <button
                  disabled={loading}
                  onClick={() => onBook(s.id)}
                  className="rounded-lg bg-indigo-600 text-white text-sm px-3 py-1.5 hover:bg-indigo-500 disabled:opacity-60"
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-medium mb-2">My bookings</h2>
          <div className="space-y-2">
            {mine.length === 0 && (
              <p className="text-sm text-gray-500">You have no bookings yet.</p>
            )}
            {mine.map((b) => (
              <div key={b.id} className="border rounded-xl p-3 text-sm">
                <div className="font-medium">
                  {dayjs(b.slot.start_at).format("ddd, MMM D")}
                </div>
                <div className="text-gray-600">
                  {dayjs(b.slot.start_at).format("HH:mm")} —{" "}
                  {dayjs(b.slot.end_at).format("HH:mm")} UTC
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Booked at {dayjs(b.created_at).format("YYYY-MM-DD HH:mm")} UTC
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
