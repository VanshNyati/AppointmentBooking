import express from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Slot from "./models/Slot.js";
import Booking from "./models/Booking.js";
import { auth } from "./middleware/auth.js";
import { err } from "./utils/errors.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);

const router = express.Router();

// Schemas
const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /api/register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = RegisterSchema.parse(req.body);
    const exists = await User.findOne({ email });
    if (exists) throw err("EMAIL_TAKEN", "Email already registered", 409);
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password_hash,
      role: "patient",
    });
    return res
      .status(201)
      .json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
  } catch (e) {
    next(e);
  }
});

// POST /api/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    const user = await User.findOne({ email });
    if (!user)
      throw err("INVALID_CREDENTIALS", "Invalid email or password", 401);

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw err("INVALID_CREDENTIALS", "Invalid email or password", 401);

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔍 Debug logs here
    console.log("Generated token:", token);
    console.log("With payload:", { id: user._id.toString(), role: user.role });

    return res.json({ token, role: user.role });
  } catch (e) {
    next(e);
  }
});

// GET /api/slots?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get("/slots", async (req, res, next) => {
  try {
    const { from, to } = req.query;
    if (!from || !to)
      throw err("INVALID_RANGE", "from and to are required as YYYY-MM-DD", 400);

    const start = dayjs.utc(from + "T00:00:00Z").toDate();
    const end = dayjs.utc(to + "T23:59:59Z").toDate();

    const slots = await Slot.find({ start_at: { $gte: start, $lte: end } })
      .sort({ start_at: 1 })
      .lean();

    const booked = await Booking.find(
      { slot_id: { $in: slots.map((s) => s._id) } },
      { slot_id: 1 }
    ).lean();
    const bookedSet = new Set(booked.map((b) => b.slot_id.toString()));

    const available = slots
      .filter((s) => !bookedSet.has(s._id.toString()))
      .map((s) => ({
        id: s._id,
        start_at: s.start_at.toISOString(),
        end_at: s.end_at.toISOString(),
      }));

    return res.json({ available });
  } catch (e) {
    next(e);
  }
});

// POST /api/book { slotId }
router.post("/book", auth("patient"), async (req, res, next) => {
  try {
    const { slotId } = req.body || {};
    if (!slotId) throw err("INVALID_INPUT", "slotId is required", 400);
    const slot = await Slot.findById(slotId);
    if (!slot) throw err("NOT_FOUND", "Slot not found", 404);

    // unique index on slot_id guarantees no double-booking across users
    const booking = await Booking.create({
      user_id: req.user.id,
      slot_id: slot._id,
    });
    return res.status(201).json({
      id: booking._id,
      slot_id: booking.slot_id,
      created_at: booking.created_at,
    });
  } catch (e) {
    next(e);
  }
});

// GET /api/my-bookings
router.get("/my-bookings", auth("patient"), async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user_id: req.user.id })
      .populate("slot_id")
      .sort({ created_at: -1 })
      .lean();
    const out = bookings.map((b) => ({
      id: b._id,
      slot: {
        id: b.slot_id._id,
        start_at: b.slot_id.start_at.toISOString(),
        end_at: b.slot_id.end_at.toISOString(),
      },
      created_at: b.created_at,
    }));
    return res.json({ bookings: out });
  } catch (e) {
    next(e);
  }
});

// GET /api/all-bookings (admin)
router.get("/all-bookings", auth("admin"), async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("slot_id")
      .populate("user_id", "name email role")
      .sort({ created_at: -1 })
      .lean();
    const out = bookings.map((b) => ({
      id: b._id,
      user: {
        id: b.user_id._id,
        name: b.user_id.name,
        email: b.user_id.email,
        role: b.user_id.role,
      },
      slot: {
        id: b.slot_id._id,
        start_at: b.slot_id.start_at.toISOString(),
        end_at: b.slot_id.end_at.toISOString(),
      },
      created_at: b.created_at,
    }));
    return res.json({ bookings: out });
  } catch (e) {
    next(e);
  }
});

export default router;
