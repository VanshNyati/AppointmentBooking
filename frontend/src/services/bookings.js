import api from "./api";

export async function fetchSlots(from, to) {
  const { data } = await api.get(`/slots?from=${from}&to=${to}`);
  // { available: [{ id, start_at, end_at }] }
  return data;
}

export async function bookSlot(slotId) {
  const { data } = await api.post("/book", { slotId });
  return data;
}

export async function myBookings() {
  const { data } = await api.get("/my-bookings");
  // { bookings: [...] }
  return data;
}

export async function allBookings() {
  const { data } = await api.get("/all-bookings"); // admin-only
  // { bookings: [...] }
  return data;
}
