import dayjs from "dayjs";

export default function BookingRow({ booking }) {
  const start = dayjs(booking.slot.start_at).format("ddd, DD MMM HH:mm");
  const end = dayjs(booking.slot.end_at).format("HH:mm");

  return (
    <div className="grid grid-cols-3 gap-3 border-b py-2 text-sm">
      <div>
        {start} → {end}
      </div>
      {booking.user ? (
        <div className="text-gray-700">
          {booking.user.name} • {booking.user.email}
        </div>
      ) : (
        <div className="text-gray-500">—</div>
      )}
      <div className="text-gray-500">
        {dayjs(booking.created_at).format("DD MMM HH:mm")}
      </div>
    </div>
  );
}
