import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Slot from "./models/Slot.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);

const HOURS_START = 9; // 09:00
const HOURS_END = 17; // 17:00 exclusive end bound for blocks

export async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";
  if (!email || !password) return;
  const exists = await User.findOne({ email });
  if (!exists) {
    const password_hash = await bcrypt.hash(password, 10);
    await User.create({ name, email, password_hash, role: "admin" });
    console.log("Seeded admin:", email);
  }
}

export async function ensureSlotsNext7Days() {
  const startDay = dayjs().utc().startOf("day");
  const endDay = startDay.add(7, "day");

  const docs = [];
  for (let d = startDay; d.isBefore(endDay, "day"); d = d.add(1, "day")) {
    for (let h = HOURS_START; h < HOURS_END; h++) {
      for (let m of [0, 30]) {
        const start_at = d.hour(h).minute(m).second(0).millisecond(0).toDate();
        const end_at = d.hour(h).minute(m).add(30, "minute").toDate();
        docs.push({ start_at, end_at });
      }
    }
  }
  try {
    // unique on start_at so duplicates are ignored
    await Slot.insertMany(docs, { ordered: false });
    console.log("Slots ensured for next 7 days (UTC 09:00–17:00).");
  } catch (e) {
    // ignore dup errors
    if (e?.writeErrors) {
      // fine
    } else {
      console.error("Slot seeding error", e.message);
    }
  }
}
