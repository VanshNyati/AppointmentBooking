import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import * as api from "../services/bookings";
import Alert from "../components/Alert";

function groupByDate(slots) {
  return slots.reduce((acc, s) => {
    const key = dayjs(s.start_at).format("YYYY-MM-DD");
    (acc[key] ||= []).push(s);
    return acc;
  }, {});
}

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
      setAvailable(s.available || []);
      setMine(b.bookings || []);
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

  const grouped = useMemo(() => groupByDate(available), [available]);
  const days = useMemo(
    () => Object.keys(grouped).sort((a, b) => a.localeCompare(b)),
    [grouped]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Patient dashboard</h1>
      {msg && <Alert type="success">{msg}</Alert>}

      {/* Filters */}
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
          className="btn-secondary"
        >
          Refresh
        </button>

        <div className="ml-auto flex gap-2">
          <button
            className="btn-secondary"
            onClick={() => {
              setFrom(dayjs().format("YYYY-MM-DD"));
              setTo(dayjs().add(6, "day").format("YYYY-MM-DD"));
            }}
          >
            Next 7 days
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              setFrom(dayjs().startOf("month").format("YYYY-MM-DD"));
              setTo(dayjs().endOf("month").format("YYYY-MM-DD"));
            }}
          >
            This month
          </button>
        </div>
      </div>

      <section className="grid md:grid-cols-2 gap-6">
        {/* Left: Slots by day */}
        <div className="space-y-4">
          <h2 className="section-title">Available slots</h2>

          {loading && (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-xl border animate-pulse bg-slate-50"
                />
              ))}
            </div>
          )}

          {!loading && days.length === 0 && (
            <p className="text-sm text-slate-500">No slots in range.</p>
          )}

          {!loading &&
            days.map((d) => (
              <div
                key={d}
                className="rounded-xl border border-slate-200 bg-white"
              >
                <div className="sticky top-[60px] z-[1] rounded-t-xl bg-slate-50/80 px-4 py-2 backdrop-blur">
                  <span className="font-medium">
                    {dayjs(d).format("ddd, MMM D")}
                  </span>
                </div>
                <ul className="divide-y">
                  {grouped[d].map((s) => (
                    <li
                      key={s.id}
                      className="px-4 py-3 flex items-center justify-between"
                    >
                      <div className="text-sm">
                        <div className="font-medium">
                          {dayjs(s.start_at).format("HH:mm")} —{" "}
                          {dayjs(s.end_at).format("HH:mm")} UTC
                        </div>
                        <div className="text-xs text-slate-500">UTC time</div>
                      </div>
                      <button
                        disabled={loading}
                        onClick={() => onBook(s.id)}
                        className="rounded-lg bg-indigo-600 text-white text-sm px-3 py-1.5 hover:bg-indigo-500 disabled:opacity-60"
                      >
                        Book
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>

        {/* Right: My bookings */}
        <aside className="space-y-4 md:sticky md:top-[68px] h-fit">
          <h2 className="section-title">My bookings</h2>
          <div className="scroll-card max-h-[60vh]">
            <ul className="divide-y">
              {mine.length === 0 && (
                <li className="p-4 text-sm text-slate-500">
                  You have no bookings yet.
                </li>
              )}
              {mine.map((b) => (
                <li key={b.id} className="p-4 text-sm">
                  <div className="font-medium">
                    {dayjs(b.slot.start_at).format("ddd, MMM D")}
                  </div>
                  <div className="text-slate-600">
                    {dayjs(b.slot.start_at).format("HH:mm")} —{" "}
                    {dayjs(b.slot.end_at).format("HH:mm")} UTC
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Booked at {dayjs(b.created_at).format("YYYY-MM-DD HH:mm")}{" "}
                    UTC
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
