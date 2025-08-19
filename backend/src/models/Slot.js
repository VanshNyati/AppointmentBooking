import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    start_at: { type: Date, required: true, unique: true }, // unique start times
    end_at: { type: Date, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export default mongoose.model("Slot", slotSchema);
