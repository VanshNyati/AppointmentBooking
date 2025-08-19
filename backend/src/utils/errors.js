export const err = (code, message, status = 400) => {
  const e = new Error(message);
  e.status = status;
  e.code = code;
  return e;
};

export const handleErrors = (err, req, res, next) => {
  if (err.name === "ZodError") {
    return res
      .status(400)
      .json({
        error: {
          code: "INVALID_INPUT",
          message: err.errors?.[0]?.message || "Invalid input",
        },
      });
  }
  if (err.code === 11000) {
    // Mongo duplicate key (used for SLOT_TAKEN)
    return res
      .status(409)
      .json({
        error: { code: "SLOT_TAKEN", message: "This slot is already booked" },
      });
  }
  const status = err.status || 500;
  const code = err.code || "INTERNAL";
  return res
    .status(status)
    .json({ error: { code, message: err.message || "Server error" } });
};
