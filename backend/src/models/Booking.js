import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slot_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
      unique: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

// unique index on slot_id prevents double booking globally
bookingSchema.index({ slot_id: 1 });

export default mongoose.model("Booking", bookingSchema);
