import dayjs from "dayjs";

export default function SlotItem({ slot, onBook, busy }) {
  const start = dayjs(slot.start_at).format("ddd, DD MMM HH:mm");
  const end = dayjs(slot.end_at).format("HH:mm");

  return (
    <div className="flex items-center justify-between rounded-xl border p-3">
      <div>
        <div className="font-medium">
          {start} → {end}
        </div>
        <div className="text-xs text-gray-500">
          Times shown in your local time
        </div>
      </div>
      <button
        disabled={busy}
        onClick={() => onBook(slot.id)}
        className="rounded-md bg-blue-600 text-white px-3 py-1.5 disabled:opacity-50 hover:bg-blue-700"
      >
        {busy ? "Booking..." : "Book"}
      </button>
    </div>
  );
}
